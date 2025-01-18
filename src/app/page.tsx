"use client";

import Navbar from "@/components/navbar";
import HomePage from "./(home)/_page";
import ReactQueryProvider from "@/utils/RQProvider";

export default function Home() {
  return (
    <ReactQueryProvider>
      <Navbar />
      <HomePage />
    </ReactQueryProvider>
  );
}
