import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  onLogout: () => void;
  onGoToDashboard: () => void;
}
const AuthenticatedNavbar: React.FC<Props> = ({ onLogout, onGoToDashboard }) => {
  const { theme, setTheme } = useTheme();

  const dashboardURL = "/d";
  const pathname = usePathname();

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const Icon = themeIcons[theme as keyof typeof themeIcons];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="rounded-full  border border-gray-300 dark:border-neutral-700  hover:bg-gray-100 dark:hover:bg-neutral-700 p-1 flex justify-center items-center w-10  h-10 bg-white dark:bg-inherit relative top-[2px]"
        >
          <UserRound size={22} className="text-neutral-600 dark:text-white" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {pathname !== dashboardURL && (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onGoToDashboard}>
              Go To Dashboard
              <DropdownMenuShortcut>⇧⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex gap-1 w-ll">
              <span> Theme</span>
              <div className="w-max h-max  rounded-full relative  bg-white dark:bg-inherit">
                <Icon />
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
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
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />

          <DropdownMenuItem>Fund this project</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthenticatedNavbar;
