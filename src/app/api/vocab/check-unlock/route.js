/**
 * Kiểm tra mã chuyển khoản đã được SePay webhook ghi nhận chưa.
 * GET /api/vocab/check-unlock?code=XXXXX
 */
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let code = searchParams.get('code')?.trim();

  if (!code) {
    return new Response(JSON.stringify({ unlocked: false, error: 'Mã không hợp lệ' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (code.toUpperCase().startsWith('TVHSK-')) {
    code = code.slice(6).trim();
  }
  if (code.length < 6 || code.length > 20) {
    return new Response(JSON.stringify({ unlocked: false, error: 'Mã không hợp lệ' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { env } = getRequestContext();
    const kv = env.VOCAB_PAYMENTS;
    const key = `unlock:${code}`;
    const value = await kv.get(key);

    if (value) {
      return new Response(JSON.stringify({ unlocked: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ unlocked: false, error: 'Chưa nhận được thanh toán' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('check-unlock error:', e);
    return new Response(JSON.stringify({ unlocked: false, error: 'Lỗi hệ thống' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
