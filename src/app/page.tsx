"use client";

import Navbar from "@/components/navbar";
import HomePage from "./(home)/_page";
import ReactQueryProvider from "@/lib/reactQuery";
import Test from "./test";

export default function Home() {
  return (
    <ReactQueryProvider>
      {/* <Test /> */}
      <Navbar />
      <HomePage />
    </ReactQueryProvider>
  );
}
