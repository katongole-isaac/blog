"use client";

import Navbar from "@/components/navbar";
import HomePage from "./(home)/_page";
import ReactQueryProvider from "@/utils/RQProvider";
import Test from "./test";

export default function Home() {
  return (
    <ReactQueryProvider>
      <Navbar />
      <HomePage />
      {/* <Test /> */}
    </ReactQueryProvider>
  );
}
