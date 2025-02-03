"use client";

import Link from "next/link";
import { Frown, Home } from "lucide-react";

import Navbar from "@/components/navbar";

export default function () {
  return (
    <>
      <Navbar />
      <div className="flex w-full p-5 mt-32  m-auto max-w-screen-md">
        <div className="max-w-[400px] min-w-[400px] border border-rose-600 py-3 px-4 text-white from-rose-700 via-rose-800 to-rose-900  bg-gradient-to-b">
          
        </div>
      </div>
    </>
  );
}
