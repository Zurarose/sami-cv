'use client';

import { routes } from '@/constant/routes';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Document } from '@prisma/client';
import { FileUser } from 'lucide-react';

export const DocumentList = ({ documents }: { documents: Document[] }) => {
  const router = useRouter();

  const handleRedirect = (documentId: string) => () => {
    router.push(routes.document(documentId));
  };

  return (
    <React.Fragment>
      {documents.map(document => (
        <div
          key={document.id}
          onClick={handleRedirect(document.id)}
          className="cursor-pointer shadow-md flex gap-4 min-w-16 max-w-60 flex-1 h-16 flex-col min-md:flex-row items-center justify-center py-2 px-2 min-lg:px-6 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <FileUser className="shrink-0 hidden min-lg:block" />
          <span className="line-clamp-2 text-center">{document.name}</span>
        </div>
      ))}
    </React.Fragment>
  );
};
