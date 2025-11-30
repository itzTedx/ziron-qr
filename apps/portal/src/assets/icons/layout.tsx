"use client";

import { motion, type Variants } from "motion/react";

import { getVariants, IconProps, IconWrapper, useAnimateIconContext } from "@/components/ui/icon";

type LayoutGridProps = IconProps<keyof typeof animations>;

const animations = {
  default: {
    grid: {
      initial: { scale: 1, rotate: 0 },
      animate: {
        scale: [1, 1.03, 1],
        rotate: [0, 1, 0],
        transition: { ease: "easeInOut", duration: 0.6 },
      },
    },
    tile1: {
      initial: { opacity: 1, scale: 1 },
      animate: {
        opacity: [0.4, 1],
        scale: [0.85, 1.08, 1],
        transition: { ease: "easeOut", duration: 0.55, delay: 0.08 * 0 },
      },
    },
    tile2: {
      initial: { opacity: 1, scale: 1 },
      animate: {
        opacity: [0.4, 1],
        scale: [0.85, 1.08, 1],
        transition: { ease: "easeOut", duration: 0.55, delay: 0.08 * 1 },
      },
    },
    tile3: {
      initial: { opacity: 1, scale: 1 },
      animate: {
        opacity: [0.4, 1],
        scale: [0.85, 1.08, 1],
        transition: { ease: "easeOut", duration: 0.55, delay: 0.08 * 2 },
      },
    },
    tile4: {
      initial: { opacity: 1, scale: 1 },
      animate: {
        opacity: [0.4, 1],
        scale: [0.85, 1.08, 1],
        transition: { ease: "easeOut", duration: 0.55, delay: 0.08 * 3 },
      },
    },
    sweep: {
      initial: { x: -26, y: -26, opacity: 0 },
      animate: {
        x: [-26, 26],
        y: [-26, 26],
        opacity: [0, 0.35, 0],
        transition: { ease: "easeInOut", duration: 0.8, delay: 0.1 },
      },
    },
  } satisfies Record<string, Variants>,
  "default-loop": {
    grid: {
      initial: { scale: 1, rotate: 0 },
      animate: {
        scale: [1, 1.03, 1],
        rotate: [0, 1, 0],
        transition: { ease: "easeInOut", duration: 0.6 },
      },
    },
    tile1: {
      initial: { opacity: 1, scale: 1 },
      animate: {
        opacity: [1, 0.4, 1],
        scale: [1, 0.85, 1.08, 1],
        transition: { ease: "easeOut", duration: 1.1, delay: 0.08 * 0 },
      },
    },
    tile2: {
      initial: { opacity: 1, scale: 1 },
      animate: {
        opacity: [1, 0.4, 1],
        scale: [1, 0.85, 1.08, 1],
        transition: { ease: "easeOut", duration: 1.1, delay: 0.08 * 1 },
      },
    },
    tile3: {
      initial: { opacity: 1, scale: 1 },
      animate: {
        opacity: [1, 0.4, 1],
        scale: [1, 0.85, 1.08, 1],
        transition: { ease: "easeOut", duration: 1.1, delay: 0.08 * 2 },
      },
    },
    tile4: {
      initial: { opacity: 1, scale: 1 },
      animate: {
        opacity: [1, 0.4, 1],
        scale: [1, 0.85, 1.08, 1],
        transition: { ease: "easeOut", duration: 1.1, delay: 0.08 * 3 },
      },
    },
    sweep: {
      initial: { x: -26, y: -26, opacity: 0 },
      animate: {
        x: [-26, 26, -26],
        y: [-26, 26, -26],
        opacity: [0, 0.35, 0],
        transition: { ease: "easeInOut", duration: 1.6, delay: 0.1 },
      },
    },
  } satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: LayoutGridProps) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="grid-sweep" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.g animate={controls} initial="initial" variants={variants.grid}>
        <motion.rect
          animate={controls}
          height="7"
          initial="initial"
          rx="1"
          variants={variants.tile1}
          width="7"
          x="3"
          y="3"
        />
        <motion.rect
          animate={controls}
          height="7"
          initial="initial"
          rx="1"
          variants={variants.tile2}
          width="7"
          x="14"
          y="3"
        />
        <motion.rect
          animate={controls}
          height="7"
          initial="initial"
          rx="1"
          variants={variants.tile3}
          width="7"
          x="14"
          y="14"
        />
        <motion.rect
          animate={controls}
          height="7"
          initial="initial"
          rx="1"
          variants={variants.tile4}
          width="7"
          x="3"
          y="14"
        />

        <motion.rect
          animate={controls}
          fill="url(#grid-sweep)"
          height="20"
          initial="initial"
          rx="3"
          style={{ pointerEvents: "none" }}
          variants={variants.sweep}
          width="20"
          x="2"
          y="2"
        />
      </motion.g>
    </motion.svg>
  );
}

function LayoutGrid(props: LayoutGridProps) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { LayoutGrid, LayoutGrid as IconLayoutGrid, type LayoutGridProps, type LayoutGridProps as IconLayoutGridProps };
