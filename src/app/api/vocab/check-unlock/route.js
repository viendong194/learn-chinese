/**
 * Kiểm tra mã chuyển khoản đã được SePay webhook ghi nhận chưa.
 * GET /api/vocab/check-unlock?code=XXXXX
 */
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawCode = searchParams.get('code')?.trim() || '';

    // 1. Làm sạch mã người dùng nhập (Xóa SEVQR- nếu có)
    let cleanCode = rawCode.toUpperCase();
    if (cleanCode.startsWith('SEVQR-')) {
        cleanCode = cleanCode.replace('SEVQR-', '');
    } else if (cleanCode.startsWith('SEVQR')) {
        cleanCode = cleanCode.replace('SEVQR', '');
    }

    if (!cleanCode || cleanCode.length < 3) {
      return new Response(JSON.stringify({ unlocked: false, error: 'Mã không hợp lệ' }), { status: 400 });
    }

    // 2. Lấy KV từ context
    const context = getRequestContext();
    const kv = context?.env?.VOCAB_PAYMENTS;

    if (!kv) {
      console.error("LỖI: KV Binding không tồn tại!");
      return new Response(JSON.stringify({ error: "Hệ thống chưa cấu hình" }), { status: 500 });
    }

    // 3. Truy vấn mã sạch trong KV
    const key = `unlock:${cleanCode}`;
    const value = await kv.get(key);

    if (value) {
      return new Response(JSON.stringify({ 
        unlocked: true, 
        message: "Đã kích hoạt thành công",
        timestamp: value 
      }), { status: 200 });
    }

    return new Response(JSON.stringify({ 
        unlocked: false, 
        error: "Chưa nhận được thanh toán cho mã này" 
    }), { status: 200 });

  } catch (err) {
    console.error("Check-unlock error:", err.message);
    return new Response(JSON.stringify({ error: "Lỗi hệ thống" }), { status: 500 });
  }
}