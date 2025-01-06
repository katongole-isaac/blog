import { AnimatePresence, motion } from "framer-motion";

interface Props {
  mobile?: boolean;
}

//  main nav
const AppNavigation = () => {
  return (
    <div>
      <ul className="hidden md:flex gap-2">
        <li> home </li>
        <li> home </li>
        <li> home </li>
        <li> home </li>
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
          className="md:hidden py-2 "
        >
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { opacity: { delay: 0.2 } } }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <li> mobile home </li>
            <li> mobile home </li>
            <li> mobile home </li>
          </motion.ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
