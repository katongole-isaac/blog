import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  children: React.ReactNode;
  onContinue: () => void;
  onClose?: () => void;
  open: boolean;
  itemsToBeDeleted: number;
  description?: string;
  title?: string;
}
const DeleteBlogAlert: React.FC<Props> = ({ description, title, onContinue, open, onClose, itemsToBeDeleted, children }) => {
  const _handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <AlertDialog open={open} defaultOpen={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || `Are you sure you want to delete ${itemsToBeDeleted} blog post(s)?`} </AlertDialogTitle>
          <AlertDialogDescription>
            {description || "This action cannot be undone. This will permanently delete the selected blog post(s) and remove data from our servers."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {children}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={_handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-700 hover:bg-red-600 text-white" onClick={() => onContinue()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBlogAlert;
