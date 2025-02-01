import Navbar from "@/components/navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Isaac Codes | Create Blog Posts",
  description: "Easy to use markdown editor for creating amazing blog posts",
  applicationName: "Isaac Codes",
};

export default function EditLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <>
      <Navbar />
      <div className="h-16"></div>
      <div className="h-full max-w-screen-xl mx-auto">{children}</div>
    </>
  );
}
