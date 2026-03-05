/**
 * Webhook nhận thông báo thanh toán từ SePay.
 * Cấu hình trong SePay: URL = https://your-domain.com/api/webhooks/sepay
 * Authentication: Apikey (header Authorization: "Apikey YOUR_KEY")
 * Trong Cloudflare Pages: thêm biến môi trường SEPAY_WEBHOOK_API_KEY.
 */
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const context = getRequestContext();
    const env = context?.env;
    const body = await request.json();
    
    // Log để bạn kiểm tra trong Cloudflare Dashboard
    console.log("Payload SePay nhận được:", JSON.stringify(body));

    const { transferType, transferAmount, content, description } = body;

    // 1. Chỉ xử lý giao dịch tiền vào
    if (transferType !== 'in') {
      return new Response(JSON.stringify({ success: true, msg: "Không phải tiền vào" }), { status: 200 });
    }

    // 2. Gộp nội dung và tìm mã đơn hàng
    const text = `${content} ${description}`.toUpperCase();
    
    // Regex mới: Tìm chữ SEVQR và lấy chuỗi ký tự/số ngay sau nó (từ 3-15 ký tự)
    // Nó sẽ tự dừng khi gặp dấu chấm, dấu cách hoặc ký tự đặc biệt
    const match = text.match(/SEVQR([A-Z0-9]{3,15})/);
    
    if (!match) {
      console.log("Không tìm thấy mã SEVQR trong nội dung:", text);
      return new Response(JSON.stringify({ success: true, msg: "No code found" }), { status: 200 });
    }

    const cleanCode = match[1]; // Ví dụ: NPUJHJHS (đã loại bỏ SEVQR và .CT)
    const kv = env?.VOCAB_PAYMENTS;

    if (!kv) {
      console.error("LỖI: Chưa bind KV VOCAB_PAYMENTS trong Dashboard Cloudflare!");
      return new Response(JSON.stringify({ error: "KV Missing" }), { status: 500 });
    }

    // 3. Lưu vào KV với key sạch
    const key = `unlock:${cleanCode}`;
    await kv.put(key, Date.now().toString(), { 
      expirationTtl: 60 * 60 * 24 * 90 // Lưu trong 90 ngày
    });

    console.log(`Đã mở khóa thành công cho mã: ${cleanCode}`);
    return new Response(JSON.stringify({ success: true, code: cleanCode }), { status: 200 });

  } catch (err) {
    console.error("Webhook Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}