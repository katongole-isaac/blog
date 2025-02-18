import Navbar from "@/components/navbar";
import { Metadata } from "next";
import EditClientLayout from "./editLayout";

export const metadata: Metadata = {
  title: "Editing",
};

const EditBlogLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar size="xl" />
      <div className="h-16"></div>
      <EditClientLayout> {children} </EditClientLayout>
    </>
  );
};

export default EditBlogLayout;
