"use client";

import { GoogleTagManager } from "@next/third-parties/google";

import HomePage from "./(home)/_page";
import Navbar from "@/components/navbar";
import Footer from "@/components/common/footer";
import ReactQueryProvider from "@/lib/reactQuery";

export default function Home() {
  const googleTagID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
  return (
    <ReactQueryProvider>
      {googleTagID && <GoogleTagManager gtmId={googleTagID} />}
      <Navbar />
      <div className="min-h-14"></div>
      <HomePage />
      <Footer />
    </ReactQueryProvider>
  );
}
