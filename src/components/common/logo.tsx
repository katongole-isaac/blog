import Logo from "@/assets/logos/logo.png";
import LogoIcon from "@/assets/logos/icon-logo.png";
import LogoWhite from "@/assets/logos/logo-white.png";
import LogoIconWhite from "@/assets/logos/icon-logo-white.png";

import Image from "next/legacy/image";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { useTheme } from "next-themes";

const AppLogo: React.FC<DetailedHTMLProps<HTMLAttributes<HTMLImageElement>, HTMLImageElement>> = (props) => {
  const { theme, systemTheme } = useTheme();

  const logo = theme === "system" ? (systemTheme === "dark" ? LogoWhite : Logo) : theme === "dark" ? LogoWhite : Logo;

  return <Image src={logo} layout="fill" objectFit="contain" alt="App Logo" {...props} />;
};

export default AppLogo;
