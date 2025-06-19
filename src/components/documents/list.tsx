'use client';

import { routes } from '@/constant/routes';
import { FolderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Folder } from '@prisma/client';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/ui-kit/basic/context-menu';
import { ContextMenuTrigger } from '@/ui-kit/basic/context-menu';
import { DeleteButton } from './delete-button';

export const FolderList = ({ folders }: { folders: Folder[] }) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

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

  return (
    <React.Fragment>
      {folders.map(folder => (
        <ContextMenu key={folder.id}>
          <ContextMenuTrigger>
            <div
              onClick={handleRedirect(folder.id)}
              className="cursor-pointer shadow-md flex gap-4 min-w-16 max-w-60 flex-1 h-16 flex-col min-md:flex-row items-center justify-center py-2 px-2 min-lg:px-6 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <FolderIcon className="shrink-0 hidden min-lg:block" />
              <span className="line-clamp-2 text-center">{folder.name}</span>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={handleRedirect(folder.id, true)}>
              Open in new tab
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleDeleteClick(folder.id)}>
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}

      {/* Dialog outside of context menu */}
      <DeleteButton
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        folderId={selectedFolderId}
      />
    </React.Fragment>
  );
};
