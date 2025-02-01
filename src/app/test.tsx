"use client";

import Image from "next/legacy/image";
import { useTheme } from "next-themes";
import LogoIcon from "@/assets/logos/icon-logo.png";
import LogoIconWhite from "@/assets/logos/icon-logo-white.png";
import Link from "next/link";
import { CloudAlert, CloudUpload, Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function () {
  const { theme, systemTheme } = useTheme();

  const logo = theme === "system" ? (systemTheme === "dark" ? LogoIconWhite : LogoIcon) : theme === "dark" ? LogoIconWhite : LogoIcon;

  const success = (
    <div className="border border-neutral-500/40 dark:border-neutral-700 min-w-[200px] max-w-[450px] py-3 min-h-10 max-h-max px-3 bg-gray-100 rounded-sm flex gap-3 dark:bg-neutral-800">
      <div className="flex gap-3 text-neutral-600 dark:text-neutral-400">
        <CloudUpload />
        <span>Post published</span>
      </div>
      <Link href="#" className="text-blue-500 hover:text-blue-600 underline">
        view
      </Link>
    </div>
  );

  const error = (
    <div className="border border-rose-500/50 dark:border-rose-700 min-w-[200px] max-w-[450px] py-3 min-h-10 max-h-max px-3 bg-rose-300/10 rounded-sm flex gap-3 dark:bg-rose-400/30">
      <div className="flex gap-3 text-rose-500 dark:text-gray-200">
        <CloudAlert className="text-rose-600" />
        <span>Unable to publish this post. Please try again !</span>
      </div>
    </div>
  );

  const loading = (
    <div className="border border-gray-600/40 dark:border-neutral-700 min-w-[200px] max-w-[450px] py-3 min-h-10 max-h-max px-3 bg-gray-200/30 rounded-sm flex gap-3 dark:bg-neutral-800 shadow-sm">
      <div className="flex justify-center items-center gap-2">
        <Loader className="w-8 text-gray-600 dark:text-muted-foreground animate-spin duration-700" />
        <span className=" text-gray-600 dark:text-muted-foreground ">Publishing your blog post </span>
      </div>
    </div>
  );

  const mockFetchData = () => {
    // Mimic a promise with setTimeout
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.5; // Randomly decide success or failure

        if (success) {
          resolve("Data loaded successfully!");
        } else {
          reject(new Error("Failed to load data"));
        }
      }, 2000); // 2-second delay
    });
  };

  const handle = () => {
    const promise = mockFetchData();
    toast.promise(
      promise,
      {
        loading: "Publishing your blog post",
        success: (d: any) => {
          console.log(d);
          return (
            <div className="flex gap-3 text-neutral-100 dark:text-neutral-400">
              <span>Post published</span>
              <Link href="#" className="text-blue-500 hover:text-blue-600 underline">
                view
              </Link>
            </div>
          );
        },
        error: () =><span className="text-rose-600"> Unable to publish this post. Please try again ! </span>, //"",
      },

      {
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
          icon: <CloudAlert className="text-rose-600" />,

          style: {
            backgroundColor: "#262626",
            color: "white",
            borderRadius: 0,
          },
        },
        id: "promise",
        position: "bottom-right",
      }
    );
  };

  return (
    <div className="w-screen h-screen p-0 flex justify-center items-center gap-4">
      <button onClick={handle}>Click</button>
      <div className="border-red-500 border w-[400px]"></div>
    </div>
  );
}

