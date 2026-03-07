import hskData from '@/data/hsk-vocab.json';
import PracticeClientPage from './PracticeClientPage';

export const metadata = {
  title: 'Luyện tập từ vựng HSK',
  description:
    'Luyện tập từ vựng HSK 1-6: chọn nghĩa đúng, chọn chữ đúng, nối từ, đúng/sai. Ôn từ vựng tiếng Trung.',
  openGraph: {
    title: 'Luyện tập từ vựng HSK | Mr. Chinese Channel',
  },
};

export default function VocabPracticePage() {
  return <PracticeClientPage levels={hskData.levels} vocab={hskData.vocab} />;
}
