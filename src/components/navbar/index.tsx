"use client";

import { useEffect, useRef, useState } from "react";
import AppNavigation, { MobileNavigation } from "./navigation";
import { ChevronDown } from "lucide-react";
import AppLogo from "../common/logo";
import { useRouter } from "next/navigation";

interface Props {
  size?: "lg" | "xl" | "xxl";
}
export default function Navbar({ size = "lg" }: Props) {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const iconSize = 30;
  const ref = useRef<HTMLDivElement>(null);

  const homePage = "/";
  const router = useRouter();

  const handleResize = () => {
    // close mobile menu nav upon leaving the medium breakpoint
    if (window.matchMedia("(min-width: 768px)").matches) setOpenMobileMenu(false);
  };

  const handleScroll = () => {
    // if the user scrolls and the nav is still open, close it instead
    if (openMobileMenu && window.scrollY > 0) setOpenMobileMenu(false);
  };
  const handleClickOutSide = () => openMobileMenu && setOpenMobileMenu(false);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    if (ref.current) ref.current.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("scroll", handleScroll);
      ref.current && ref.current.addEventListener("click", handleClickOutSide);
    };
  }, [openMobileMenu]);

  const sizes = {
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    xxl: "max-w-screen-2xl",
  };

  return (
    <>
      <nav
        className={`border-b border-gray-300 dark:border-neutral-800 py-2  ${
          openMobileMenu ? "bg-[#FAFAFC]" : "bg-gray-100/60 backdrop-blur filter"
        }  dark:bg-neutral-900 fixed w-full top-0 z-[100]`}
      >
        <div className={` ${sizes[size!]} m-auto flex items-center justify-between  px-3 md:px-5 lg:px-0`}>
          {/* logo */}
          <div className="relative h-10 w-40 md:w-48">
            <AppLogo className="cursor-pointer" role="link" onClick={() => router.push(homePage)} />
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle button */}
            <div onClick={() => setOpenMobileMenu(!openMobileMenu)} className="md:hidden flex justify-center items-center w-max h-auto" role="button">
              <ChevronDown
                absoluteStrokeWidth
                size={iconSize}
                className={`text-neutral-500 transition-all duration-300 ${openMobileMenu ? "-scale-y-100" : ""}`}
              />
            </div>
            <AppNavigation />
          </div>
        </div>

        <div className="flex md:hidden">
          <MobileNavigation mobile={openMobileMenu} />
        </div>
      </nav>
      <div
        ref={ref}
        className={` fixed top-0 transition-all duration-500 delay-200 ease-in-out filter ${
          openMobileMenu ? "h-screen w-screen z-40 backdrop-blur-sm " : "h-max"
        }  bg-white/40 dark:bg-black/50`}
      />
    </>
  );
}
