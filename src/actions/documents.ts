'use server';

import { routes } from '@/constant/routes';
import prisma from '@/lib/prisma';
import { Document } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { createCipheriv, createDecipheriv, createHash } from 'crypto';

// Generate a fixed IV and key from your secret
const secret = process.env.MAGIC_LINK_SECRET!;
const key = createHash('sha256').update(secret).digest(); // 32 bytes for AES-256
const iv = createHash('md5').update(secret).digest(); // 16 bytes for IV

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

export const getDocuments = async (folderId: string) => {
  const documents = await prisma.document.findMany({
    where: {
      folderId,
    },
  });
  return documents;
};

export const getDocument = async (documentId: string) => {
  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });
  return document;
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

export const generateDocumentEditLink = async (documentId: string) => {
  const document = await getDocument(documentId);
  if (!document) throw new Error('Document not found');
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encryptedDocumentId = cipher.update(documentId, 'utf-8', 'hex');
  encryptedDocumentId += cipher.final('hex');

  const editLink = `${process.env.NEXT_PUBLIC_APP_URL}/magic-link/${encryptedDocumentId}`;
  return editLink;
};

export const getDocumentFromMagicLink = async (magicLink: string) => {
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  let decryptedDocumentId = decipher.update(magicLink, 'hex', 'utf-8');
  decryptedDocumentId += decipher.final('utf-8');

  const document = await getDocument(decryptedDocumentId);
  return document;
};
