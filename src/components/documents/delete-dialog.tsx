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
import { deleteFolder } from '@/actions/folder';
import { toast } from 'sonner';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constant/messages';

interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const DeleteDialog = ({
  isOpen,
  onOpenChange,
  folderId,
  isLoading,
  setIsLoading,
}: DeleteDialogProps) => {
  if (!folderId) return null;

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const res = await deleteFolder(folderId);
      if (res.id) {
        onOpenChange(false);
        toast.success(SUCCESS_MESSAGES.FolderDeleted);
        return;
      }
      throw new Error();
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error(ERROR_MESSAGES.FailedToDeleteFolder);
    } finally {
      setIsLoading(false);
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
            <Button
              disabled={isLoading}
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
