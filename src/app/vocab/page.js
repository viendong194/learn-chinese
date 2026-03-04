import hskData from '@/data/hsk-vocab.json';
import VocabClientPage from './VocabClientPage';

export const metadata = {
  title: 'Từ vựng HSK | Mr.Chinese Channel',
  description: 'Học từ vựng HSK 1-6 bằng flashcard.',
};

export default function VocabPage() {
  return <VocabClientPage levels={hskData.levels} vocab={hskData.vocab} />;
}
