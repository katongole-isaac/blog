"use client";

import Image from "next/legacy/image";
import { useTheme } from "next-themes";
import LogoIcon from "@/assets/logos/icon-logo.png";
import LogoIconWhite from "@/assets/logos/icon-logo-white.png";

export default function () {
  const { theme, systemTheme } = useTheme();

  const logo = theme === "system" ? (systemTheme === "dark" ? LogoIconWhite : LogoIcon) : theme === "dark" ? LogoIconWhite : LogoIcon;

  return (
    <div className="w-screen h-screen p-0 flex justify-center items-center">
      <div className="w-32 h-20 relative animate-pulse ">
        <Image src={logo} layout="fill" objectFit="contain" />
      </div>
    </div>
  );
}
