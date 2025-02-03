import { Frown } from "lucide-react";

import Navbar from "@/components/navbar";
import BackHomeButton from "./(not-found)/backHomeButton";

export default function NotFound () {
  return (
    <>
      <Navbar />
      <div className=" max-w-screen-xl m-auto h-screen prose dark:prose-invert ">
        <div className="flex flex-col items-center justify-center min-h-screen -bg-gray-900 text-white">
          <Frown className="w-16 h-16 text-gray-400" />
          <h1 className="text-6xl font-bold mt-4">404</h1>
          <p className="text-xl mt-2 text-black dark:text-white">Oops! Looks like you're lost.</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">The page you're looking for doesn't exist.</p>
          <BackHomeButton />
        </div>
      </div>
    </>
  );
}
