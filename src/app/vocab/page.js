import hskData from '@/data/hsk-vocab.json';
import VocabClientPage from './VocabClientPage';

export const metadata = {
  title: 'Từ vựng HSK 1-6',
  description:
    'Học từ vựng HSK 1, HSK 2, HSK 3, HSK 4, HSK 5, HSK 6 với Mr. Chinese Channel. Flashcard, phát âm, luyện viết chữ Hán. Ôn từ vựng cho luyện thi HSK.',
  keywords: [
    'từ vựng HSK',
    'HSK 1',
    'HSK 2',
    'HSK 3',
    'HSK 4',
    'HSK 5',
    'HSK 6',
    'học tiếng Trung',
    'Chinese vocabulary',
    'luyện thi HSK',
    'flashcard HSK',
    'luyện viết chữ Hán',
    'Mr. Chinese Channel',
  ],
  openGraph: {
    title: 'Từ vựng HSK 1-6 | Mr. Chinese Channel - Học tiếng Trung',
    description: 'Flashcard từ vựng HSK 1 đến HSK 6. Phát âm, luyện viết. Ôn tập luyện thi HSK.',
  },
};

export default function VocabPage() {
  return <VocabClientPage levels={hskData.levels} vocab={hskData.vocab} />;
}
