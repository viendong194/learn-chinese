## Deploy on Cloudpages
Xóa các bản build cũ: rm -rf .next .vercel

Build lại: npx @cloudflare/next-on-pages

Deploy với thư mục static: npx wrangler pages deploy .vercel/output/static

Kiểm tra: Truy cập thẳng vào link gốc https://learn-chinese-e7e.pages.dev.

## SePay + KV (xác nhận thanh toán từ vựng HSK)

1. **Tạo KV namespace (Cloudflare Dashboard hoặc Wrangler):**
   ```bash
   npx wrangler kv namespace create VOCAB_PAYMENTS
   ```
   Copy `id` từ output, mở `wrangler.toml` và thay `REPLACE_WITH_YOUR_KV_NAMESPACE_ID` bằng id đó.

2. **Cấu hình SePay webhook:**
   - Vào [SePay WebHooks](https://my.sepay.vn/webhooks) → Thêm webhook.
   - **URL:** `https://your-domain.com/api/webhooks/sepay`
   - **Loại xác thực:** Apikey. Tạo API Key trong SePay, sau đó thêm biến môi trường trên Cloudflare Pages: `SEPAY_WEBHOOK_API_KEY` = API Key đó.
   - **Sự kiện:** Chọn “Tiền vào” (money in).

3. **Biến môi trường trên Cloudflare Pages:**
   - `SEPAY_WEBHOOK_API_KEY`: API Key từ SePay (để webhook xác thực).

4. **Luồng người dùng:** Người dùng chuyển khoản 50.000đ với nội dung **SEVQR-XXXXXXXX** (mã hiển thị trong modal). SePay gửi webhook → API lưu mã vào KV → Người dùng nhấn “Kiểm tra & Mở khóa” → API kiểm tra KV và trả về unlocked.

## prompt:

Dựa trên nội dung tiếng Trung sau đây: "${content}"
    Hãy tạo một file JSON bài tập tiếng Trung với cấu trúc chính xác như sau:
    {
      "lesson": "${fileName}",
      "exercises": [
    { "type": "fill_blank", "question": "我 ___ 老师", "answer": "是" },
    { "type": "mcq", "question": "Chào buổi sáng tiếng Trung là gì?", "options": ["你好", "早上好", "再见"], "answer": "早上好" },
    { "type": "order", "question": "我,是,老师", "answer": "我是老师" },
    { "type": "matching", "question": "你好:Hello, 谢谢:Thanks", "answer": "" }
  ]
    }
    Yêu cầu:
    1. Fill_blank: Câu tiếng Trung trống 1 chỗ, choices gồm các từ vựng trong bài.
    2. MCQ: Câu hỏi bằng tiếng Việt về ngữ pháp hoặc tình huống, choices là các câu tiếng Trung.
    3. Matching: Nối từ vựng Trung - Việt.
    4. Speaker: Xác định ai là người nói câu đó dựa trên ngữ cảnh đoạn văn.
    5. Order: Sắp xếp các câu hội thoại theo thứ tự logic.
    Chỉ trả về JSON thô, không kèm văn bản giải thích.



Hướng dẫn sử dụng cho bạn từ nay về sau:
Bước 1: Thiết lập API Key (Chỉ làm 1 lần) Hãy đảm bảo bạn đã tạo file .env.local ở thư mục gốc của dự án, và đưa "chìa khoá" Gemini API vào đó:

env
GEMINI_API_KEY=AIzaSy...
(Nếu chưa có key, bạn vào aistudio.google.com để lấy nhé).

Bước 2: Tạo bài tập mỗi khi có video mới Ví dụ ID bài học của bạn trên Google sheet là bai-hoc-so-1, link youtube là https://www.youtube.com/watch?v=XYZ123: Mở terminal và gõ lệnh:

bash
npm run generate-exercises "https://www.youtube.com/watch?v=XYZ123" "bai-hoc-so-1"
Bạn chờ khoảng 10-20 giây, hệ thống sẽ báo lưu thành công vào file src/data/exercises/bai-hoc-so-1.json.

Bước 3: Tận hưởng kết quả Bây giờ nếu bạn chạy npm run dev (hoặc build lên Cloudflare), code sẽ tự ăn bài tập AI vào giao diện cực chuần xác mà không cần dán data JSON khổng lồ vào Google Sheets nữa!

Bạn có muốn kiểm tra lại code hoặc chạy thử một link YouTube nào luôn không? Cứ gõ lệnh ở terminal để xem ma thuật nhé! Tôi có giúp gì thêm được không?
