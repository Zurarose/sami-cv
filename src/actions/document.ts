'use server';

import { routes } from '@/constant/routes';
import prisma from '@/lib/prisma';
import { Document } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { createCipheriv, createDecipheriv, createHash } from 'crypto';
import { DocumentData } from '@/types/document';
import { InputJsonValue } from '@prisma/client/runtime/library';
import { MAX_PHOTO_FILE_BYTES } from '@/constant/common';
import { optimizeDocumentPhotoDataUrl } from '@/lib/optimize-document-photo';
import { toMonthYearValue } from '@/lib/date';

/** Max base64 character count that can represent MAX_PHOTO_FILE_BYTES of binary (+ padding). */
const MAX_PHOTO_BASE64_PAYLOAD_CHARS =
  4 * Math.ceil(MAX_PHOTO_FILE_BYTES / 3) + 2;

function assertDocumentPhotoSizeWithinLimit(photo: string) {
  if (!photo.trim()) return;

  const match = /^data:[^;]+;base64,(.+)$/i.exec(photo);
  if (!match) {
    throw new Error(
      'Document photo must be a base64 data URL (data:image/...;base64,...).'
    );
  }

  if (match[1].length > MAX_PHOTO_BASE64_PAYLOAD_CHARS) {
    throw new Error(
      `Document photo must not exceed ${MAX_PHOTO_FILE_BYTES / (1024 * 1024)} MB`
    );
  }

  const byteLength = Buffer.from(match[1], 'base64').length;
  if (byteLength > MAX_PHOTO_FILE_BYTES) {
    throw new Error(
      `Document photo must not exceed ${MAX_PHOTO_FILE_BYTES / (1024 * 1024)} MB`
    );
  }
}

// Generate a fixed IV and key from your secret
const secret = process.env.MAGIC_LINK_SECRET!;
const key = createHash('sha256').update(secret).digest(); // 32 bytes for AES-256
const iv = createHash('md5').update(secret).digest(); // 16 bytes for IV

export const getDocuments = async (folderId: string) => {
  const documents = await prisma.document.findMany({
    where: {
      folderId,
    },
    omit: {
      data: true,
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
  const deletedDocument = await prisma.document.delete({
    where: {
      id: documentId,
    },
  });
  revalidatePath(routes.folder(documentId));
  return deletedDocument;
};

export const renameDocument = async (documentId: string, newName: string) => {
  const updatedDocument = await prisma.document.update({
    where: { id: documentId },
    data: { name: newName },
  });
  revalidatePath(routes.folder(documentId));
  return updatedDocument;
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

export const updateDocument = async (
  documentId: string,
  data: DocumentData,
  summary?: string | null
) => {
  const normalizedData: DocumentData = {
    ...data,
    education: data.education.map(education => ({
      ...education,
      startDate: toMonthYearValue(education.startDate),
      endDate: toMonthYearValue(education.endDate),
    })),
    projects: data.projects.map(project => ({
      ...project,
      startDate: toMonthYearValue(project.startDate),
      endDate: toMonthYearValue(project.endDate),
    })),
  };

  assertDocumentPhotoSizeWithinLimit(data.photo);

  let photo = normalizedData.photo;
  if (photo.trim()) {
    try {
      photo = await optimizeDocumentPhotoDataUrl(photo);
    } catch {
      throw new Error(
        'Could not process the profile photo. Try another image.'
      );
    }
    assertDocumentPhotoSizeWithinLimit(photo);
  }

  const updatedDocument = await prisma.document.update({
    where: { id: documentId },
    data: {
      data: { ...normalizedData, photo } as unknown as InputJsonValue,
      version: { increment: 1 },
      ...(summary && { summary }),
    },
  });
  return updatedDocument;
};

export const generateDocumentEditLink = async (document: string | Document) => {
  let documentData: Document | null = null;

  if (typeof document === 'string') {
    documentData = await getDocument(document);
  } else {
    documentData = document;
  }

  if (!documentData) throw new Error('Document not found');
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encryptedDocumentId = cipher.update(
    `${documentData.id}-${documentData.version}`,
    'utf-8',
    'hex'
  );
  encryptedDocumentId += cipher.final('hex');

  const editLink = `${process.env.NEXT_PUBLIC_APP_URL}/magic-link/${encryptedDocumentId}`;
  return editLink;
};

export const getDocumentFromMagicLink = async (magicLink: string) => {
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  let decryptedDocumentId = decipher.update(magicLink, 'hex', 'utf-8');
  decryptedDocumentId += decipher.final('utf-8');

  const [documentId, version] = decryptedDocumentId.split('-');
  const document = await getDocument(documentId);
  if (!document) return null;
  if (document.version !== parseInt(version)) return null;
  return document;
};
