import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="">
        {/* blog cotainer list */}
        <section className="max-w-screen-lg m-auto  flex flex-col gap-10  items-center justify-center py-5 md:px-14 lg:px-16 md:py-10"></section>
      </main>
    </>
  );
}
