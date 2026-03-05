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
  try {
    const authHeader = request.headers.get('authorization') || '';
    const apiKey = process.env.SEPAY_WEBHOOK_API_KEY;
    if (apiKey && authHeader !== `Apikey ${apiKey}`) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const {
      transferType,
      transferAmount,
      content,
      description,
      referenceCode,
    } = body;

    if (transferType !== 'in') {
      return new Response(JSON.stringify({ success: true, message: 'Ignored: not incoming' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const amount = Number(transferAmount);
    if (amount < UNLOCK_AMOUNT) {
      return new Response(JSON.stringify({ success: true, message: 'Ignored: amount too low' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const text = [content, description].filter(Boolean).join(' ');
    const match = text.includes(VOCAB_PREFIX) && text.match(new RegExp(`${VOCAB_PREFIX}([A-Za-z0-9-]{6,20})`));
    const code = match ? match[1].trim() : null;

    if (!code) {
      return new Response(JSON.stringify({ success: true, message: 'Ignored: no valid code' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let kv;
    try {
      const { env } = getRequestContext();
      kv = env.VOCAB_PAYMENTS;
    } catch (e) {
      console.error('KV not available:', e);
      return new Response(JSON.stringify({ success: false, message: 'KV not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const key = `unlock:${code}`;
    await kv.put(key, Date.now().toString(), { expirationTtl: 60 * 60 * 24 * 90 }); // 90 ngày

    return new Response(JSON.stringify({ success: true, code }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('SePay webhook error:', err);
    return new Response(JSON.stringify({ success: false, message: String(err?.message || err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
