"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";

import { cn } from "@ziron/utils";

const lidVariants: Variants = {
  normal: { y: 0 },
  animate: { y: -1.1 },
};

const springTransition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

const DeleteIcon = ({ containerClassName, className }: { containerClassName?: string; className?: string }) => {
  const controls = useAnimation();

  return (
    <div
      className={cn(
        "flex cursor-pointer select-none items-center justify-center rounded-md p-2 transition-colors duration-200",
        containerClassName
      )}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <svg
        className={className}
        fill="none"
        height="28"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="28"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.g animate={controls} transition={springTransition} variants={lidVariants}>
          <path d="M3 6h18" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </motion.g>
        <motion.path
          animate={controls}
          d="M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8"
          transition={springTransition}
          variants={{
            normal: { d: "M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8" },
            animate: { d: "M19 9v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V9" },
          }}
        />
        <motion.line
          animate={controls}
          transition={springTransition}
          variants={{
            normal: { y1: 11, y2: 17 },
            animate: { y1: 11.5, y2: 17.5 },
          }}
          x1="10"
          x2="10"
          y1="11"
          y2="17"
        />
        <motion.line
          animate={controls}
          transition={springTransition}
          variants={{
            normal: { y1: 11, y2: 17 },
            animate: { y1: 11.5, y2: 17.5 },
          }}
          x1="14"
          x2="14"
          y1="11"
          y2="17"
        />
      </svg>
    </div>
  );
};

export { DeleteIcon };
