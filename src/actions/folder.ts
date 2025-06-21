import { routes } from '@/constant/routes';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const createFolder = async (folderName: string) => {
  const newFolder = await prisma.folder.create({
    data: {
      name: folderName,
    },
  });
  revalidatePath(routes.documents);
  return newFolder;
};

export const getFolders = async () => {
  const folders = await prisma.folder.findMany();
  return folders;
};

export const deleteFolder = async (folderId: string) => {
  const deletedFolder = await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });
  revalidatePath(routes.documents);
  return deletedFolder;
};

export const renameFolder = async (folderId: string, newName: string) => {
  const updatedFolder = await prisma.folder.update({
    where: { id: folderId },
    data: { name: newName },
  });
  revalidatePath(routes.documents);
  return updatedFolder;
};
