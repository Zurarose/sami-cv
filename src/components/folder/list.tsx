'use client';

import { routes } from '@/constant/routes';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Document } from '@prisma/client';
import { FileUser } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/ui-kit/basic/context-menu';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES } from '@/constant/messages';

export const DocumentList = ({
  documents,
}: {
  documents: (Document & { editLink: string })[];
}) => {
  const router = useRouter();

  const handleRedirect = (documentId: string, newTab?: boolean) => () => {
    if (newTab) {
      window.open(routes.document(documentId), '_blank');
    } else {
      router.push(routes.document(documentId));
    }
  };

  const handleCopyEditLink = (link: string) => () => {
    navigator.clipboard.writeText(link);
    toast.success(SUCCESS_MESSAGES.LinkCopied);
  };

  return (
    <React.Fragment>
      {documents.map(document => (
        <ContextMenu key={document.id}>
          <ContextMenuTrigger>
            <div
              key={document.id}
              onClick={handleRedirect(document.id)}
              className="flex-row cursor-pointer shadow-md flex gap-x-1 min-w-16 flex-1 h-16 items-center justify-start py-2 px-2 min-lg:px-4 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <FileUser size={30} className="shrink-0 hidden min-lg:block" />
              <div className="flex flex-col items-start justify-center gap-x-2">
                <span className="text-sm line-clamp-1">{document.name}</span>
                <span className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {`Updated ${new Date(document.updatedAt).toLocaleDateString()} ${new Date(
                    document.updatedAt
                  ).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false,
                  })} v${document.version}`}
                </span>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={handleRedirect(document.id, true)}>
              Open in new tab
            </ContextMenuItem>
            <ContextMenuItem onClick={handleCopyEditLink(document.editLink)}>
              Copy edit link
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </React.Fragment>
  );
};
