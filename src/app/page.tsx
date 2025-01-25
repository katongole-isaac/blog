"use client";

import Navbar from "@/components/navbar";
import HomePage from "./(home)/_page";
import ReactQueryProvider from "@/lib/reactQuery";
import Test from "./test";
import Footer from "@/components/common/footer";

export default function Home() {
  return (
    <ReactQueryProvider>
      {/* <Test /> */}
      <Navbar />
      <HomePage />
      <Footer />
    </ReactQueryProvider>
  );
}
