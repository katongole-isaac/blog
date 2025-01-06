"use client";

import { motion } from "framer-motion";

export default function Test() {
  const variants = {
    start: {},
    visible: { scale: 2, x: "50vw", y: "50vh", transition: { delay: 1, type: "spring", mass: 1 } },
  };
  return (
    <div className="">
      <motion.div variants={variants} animate="visible" className="h-20 w-20 bg-rose-600"></motion.div>
    </div>
  );
}
