/**
 * Chuyển file Excel "Từ Vựng HSK 1-6 (Bản 3.0).xlsx" sang JSON.
 * Chạy: node scripts/excel-to-json.js
 * Output: src/data/hsk-vocab.json
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_PATH = path.join(__dirname, '..', 'Từ Vựng HSK 1-6 (Bản 3.0).xlsx');
const OUT_DIR = path.join(__dirname, '..', 'src', 'data');
const OUT_FILE = path.join(OUT_DIR, 'hsk-vocab.json');

const VOCAB_SHEETS = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSk 6'];

function isValidVocabRow(row) {
  const stt = row[0];
  const word = row[1];
  if (stt == null || word == null) return false;
  const numStt = Number(stt);
  if (!Number.isInteger(numStt) || numStt < 1) return false;
  const strWord = String(word).trim();
  if (!strWord) return false;
  return true;
}

function rowToItem(row) {
  return {
    stt: row[0],
    word: String(row[1] ?? '').trim(),
    pinyin: String(row[3] ?? '').trim(),
    type: String(row[4] ?? '').trim(),
    meaning: String(row[5] ?? '').trim(),
    tip: row[6] ? String(row[6]).trim() : null,
  };
}

function run() {
  if (!fs.existsSync(EXCEL_PATH)) {
    console.error('Không tìm thấy file Excel:', EXCEL_PATH);
    process.exit(1);
  }

  const wb = XLSX.readFile(EXCEL_PATH);
  const result = { levels: [], vocab: {} };

  for (const sheetName of VOCAB_SHEETS) {
    const ws = wb.Sheets[sheetName];
    if (!ws) continue;

    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const items = rows
      .filter((row) => isValidVocabRow(row))
      .map((row) => rowToItem(row));

    result.levels.push(sheetName);
    result.vocab[sheetName] = items;
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(result, null, 2), 'utf8');
  console.log('Đã ghi:', OUT_FILE);
  result.levels.forEach((level) => {
    console.log('  -', level + ':', result.vocab[level].length, 'từ');
  });
}

run();
