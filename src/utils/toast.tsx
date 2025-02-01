import { Loader, CloudUpload, CloudAlert } from "lucide-react";
import { DefaultToastOptions } from "react-hot-toast";

export const toastPromiseDefaultConfig: DefaultToastOptions = {
  loading: {
    icon: <Loader className="w-8 text-gray-500 dark:text-muted-foreground animate-spin duration-700" />,
    style: {
      backgroundColor: "#262626",
      color: "white",
      borderRadius: 0,
    },
    id: "promise",
  },
  success: {
    icon: <CloudUpload className="text-muted-foreground" />,

    style: {
      paddingRight: "10px",
      paddingLeft: "10px",
      color: "white",
      backgroundColor: "#262626",
      borderRadius: 0,
    },
    id: "promise",
    duration: 60_000,
  },
  error: {
    icon: <CloudAlert className="text-rose-600 " />,

    style: {
      backgroundColor: "#262626",
      color: "white",
      borderRadius: 0,
    },
  },
  id: "promise",
  position: "bottom-right",
};
