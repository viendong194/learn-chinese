/**
 * Webhook nhận thông báo thanh toán từ SePay.
 * Cấu hình trong SePay: URL = https://your-domain.com/api/webhooks/sepay
 * Authentication: Apikey (header Authorization: "Apikey YOUR_KEY")
 * Trong Cloudflare Pages: thêm biến môi trường SEPAY_WEBHOOK_API_KEY.
 */
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

const VOCAB_PREFIX = 'SEVQR-';
const UNLOCK_AMOUNT = 50000;

export async function POST(request) {
  // Lấy environment từ context trước
  const { env } = getRequestContext();
  
  try {
    const authHeader = request.headers.get('authorization') || '';
    
    // SỬA TẠI ĐÂY: Lấy từ env của Cloudflare, không dùng process.env
    const apiKey = env.SEPAY_WEBHOOK_API_KEY; 

    if (apiKey && authHeader !== `Apikey ${apiKey}`) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    console.log('Payload từ SePay:', JSON.stringify(body)); // Log để debug

    const { transferType, transferAmount, content, description } = body;

    if (transferType !== 'in') {
      return new Response(JSON.stringify({ success: true, message: 'Ignored: not incoming' }), 200);
    }

    // Gộp cả content và description để tìm mã
    const text = `${content} ${description}`.toUpperCase();
    
    // SỬA REGEX: Nới lỏng hơn để dễ khớp khi khách gõ tay
    // Tìm chuỗi bắt đầu bằng SEVQR- và lấy phần phía sau
    const match = text.match(/SEVQR-([A-Z0-9]{3,20})/); 
    const code = match ? match[1].trim() : null;

    if (!code) {
      console.log('Không tìm thấy mã đơn trong nội dung:', text);
      return new Response(JSON.stringify({ success: true, message: 'No valid code found' }), 200);
    }

    const kv = env.VOCAB_PAYMENTS;
    if (!kv) throw new Error("KV Binding VOCAB_PAYMENTS is missing");

    const key = `unlock:${code}`;
    await kv.put(key, Date.now().toString(), { expirationTtl: 60 * 60 * 24 * 90 });

    return new Response(JSON.stringify({ success: true, key_saved: key }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}