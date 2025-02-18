import { Metadata } from "next";
import { Frown } from "lucide-react";

import Navbar from "@/components/navbar";
import BackHomeButton from "./(not-found)/backHomeButton";

export const metadata: Metadata = {
  title: "Isaac Codes | Not Found",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className=" max-w-screen-xl m-auto h-screen prose dark:prose-invert ">
        <div className="flex flex-col items-center justify-center min-h-screen -bg-gray-900 text-white">
          <Frown className="w-16 h-16 text-gray-400" />
          <h1 className="text-6xl font-bold mt-4 mb-0">404</h1>
          <p className="text-xl mt-2 text-black dark:text-white my-2">Oops! Looks like you're lost.</p>
          <p className="text-gray-500 dark:text-gray-400 my-2">The page (blog) you're looking for doesn't exist or has been removed ! </p>
          <BackHomeButton />
        </div>
      </div>
    </>
  );
}
