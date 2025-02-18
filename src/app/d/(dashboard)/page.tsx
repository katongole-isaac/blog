"use client";

import dayjs from "dayjs";
import { useEffect } from "react";

import constants from "@/utils/constants";
import DraftBlogs from "../components/drafts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBlogs } from "@/store/blogSlice";
import PublishedBlogs from "../components/published";
import useWindowFocus from "@/hooks/use-window-focus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { changeTab, getActiveTab, TabType } from "@/store/tabSlice";

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  const { activeTab } = useAppSelector(getActiveTab);
  const handleChangeTab = (tab: TabType) => dispatch(changeTab(tab));

  const handleFocus = (visibility: DocumentVisibilityState) => {
    const visibilityKey = constants.visibilityKey;

    let visibilityLastUpdate = localStorage.getItem(visibilityKey);

    if (!visibilityLastUpdate) {
      visibilityLastUpdate = dayjs().toISOString();
      localStorage.setItem(visibilityKey, visibilityLastUpdate);

      // This is like background refreshing
      // whenever the user comes back to the dasboard page

      if (visibility === "visible") {
        dispatch(fetchBlogs());

        visibilityLastUpdate = dayjs().toISOString();
        localStorage.setItem(visibilityKey, visibilityLastUpdate);
      }

      return;
    }

    const diffInMins = dayjs().diff(dayjs(visibilityLastUpdate), "minutes");
    const updateForEveryThreeMinutes = 3; // mins

    if (diffInMins < updateForEveryThreeMinutes) return;

    // This is like background refreshing
    // whenever the user comes back to the dasboard page

    if (visibility === "visible") {
      dispatch(fetchBlogs());

      visibilityLastUpdate = dayjs().toISOString();
      localStorage.setItem(visibilityKey, visibilityLastUpdate);
    }
  };

  useWindowFocus(handleFocus);

  // Workround for Pointer-events: "none" on the body element
  // when a user interacts with dropdown menu and the alert dialog
  useEffect(() => {
    // Callback to handle DOM changes
    const handleDomChanges = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          const pointerEvents = document.body.style.pointerEvents;

          // Reset pointer-events if set to 'none'
          if (pointerEvents === "none") document.body.style.pointerEvents = "";
        }
      }
    };

    // Create a MutationObserver instance
    const observer = new MutationObserver(handleDomChanges);

    // Start observing the body element for style attribute changes
    observer.observe(document.body, {
      attributes: true, // Watch for attribute changes
      attributeFilter: ["style"], // Only observe changes to 'style'
    });

    // Cleanup the observer when the component unmounts
    return () => observer.disconnect();
  }, []); // Empty dependency array ensures it runs once

  return (
    <div className="">
      <Tabs defaultValue={activeTab} className="w-full">
        <div className="w-full px-5 md:px-0">
          <TabsList className="grid md:w-[400px] grid-cols-2  w-full">
            <TabsTrigger value="published" onClick={() => handleChangeTab("published")}>
              Published
            </TabsTrigger>
            <TabsTrigger value="drafts" onClick={() => handleChangeTab("drafts")}>
              Drafts
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="published" className="w-full">
          <div className="my-5 px-5 md:px-0">
            <h2 className="text-xl font-semibold">Published Blogs</h2>
          </div>
          <div className=""></div>
          <PublishedBlogs />
        </TabsContent>
        <TabsContent value="drafts">
          <div className="my-5 px-5 md:px-0">
            <h2 className="text-xl font-semibold">Drafts Blogs</h2>
          </div>
          <DraftBlogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
