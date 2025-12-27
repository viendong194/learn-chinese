This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy on Cloudpages
Xóa các bản build cũ: rm -rf .next .vercel

Build lại: npx @cloudflare/next-on-pages --legacy-peer-deps

Deploy với thư mục static: npx wrangler pages deploy .vercel/output/static

Kiểm tra: Truy cập thẳng vào link gốc https://learn-chinese-e7e.pages.dev.

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

