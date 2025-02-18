import Navbar from "@/components/navbar";
import { Metadata } from "next";
import CreateBlogLayout from "./createLayout";

export const metadata: Metadata = {
  title: "Isaac Codes | New Blog Post",
  description: "Easy to use markdown editor for creating amazing blog posts",
  applicationName: "Isaac Codes",
};

export default function EditLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <>
      <Navbar size="xl" />
      <div className="h-16"></div>
      <CreateBlogLayout>{children}</CreateBlogLayout>
    </>
  );
}
