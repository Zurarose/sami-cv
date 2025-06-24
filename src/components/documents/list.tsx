'use client';

import { routes } from '@/constant/routes';
import { FolderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react';
import { Folder } from '@prisma/client';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/ui-kit/basic/context-menu';
import { ContextMenuTrigger } from '@/ui-kit/basic/context-menu';
import { DeleteDialog } from './delete-dialog';
import { renameFolder } from '@/actions/folder';
import { cn } from '@/lib/utils';
import { Textarea } from '@/ui-kit/basic/textarea';

export const FolderList = ({ folders }: { folders: Folder[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<{
    id: string;
    isRenaming: boolean;
  } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleRedirect = (folderId: string, newTab?: boolean) => () => {
    if (newTab) {
      window.open(routes.folder(folderId), '_blank');
    } else {
      router.push(routes.folder(folderId));
    }
  };

  const handleDeleteClick = (folderId: string) => {
    setSelectedFolderId({ id: folderId, isRenaming: false });
    setDeleteDialogOpen(true);
  };

  const handleRenameClick = (folderId: string) => {
    setSelectedFolderId({ id: folderId, isRenaming: true });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleRenameBlur = async (folderId: string, newName: string) => {
    if (!newName.trim()) return;

    setIsLoading(true);
    await renameFolder(folderId, newName);
    setSelectedFolderId({ id: folderId, isRenaming: false });
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      {folders.map(({ id, ...folder }) => {
        const isRenamingFolder =
          selectedFolderId?.isRenaming && selectedFolderId.id === id;
        const isLoadingFolder = isLoading && selectedFolderId?.id === id;

        return (
          <ContextMenu key={id}>
            <ContextMenuTrigger>
              <div
                onClick={isRenamingFolder ? undefined : handleRedirect(id)}
                className={cn(
                  'cursor-pointer shadow-md flex gap-4 min-w-16 flex-1 h-16 flex-col min-md:flex-row items-center justify-center py-2 px-2 min-lg:px-4 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors',
                  isLoadingFolder && 'bg-muted text-muted-foreground'
                )}
              >
                <FolderIcon className="shrink-0 hidden min-lg:block" />
                {isRenamingFolder ? (
                  <Textarea
                    ref={inputRef}
                    className="p-0 min-h-2 resize-none w-full border-none rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    defaultValue={folder.name}
                    maxLength={40}
                    onBlur={e => handleRenameBlur(id, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleRenameBlur(id, e.currentTarget.value);
                      }
                    }}
                  />
                ) : (
                  <span className="text-center break-all text-sm">
                    {folder.name}
                  </span>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={handleRedirect(id, true)}>
                Open in new tab
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleRenameClick(id)}>
                Rename
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => handleDeleteClick(id)}>
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
        folderId={selectedFolderId?.id}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </React.Fragment>
  );
};
