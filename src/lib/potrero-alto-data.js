import { readLocalDataset } from '@/lib/local-dataset';

export async function getPotreroAltoData() {
  return readLocalDataset();
}
