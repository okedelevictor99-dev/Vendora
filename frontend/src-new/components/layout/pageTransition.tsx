

import { motion } from "motion/react";
import type { ReactNode } from "react";

export const PageTransition = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28}}
    >
      {children}
    </motion.div>
  );
};