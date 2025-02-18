"use client";

import Navbar from "@/components/navbar";
import HomePage from "./(home)/_page";
import ReactQueryProvider from "@/lib/reactQuery";
import Footer from "@/components/common/footer";

export default function Home() {
  return (
    <ReactQueryProvider>
      <Navbar />
      <div className="min-h-14"></div>
      <HomePage />
      <Footer />
    </ReactQueryProvider>
  );
}
