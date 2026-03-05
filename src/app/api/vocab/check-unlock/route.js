/**
 * Kiểm tra mã chuyển khoản đã được SePay webhook ghi nhận chưa.
 * Khi thành công: tạo session lưu KV + set cookie HttpOnly (không dùng localStorage).
 * GET /api/vocab/check-unlock?code=XXXXX
 */
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

const COOKIE_NAME = 'vocab_premium';
const SESSION_PREFIX = 'premium_session:';
// Trả 1 lần = dùng vĩnh viễn: cookie 10 năm, KV không hết hạn
const COOKIE_MAX_AGE = 10 * 365 * 24 * 60 * 60; // 10 năm (giây)

function getCookieHeader(token) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawCode = searchParams.get('code')?.trim() || '';

    let cleanCode = rawCode.toUpperCase();
    if (cleanCode.startsWith('SEVQR-')) {
      cleanCode = cleanCode.replace('SEVQR-', '');
    } else if (cleanCode.startsWith('SEVQR')) {
      cleanCode = cleanCode.replace('SEVQR', '');
    }

    if (!cleanCode || cleanCode.length < 3) {
      return new Response(JSON.stringify({ unlocked: false, error: 'Mã không hợp lệ' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const context = getRequestContext();
    const kv = context?.env?.VOCAB_PAYMENTS;

    if (!kv) {
      console.error("KV Binding không tồn tại");
      return new Response(JSON.stringify({ unlocked: false, error: 'Hệ thống chưa cấu hình' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const key = `unlock:${cleanCode}`;
    const value = await kv.get(key);

    if (!value) {
      return new Response(
        JSON.stringify({ unlocked: false, error: 'Chưa nhận được thanh toán cho mã này' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Tạo session vĩnh viễn: không set expirationTtl → KV lưu mãi đến khi xóa
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
    const sessionKey = `${SESSION_PREFIX}${token}`;
    await kv.put(sessionKey, Date.now().toString());

    return new Response(
      JSON.stringify({ unlocked: true, message: 'Đã kích hoạt thành công' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': getCookieHeader(token),
        },
      }
    );
  } catch (err) {
    console.error('Check-unlock error:', err);
    return new Response(JSON.stringify({ unlocked: false, error: 'Lỗi hệ thống' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}