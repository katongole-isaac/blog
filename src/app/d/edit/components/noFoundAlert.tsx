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
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose?: () => void;
}
const NoFoundEditAlert: React.FC<Props> = ({ onClose, open }) => {
  const router = useRouter();

  const dashboardURL = "/d";
  const newPostURL = "/d/create";

  const handleGoToDashboard = () => {
    setTimeout(() => (onClose ? onClose() : null), 2_000);
    router.push(dashboardURL);
  };

  const handleCreateAPost = () => {
    setTimeout(() => (onClose ? onClose() : null), 2_000);
    router.push(newPostURL);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Blog Post Not Found</AlertDialogTitle>
          <AlertDialogDescription>
            The blog post you're trying to edit no longer exists or has been removed. You can refresh the page to check for updates or create a new
            blog post instead.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleGoToDashboard}>Go to Dashboard</AlertDialogCancel>
          <AlertDialogAction className="bg-blue-700 hover:bg-blue-600 text-white" onClick={handleCreateAPost}>
            Create a post
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NoFoundEditAlert;
