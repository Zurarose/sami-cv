export const RESPONSIBILITY_OPTIONS = [
  'Requirement definition',
  'Basic (logical) design',
  'Detailed (physical) design',
  'Manufacturing, unit test',
  'Combined test, comprehensive test',
  'Maintenance',
  'Operation',
  'Others',
];

export const MAX_PHOTO_FILE_BYTES = 2 * 1024 * 1024;

/** Longest edge after server-side resize (Sharp), keeps JSON payload small. */
export const DOCUMENT_PHOTO_MAX_DIMENSION_PX = 1024;

/** WebP quality for stored profile photos (Sharp). */
export const DOCUMENT_PHOTO_WEBP_QUALITY = 82;

export const ACCEPTED_IMAGE_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

/** When `File.type` is empty, allow extensions matching {@link ACCEPTED_IMAGE_FILE_TYPES} only. */
export function isAcceptedImageFile(file: {
  type: string;
  name: string;
}): boolean {
  if (file.type) {
    return ACCEPTED_IMAGE_FILE_TYPES.includes(file.type);
  }
  return /\.(jpe?g|png|webp)$/i.test(file.name);
}
