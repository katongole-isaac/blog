import Navbar from "@/components/navbar";
import ThemeSwitch from "@/components/theme/themeSwitch";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-10 ">
        <ThemeSwitch />
      </main>
    </>
  );
}
