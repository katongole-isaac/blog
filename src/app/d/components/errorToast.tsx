import { AlertOctagon, X } from "lucide-react";
import toast, { Toast } from "react-hot-toast";

interface ErrorToastProps {
  t: Toast;
  message: string;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ t, message }) => {
  return (
    <div className="flex font-apple items-center justify-between gap-3 bg-red-700 text-white px-4 py-3 rounded-lg shadow-md min-w-[350px] max-w-[400px]">
      <div className="flex items-center gap-3">
        <AlertOctagon className="w-6 h-6 text-white" />
        <span className="text-sm">{message}</span>
      </div>
      <button onClick={() => toast.dismiss(t.id)}>
        <X className="w-5 h-5 text-white opacity-75 hover:opacity-100" />
      </button>
    </div>
  );
};

export default ErrorToast;
