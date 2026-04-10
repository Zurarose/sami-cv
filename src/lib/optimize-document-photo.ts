import sharp from 'sharp';
import {
  DOCUMENT_PHOTO_MAX_DIMENSION_PX,
  DOCUMENT_PHOTO_WEBP_QUALITY,
} from '@/constant/common';

const DATA_URL_REGEX = /^data:[^;]+;base64,(.+)$/i;

/**
 * Resizes and re-encodes profile photos as WebP so stored JSON stays small.
 */
export async function optimizeDocumentPhotoDataUrl(
  photo: string
): Promise<string> {
  if (!photo.trim()) return photo;

  const match = DATA_URL_REGEX.exec(photo);
  if (!match) {
    return photo;
  }

  const inputBuffer = Buffer.from(match[1], 'base64');

  const outputBuffer = await sharp(inputBuffer)
    .rotate()
    .resize(DOCUMENT_PHOTO_MAX_DIMENSION_PX, DOCUMENT_PHOTO_MAX_DIMENSION_PX, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: DOCUMENT_PHOTO_WEBP_QUALITY })
    .toBuffer();

  return `data:image/webp;base64,${outputBuffer.toString('base64')}`;
}
