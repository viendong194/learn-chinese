/**
 * Kiểm tra mã chuyển khoản đã được SePay webhook ghi nhận chưa.
 * GET /api/vocab/check-unlock?code=XXXXX
 */
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let rawCode = searchParams.get('code')?.trim() || '';

    // Xử lý tiền tố SEVQR-
    let code = rawCode;
    if (code.toUpperCase().startsWith('SEVQR-')) {
      code = code.slice(6).trim();
    }

    if (!code || code.length < 6 || code.length > 20) {
      return new Response(JSON.stringify({ unlocked: false, error: 'Mã không hợp lệ' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // LẤY CONTEXT VÀ KIỂM TRA BINDING
    const context = getRequestContext();
    if (!context || !context.env) {
      console.error("Lỗi: Không tìm thấy Cloudflare Context. Bạn có đang chạy bằng wrangler không?");
      return new Response(JSON.stringify({ error: 'Môi trường không hỗ trợ' }), { status: 500 });
    }

    const kv = context.env.VOCAB_PAYMENTS;
    
    // ĐÂY LÀ CHỖ GÂY LỖI: Kiểm tra xem KV có tồn tại không trước khi gọi .get()
    if (!kv) {
      console.error("Lỗi: Binding VOCAB_PAYMENTS chưa được cấu hình trên Dashboard Cloudflare.");
      return new Response(JSON.stringify({ error: 'Hệ thống chưa cấu hình KV' }), { status: 500 });
    }

    const key = `unlock:${code}`;
    const value = await kv.get(key);

    return new Response(JSON.stringify({ 
      unlocked: !!value, 
      message: value ? 'Đã thanh toán' : 'Chưa nhận được thanh toán' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error('check-unlock error:', e);
    return new Response(JSON.stringify({ error: 'Lỗi server nội bộ' }), { status: 500 });
  }
}