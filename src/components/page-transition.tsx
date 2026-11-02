import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  locationKey: string;
}

export function PageTransition({ children, locationKey }: PageTransitionProps) {
  return (
    <motion.div
      key={locationKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
