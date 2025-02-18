"use client";

import ReactQueryProvider from "@/lib/reactQuery";

interface Props {
  children: React.ReactNode;
}

const CreateBlogLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <ReactQueryProvider>
        <div className="h-full max-w-screen-xl mx-auto">{children}</div>
      </ReactQueryProvider>
    </>
  );
};

export default CreateBlogLayout;
