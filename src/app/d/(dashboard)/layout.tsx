import { Metadata } from "next";

import Navbar from "@/components/navbar";
import DashboardCards from "../components/cards";
import DashboardHeader from "../components/dashboardHeader";

export const metadata: Metadata = {
  title: "Isaac Codes | Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Navbar />
      <div className="min-h-16"></div>

      <div className="max-w-screen-lg m-auto py-6">
        <DashboardHeader />
        <DashboardCards />

        {children}
      </div>
    </div>
  );
}
