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
  onContinue: () => void;
  onClose?: () => void;
  open: boolean;
}

const EditConfirmAlert: React.FC<Props> = ({ onContinue, open, onClose }) => {
  const handleContinue = () => {
    onContinue();
    if (onClose) onClose();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Confirm Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You're about to save the changes made to your blog post. Once saved, these updates will be applied. Do you want to proceed?{" "}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => (onClose ? onClose() : null)}>No</AlertDialogCancel>
          <AlertDialogAction className="bg-blue-700 hover:bg-blue-600 text-white" onClick={handleContinue}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditConfirmAlert;
