"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Wraps a hero image so it settles in with a slow zoom on load. */
export default function SlowZoom({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className="absolute inset-0" initial={reduce ? false : { scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}