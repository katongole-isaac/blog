import { motion, MotionValue, useSpring } from "framer-motion";

interface Props {
  scrollYProgress: MotionValue;
}
const BlogScrollProgress: React.FC<Props> = ({ scrollYProgress }) => {
  const scaleX = useSpring(scrollYProgress);
  return (
    <motion.div
      transition={{ type: "spring", duration: 0.8, bounce: 0.25 }}
      style={{
        scaleX,
        position: "fixed",
        originX: 0,
        zIndex: 90, // remember mobile navbar zIndex is 100, you shudn't go over it
      }}
      className={`
         bg-gradient-to-r from-rose-500/70 via-fuchsia-600/80 to-blue-500/50 fixed h-1 md:h-1 mt-[3.5rem] top-0 left-0 right-0`}
    ></motion.div>
  );
};

export default BlogScrollProgress;
