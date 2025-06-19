'use server';

import { routes } from '@/constant/routes';
import prisma from '@/lib/prisma';
import { Document } from '@prisma/client';
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
  await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });
  revalidatePath(routes.documents);
};

export const getDocuments = async (folderId: string) => {
  const documents = await prisma.document.findMany({
    where: {
      folderId,
    },
  });
  return documents;
};

export const deleteDocument = async (documentId: string) => {
  await prisma.document.delete({
    where: {
      id: documentId,
    },
  });
  revalidatePath(routes.folder(documentId));
};

export const createDocument = async (
  document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'folder'>
) => {
  const newDocument = await prisma.document.create({
    data: {
      name: document.name,
      folderId: document.folderId,
      data: document.data || {},
    },
  });
  revalidatePath(routes.folder(newDocument.folderId));
  return newDocument;
};
