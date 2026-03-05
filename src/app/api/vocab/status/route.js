/**
 * Kiểm tra trạng thái premium từ cookie (session lưu trên KV).
 * GET /api/vocab/status — gửi kèm cookie (credentials: 'include').
 */
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

const COOKIE_NAME = 'vocab_premium';
const SESSION_PREFIX = 'premium_session:';

function getTokenFromCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1].trim() : null;
}

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get('Cookie');
    const token = getTokenFromCookie(cookieHeader);

    if (!token) {
      return new Response(JSON.stringify({ premium: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let kv;
    try {
      const { env } = getRequestContext();
      kv = env.VOCAB_PAYMENTS;
    } catch {
      return new Response(JSON.stringify({ premium: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!kv) {
      return new Response(JSON.stringify({ premium: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionKey = `${SESSION_PREFIX}${token}`;
    const value = await kv.get(sessionKey);

    return new Response(
      JSON.stringify({ premium: !!value }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('vocab/status error:', err);
    return new Response(JSON.stringify({ premium: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
