"use client";

import Navbar from "@/components/navbar";
import LoginForm from "./components/login-form";
import ReactQueryProvider from "@/lib/reactQuery";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Navbar />
      <div className="w-full max-w-sm relative md:-top-20">
        <ReactQueryProvider>
          <LoginForm />
        </ReactQueryProvider>
      </div>
    </div>
  );
}
