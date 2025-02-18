import { AnimatePresence, motion } from "framer-motion";
import ThemeSwitch, { MobileThemeSwitch } from "../theme/themeSwitch";
import useAuth from "@/hooks/use-auth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import config from "@/config/default.json";
import AuthenticatedNavbar from "@/app/d/components/authenticatedNavbar";
import useShortcut from "@/hooks/use-shortcut";
import Link from "next/link";

interface Props {
  mobile?: boolean;
}

//  main nav
const AppNavigation = () => {
  const router = useRouter();
  const isAuthenticated = useAuth();

  const goToLogin = () => router.push("/login");
  const handleLogout = () => fetch(config.logout).then((res) => router.replace("/"));

  const handleGoToDashboard = () => router.push("/d");

  useShortcut("q", handleLogout);
  useShortcut("k", handleGoToDashboard);

  return (
    <div>
      <ul className="hidden md:flex items-center gap-3">
        <li>
          {isAuthenticated === null ? (
            <small>Loading...</small>
          ) : isAuthenticated ? (
            <AuthenticatedNavbar onLogout={handleLogout} onGoToDashboard={handleGoToDashboard} />
          ) : (
            <div className="flex gap-3">
              <Button size="sm" onClick={goToLogin}>
                Login
              </Button>
              <ThemeSwitch />
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default AppNavigation;

export const MobileNavigation: React.FC<Props> = ({ mobile = false }) => {
  return (
    <AnimatePresence>
      {mobile ? (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0, paddingTop: 0, paddingBottom: 0, transition: { height: { delay: 0.1, duration: 0.4 } } }}
          className="md:hidden py-2  w-full "
        >
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { opacity: { delay: 0.2 } } }}
            exit={{ opacity: 0 }}
            className="space-y-2 pl-3"
          >
            <li>
              <MobileThemeSwitch mobileMenuOpen={mobile} />
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
          </motion.ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
