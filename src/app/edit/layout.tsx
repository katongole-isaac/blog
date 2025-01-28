import Navbar from "@/components/navbar";

export default function EditLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <>
      <Navbar />
      <div className="h-16"></div>
      <div className="h-full max-w-screen-xl mx-auto">{children}</div>
    </>
  );
}
