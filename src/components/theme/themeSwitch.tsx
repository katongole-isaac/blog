"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface MobileThemeSwitchProps {
  mobileMenuOpen: boolean;
}
export default function ThemeSwitch() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="w-max h-max border dark:border-neutral-600 border-gray-200 px-[0.65rem] py-[0.5rem] rounded-full relative dark:hover:bg-neutral-700 hover:bg-gray-50 bg-white dark:bg-inherit "
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 " />
          <Moon className="absolute h-[1.2rem] w-[1.3rem] top-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className=" h-[1.2rem] w-[1.2rem] dark:scale-100 transition-all dark:rotate-0 " />
          <span>Dark </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0  transition-all " />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className=" h-[1.2rem] w-[1.2rem] dark:scale-100 transition-all dark:rotate-0 " />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const MobileThemeSwitch: React.FC<MobileThemeSwitchProps> = ({ mobileMenuOpen }) => {
  const [open, setOpen] = React.useState(false);
  const iconSize = 30;
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    if (!mobileMenuOpen) setOpen(false);
  }, [mobileMenuOpen]);

  return (
    <div className=" borde pr-3 py-[0.2rem]">
      <div role="button" onClick={() => setOpen(!open)} className="w-full flex justify-between ">
        <div className="flex items-center gap-2">
          <span>Theme</span>
        </div>
        <div className="md:hidden flex justify-center items-center borde w-max h-auto" role="button">
          <ChevronDown absoluteStrokeWidth size={iconSize} className={`text-neutral-500 transition-all duration-300 ${open ? "" : "-rotate-90"}`} />
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0, paddingTop: 0, paddingBottom: 0, transition: { height: { delay: 0.1, duration: 0.4 } } }}
            className="w-full border. border-red-500"
          >
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { opacity: { delay: 0.2 } } }}
              exit={{ opacity: 0 }}
              className="space-y-2 pl-3"
            >
              <li
                className={`flex items-center gap-2 ${
                  theme === "light" ? "bg-gray-300/40 dark:bg-neutral-700/40" : "hover:bg-gray-200/40 dark:hover:bg-neutral-700/20"
                }  py-1 px-1 rounded-md`}
                role="button"
                onClick={() => setTheme("light")}
              >
                <Sun size={20} />
                <span>Light</span>
              </li>
              <li
                className={`flex items-center gap-2  py-1 px-1 rounded-md ${
                  theme === "dark" ? "bg-gray-300/40 dark:bg-neutral-700/50" : "hover:bg-gray-200/40 dark:hover:bg-neutral-700/20"
                }`}
                role="button"
                onClick={() => setTheme("dark")}
              >
                <Moon size={20} />
                <span>Dark</span>
              </li>
              <li
                className={`flex items-center gap-2  py-1 px-1 rounded-md ${
                  theme === "system" ? "bg-gray-300/40 dark:bg-neutral-700/40" : "hover:bg-gray-200/40 dark:hover:bg-neutral-700/20"
                }`}
                role="button"
                onClick={() => setTheme("system")}
              >
                <Monitor size={20} />
                <span>System</span>
              </li>
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
