import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import StoreProvider from "@/store/provider";
import "./globals.css";

// import dynamic from "next/dynamic";
// import LayoutLoading from "./loading";

// const StoreProvider = dynamic(() => import("@/store/provider"), { loading: () => <LayoutLoading /> });

export const metadata: Metadata = {
  title: "Isaac Codes | Blog",
  description: "Everything you need to know about technology and programming in general",
  applicationName: "Isaac Codes",
  openGraph: {
    title: "Isaac Codes",
    description: "Everything you need to know about technology and programming in general",
    type: "website",
    locale: "en_US",
    siteName: "Isaac Codes | Blog",
  },
  keywords: ["Programming", "Tech", "Technology", "AI", "Javascript", "Typescript"],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const googleTagID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        {googleTagID && <GoogleTagManager gtmId={googleTagID} />}
        <head>
          {/* Standard favicon */}
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="icon" href="/favicon.ico" />

          {/* Apple Touch Icon */}
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

          {/* Android Chrome Icons */}
          <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

          {/* Web Manifest for PWA Support */}
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body className="font-apple bg-[#F5F5F7] -bg-gray-100 dark:bg-black">
          <StoreProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster toastOptions={{ style: { maxWidth: "400px" } }} />
            </ThemeProvider>
          </StoreProvider>
        </body>
      </html>
    </>
  );
}
