import { BLOG_GUIDE_MARKDOWN } from "@/utils/constants";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import renderMarkdownToHtml, { processHTML } from "@/components/blog/markdownParse";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const BlogUsageModal = () => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const TriggerButton = (
    <div role="button">
      <Tooltip>
        <TooltipTrigger
          role="button"
          className="w-10 h-10 rounded-full hover:bg-gray-200/50 border flex justify-center items-center shadow-lg absolute bottom-2 right-2 md:right-5 md:bottom-5 group"
        >
          <InfoIcon size={20} className="text-neutral-800 group-hover:scale-95 transition-all" />
        </TooltipTrigger>
        <TooltipContent>
          <small>Guidlines followed when creating a blog post</small>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent className="bg-gray-50 dark:bg-black max-w-screen-lg max-h-[95%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blog Usage Guide</DialogTitle>
            <DialogDescription>Guidelines on how to format and write your post blog [front-matter]</DialogDescription>
          </DialogHeader>
          <BlogUsage />
          <DrawerClose asChild>
            <div className="flex justify-end">
              <Button className="w-max">Got it!</Button>
            </div>
          </DrawerClose>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
      <DrawerContent className="bg-gray-50  h-[90%]   dark:bg-black">
        <DrawerHeader className="text-left">
          <DrawerTitle>Blog Usage Guide</DrawerTitle>
          <DrawerDescription>Guidelines on how to format and write your post blog [front-matter]</DrawerDescription>
        </DrawerHeader>
        <BlogUsage className="px-4 overflow-y-auto" />

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Got it</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const BlogUsage: React.FC<React.HTMLProps<HTMLDivElement>> = ({ className }) => {
  const [_html, setHTML] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const _ = async () => {
      const html = await renderMarkdownToHtml(BLOG_GUIDE_MARKDOWN);
      setHTML(html);
    };
    _();
  }, [BLOG_GUIDE_MARKDOWN]);
  return (
    <div className={cn("w-full h-full", className)}>
      {" "}
      <div className="h-full">{_html && processHTML(_html)}</div>{" "}
    </div>
  );
};

export default BlogUsageModal;
