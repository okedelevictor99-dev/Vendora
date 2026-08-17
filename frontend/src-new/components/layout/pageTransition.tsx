// import { motion } from "motion/react";
// import type { ReactNode } from "react";

// export const PageTransition = ({ children }: { children: ReactNode }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -8 }}
//       transition={{ duration: 0.25, ease: "easeOut" }}
//       className="absolute inset-0 overflow-y-auto overflow-x-hidden"
//     >
//       {children}
//     </motion.div>
//   );
// };

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