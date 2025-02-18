import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import { Loader } from "lucide-react";

interface Props {
  open: boolean;
}
const DraftContentLoader: React.FC<Props> = ({ open }) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-max">
        <AlertDialogHeader>
          <AlertDialogTitle> </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col items-center gap-3">
            <Loader className="animate-spin" />
            <span className="text-sm">Loading draft contents</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DraftContentLoader;
