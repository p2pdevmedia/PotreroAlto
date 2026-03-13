import { readdir } from 'node:fs/promises';
import path from 'node:path';

export async function getPublicImagePaths() {
  try {
    const imagesDirectory = path.join(process.cwd(), 'public', 'images');
    const files = await readdir(imagesDirectory, { withFileTypes: true });

    return files
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(fileName))
      .sort((left, right) => left.localeCompare(right, 'es'))
      .map((fileName) => `/images/${fileName}`);
  } catch {
    return [];
  }
}
