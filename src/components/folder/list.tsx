'use client';

import { routes } from '@/constant/routes';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { Document } from '@prisma/client';
import { FileUser } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/ui-kit/basic/context-menu';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES } from '@/constant/messages';
import { DeleteDialog } from './delete-dialog';
import { renameDocument } from '@/actions/document';
import { Textarea } from '@/ui-kit/basic/textarea';
import { cn } from '@/lib/utils';

export const DocumentList = ({
  documents,
}: {
  documents: (Document & { editLink: string })[];
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<{
    id: string;
    isRenaming: boolean;
  } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleDeleteClick = (documentId: string) => () => {
    setSelectedDocumentId({ id: documentId, isRenaming: false });
    setDeleteDialogOpen(true);
  };

  const handleRenameClick = (documentId: string) => () => {
    setSelectedDocumentId({ id: documentId, isRenaming: true });
    // setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleRenameBlur = async (documentId: string, newName: string) => {
    if (!newName.trim()) return;

    setIsLoading(true);
    await renameDocument(documentId, newName);
    setSelectedDocumentId({ id: documentId, isRenaming: false });
    setIsLoading(false);
  };

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
      {documents.map(document => {
        const isRenaming =
          selectedDocumentId?.id === document.id &&
          selectedDocumentId?.isRenaming;

        const isLoadingDocument =
          isLoading && selectedDocumentId?.id === document.id;

        return (
          <ContextMenu key={document.id}>
            <ContextMenuTrigger>
              <div
                key={document.id}
                onClick={isRenaming ? undefined : handleRedirect(document.id)}
                className={cn(
                  'flex-row cursor-pointer shadow-md flex gap-x-1 min-w-16 flex-1 h-16 items-center justify-start py-2 px-2 min-lg:px-4 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors',
                  isLoadingDocument && 'bg-muted text-muted-foreground'
                )}
              >
                <FileUser size={30} className="shrink-0 hidden min-lg:block" />
                {isRenaming ? (
                  <Textarea
                    ref={inputRef}
                    className="p-0 min-h-2 resize-none w-full border-none rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    defaultValue={document.name}
                    maxLength={40}
                    autoFocus
                    onBlur={e => handleRenameBlur(document.id, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleRenameBlur(document.id, e.currentTarget.value);
                      }
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-start justify-center gap-x-2">
                    <span className="text-sm line-clamp-1">
                      {document.name}
                    </span>
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
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={handleRedirect(document.id, true)}>
                Open in new tab
              </ContextMenuItem>
              <ContextMenuItem onClick={handleCopyEditLink(document.editLink)}>
                Copy edit link
              </ContextMenuItem>
              <ContextMenuItem onClick={handleRenameClick(document.id)}>
                Rename
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={handleDeleteClick(document.id)}>
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
      {/* Dialog outside of context menu */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        documentId={selectedDocumentId?.id}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </React.Fragment>
  );
};
