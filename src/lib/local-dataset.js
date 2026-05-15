import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DATASET_PATH = path.join(process.cwd(), 'src/data/potrero-alto.json');

const DEFAULT_DATASET = {
  id: '6574670919',
  name: 'Potrero Alto',
  location: 'San Martín de los Andes, Neuquén, Argentina',
  description: '',
  subsectors: []
};

function normalizeData(data) {
  return {
    ...DEFAULT_DATASET,
    ...data,
    subsectors: Array.isArray(data?.subsectors) ? data.subsectors : []
  };
}

export async function readLocalDataset() {
  try {
    const raw = await readFile(DATASET_PATH, 'utf8');
    return normalizeData(JSON.parse(raw));
  } catch {
    return DEFAULT_DATASET;
  }
}

export async function writeLocalDataset(data) {
  const normalizedData = normalizeData(data);
  await writeFile(DATASET_PATH, `${JSON.stringify(normalizedData, null, 2)}\n`, 'utf8');
  return normalizedData;
}
