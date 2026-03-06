import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load variables from .env.local
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ Không tìm thấy GEMINI_API_KEY trong file .env.local!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
    const youtubeUrl = process.argv[2];
    const lessonId = process.argv[3];

    if (!youtubeUrl || !lessonId) {
        console.log("🛠️ Cách dùng: npm run generate-exercises <link_youtube> <lesson_id>");
        console.log("Ví dụ: npm run generate-exercises \"https://www.youtube.com/watch?v=abcd\" \"bai-hoc-1\"");
        return;
    }

    console.log(`⏳ Đang lấy phụ đề từ: ${youtubeUrl}...`);
    let transcript = [];
    try {
        transcript = await YoutubeTranscript.fetchTranscript(youtubeUrl);
    } catch (err) {
        console.error("❌ Lỗi khi lấy phụ đề. Có thể video không có CC (phụ đề).", err.message);
        return;
    }

    const text = transcript.map(t => t.text).join(' ');

    // Note: Use gemini-1.5-flash for the fastest available model or just gemini-pro depending on the API Key region setup
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Dưới đây là một phần nội dung phụ đề của một video dạy ngôn ngữ tiếng Trung:

${text}

Dựa vào nội dung trên, hãy tạo ra một bài tập có đầy đủ các dạng sau để người học thực hành, và CHỈ TRẢ VỀ MỘT ĐỐI TƯỢNG JSON ĐÚNG ĐỊNH DẠNG:
{
  "exercises": [
    {
      "type": "fill_blank",
      "question": "Câu có chỗ trống dùng ___ để điền",
      "choices": ["từ điền", "từ sai 1", "từ sai 2", "từ sai 3"],
      "answer": "từ điền"
    },
    {
      "type": "matching",
      "pairs": [
        { "left": "Từ tiếng Trung", "right": "Nghĩa tiếng Việt" }
      ]
    },
    {
      "type": "mcq",
      "question": "Câu hỏi trắc nghiệm?",
      "options": ["A", "B", "C", "D"],
      "answer": "A"
    },
    {
      "type": "order",
      "words": ["từ", "lộn", "xộn"]
    },
    {
      "type": "true_false",
      "question": "Nhận định nào đó",
      "answer": true
    }
  ]
}

Lưu ý:
1. Bạn phải dựa vào nội dung video trên để sinh ra các câu thực tế.
2. Sinh ít nhất: 3 câu điền khuyết (fill_blank), 3 cặp từ vựng (matching - gom chung trong 1 question object hoặc nhiều object matching độc lập đều được theo mảng exercises), 3 câu hỏi trắc nghiệm (mcq), 2 câu sắp xếp (order), 2 nhận định đúng sai (true_false).
3. Tuyệt đối KHÔNG trả về markdown (không \`\`\`json), chỉ trả về văn bản json thuần túy để parse luôn.`;

    try {
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Clean up if Gemini accidentally wraps in markdown
        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json|```/g, '').trim();
        } else if (responseText.startsWith('```')) {
            responseText = responseText.replace(/```/g, '').trim();
        }

        // validate JSON
        JSON.parse(responseText);

        const dirPath = path.join(process.cwd(), 'src/data/exercises');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, `${lessonId}.json`);
        fs.writeFileSync(filePath, responseText);
        console.log(`✅ Thành công! Đã lưu bài tập tại: ${filePath}`);

    } catch (err) {
        console.error("❌ Lỗi khi AI tạo bài tập hoặc parse JSON: ", err.message);
    }
}

main();
