"use client";

import {
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  forwardRef,
  PropsWithChildren,
  RefAttributes,
  useRef,
} from "react";

import { motion } from "motion/react";

import { cn } from "@ziron/utils";

import { useResizeObserver } from "../hooks";

type AnimatedSizeContainerProps = PropsWithChildren<{
  width?: boolean;
  height?: boolean;
}> &
  Omit<ComponentPropsWithoutRef<typeof motion.div>, "animate" | "children">;

/**
 * A container with animated width and height (each optional) based on children dimensions
 */
const AnimatedSizeContainer: ForwardRefExoticComponent<AnimatedSizeContainerProps & RefAttributes<HTMLDivElement>> =
  forwardRef<HTMLDivElement, AnimatedSizeContainerProps>(
    (
      { width = false, height = false, className, transition, children, ...rest }: AnimatedSizeContainerProps,
      forwardedRef
    ) => {
      const containerRef = useRef<HTMLDivElement>(null);
      const resizeObserverEntry = useResizeObserver(containerRef);

      return (
        <motion.div
          animate={{
            width: width ? (resizeObserverEntry?.contentRect?.width ?? "auto") : "auto",
            height: height ? (resizeObserverEntry?.contentRect?.height ?? "auto") : "auto",
          }}
          className={cn("overflow-hidden", className)}
          ref={forwardedRef}
          transition={transition ?? { type: "spring", duration: 0.3 }}
          {...rest}
        >
          <div className={cn(height && "h-max", width && "w-max")} ref={containerRef}>
            {children}
          </div>
        </motion.div>
      );
    }
  );

AnimatedSizeContainer.displayName = "AnimatedSizeContainer";

export { AnimatedSizeContainer };
