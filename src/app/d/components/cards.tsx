"use client";

import { CheckCircle, FileEdit } from "lucide-react";

import DashboardCard from "./card";
import { useAppSelector } from "@/store/hooks";
import { getAllBlogsState, getDraftBlogState } from "@/store/blogSlice";

const DashboardCards = () => {
  const { data: blogs } = useAppSelector(getAllBlogsState);
  const { data: drafts } = useAppSelector(getDraftBlogState);

  const cardInfo = [
    {
      title: "Published",
      stats: blogs ? blogs.length : 0,
      description: "Visible to everyone and live on the site",
      icon: <CheckCircle className="text-sm text-green-500 dark:text-green-500/90" />,
    },
    {
      title: "Drafts",
      stats: drafts ? drafts.length : 0,
      description: "Saved but not yet published, only visible to the author.",
      icon: <FileEdit className="dark:text-neutral-500 text-gray-400" />,
    },
  ];

  return (
    <div className="flex flex-wrap justify-center md:justify-start  md:flex-nowrap gap-5 mb-6 px-2 lg:px-0">
      {cardInfo.map((card) => (
        <DashboardCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default DashboardCards;
