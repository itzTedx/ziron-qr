"use client";

import { ReactNode, useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

export const ClientOnly = ({
  children,
  fadeInDuration = 0.4,
  className,
}: {
  children: ReactNode;
  fadeInDuration?: number;
  className?: string;
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const Comp = fadeInDuration ? motion.div : "div";

  return (
    <AnimatePresence>
      {isMounted ? (
        <Comp
          {...(fadeInDuration
            ? {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: fadeInDuration },
              }
            : {})}
          className={className}
        >
          {children}
        </Comp>
      ) : null}
    </AnimatePresence>
  );
};
