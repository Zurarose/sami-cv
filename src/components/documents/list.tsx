'use client';

import { routes } from '@/constant/routes';
import { FolderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { Folder } from '@prisma/client';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/ui-kit/basic/context-menu';
import { ContextMenuTrigger } from '@/ui-kit/basic/context-menu';
import { DeleteDialog } from './delete-dialog';
import { Input } from '@/ui-kit/basic/input';
import { renameFolder } from '@/actions/documents';
import { cn } from '@/lib/utils';

export const FolderList = ({ folders }: { folders: Folder[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRedirect = (folderId: string, newTab?: boolean) => () => {
    if (newTab) {
      window.open(routes.folder(folderId), '_blank');
    } else {
      router.push(routes.folder(folderId));
    }
  };

  const handleDeleteClick = (folderId: string) => {
    setSelectedFolderId(folderId);
    setDeleteDialogOpen(true);
  };

  const handleRenameClick = (folderId: string) => {
    setSelectedFolderId(folderId);
    setIsRenaming(true);
  };

  useEffect(() => {
    if (isRenaming && inputRef.current?.defaultValue) {
      // Small delay to ensure the input is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isRenaming, selectedFolderId]);

  const handleRenameBlur = async (folderId: string, newName: string) => {
    setIsLoading(true);
    await renameFolder(folderId, newName);
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      {folders.map(folder => {
        const isRenamingFolder = isRenaming && selectedFolderId === folder.id;
        const isLoadingFolder = isLoading && selectedFolderId === folder.id;
        return (
          <ContextMenu key={folder.id}>
            <ContextMenuTrigger>
              <div
                onClick={isRenaming ? undefined : handleRedirect(folder.id)}
                className={cn(
                  'cursor-pointer shadow-md flex gap-4 min-w-16 max-w-60 flex-1 h-16 flex-col min-md:flex-row items-center justify-center py-2 px-2 min-lg:px-6 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors',
                  isLoadingFolder && 'bg-muted text-muted-foreground'
                )}
              >
                <FolderIcon className="shrink-0 hidden min-lg:block" />
                {isRenamingFolder ? (
                  <Input
                    ref={inputRef}
                    className="p-0 w-min border-t-0 border-l-0 border-r-0 rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 border-b-2 border-b-primary"
                    autoFocus
                    defaultValue={folder.name}
                    onBlur={e => handleRenameBlur(folder.id, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleRenameBlur(folder.id, e.currentTarget.value);
                      }
                    }}
                  />
                ) : (
                  <span className="line-clamp-2 text-center">
                    {folder.name}
                  </span>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={handleRedirect(folder.id, true)}>
                Open in new tab
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleRenameClick(folder.id)}>
                Rename
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => handleDeleteClick(folder.id)}>
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
        folderId={selectedFolderId}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </React.Fragment>
  );
};
