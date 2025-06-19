import { z } from 'zod';

export const createFolderSchema = z.object({
  folderName: z
    .string()
    .min(2, {
      message: 'Folder name must be at least 2 characters.',
    })
    .max(20, {
      message: 'Folder name must be less than 20 characters.',
    }),
});
