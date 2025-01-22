import { AnimatePresence, motion } from "framer-motion";
import ThemeSwitch, { MobileThemeSwitch } from "../theme/themeSwitch";

interface Props {
  mobile?: boolean;
}

//  main nav
const AppNavigation = () => {
  return (
    <div>
      <ul className="hidden md:flex gap-2">
        <li>
          <ThemeSwitch />
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
          </motion.ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
