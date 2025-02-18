"use client";

import ReactQueryProvider from "@/lib/reactQuery";

interface Props {
  children: React.ReactNode;
}

const EditClientLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </>
  );
};
export default EditClientLayout;
