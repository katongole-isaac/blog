import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import {} from "next/font/google";
import  { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body className="font-apple bg-[#F5F5F7] -bg-gray-100 dark:bg-black">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
