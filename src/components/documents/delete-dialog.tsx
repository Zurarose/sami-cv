import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogFooter,
} from '@/ui-kit/basic/dialog';
import { Button } from '@/ui-kit/basic/button';
import { deleteFolder } from '@/actions/documents';

interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string | null;
}

export const DeleteDialog = ({
  isOpen,
  onOpenChange,
  folderId,
}: DeleteDialogProps) => {
  if (!folderId) return null;

  const handleDelete = async () => {
    try {
      await deleteFolder(folderId);
      onOpenChange(false);
      // Optionally, you could add a toast notification here
    } catch (error) {
      console.error('Error deleting folder:', error);
      // Optionally, you could add error handling here
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal container={document.body}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this folder? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
