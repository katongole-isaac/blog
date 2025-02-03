"use client";

import Link from "next/link";
import { Home } from "lucide-react";

import { useAppDispatch } from "@/store/hooks";
import { clearAllBlogError } from "@/store/blogSlice";

const BackHomeButton = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => dispatch(clearAllBlogError());

  return (
    <Link
      href="/"
      onClick={handleClick}
      className="mt-6 flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-900 rounded-lg transition"
    >
      <Home className="w-5 h-5" />
      <span>Take me home </span>
    </Link>
  );
};

export default BackHomeButton;
