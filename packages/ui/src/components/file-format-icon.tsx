// AlignUI FileFormatIcon v0.0.0

import * as React from "react";

import { tv, type VariantProps } from "@ziron/utils/";

export const fileFormatIconVariants = tv({
  slots: {
    root: "relative shrink-0",
    formatBox:
      "absolute bottom-1.5 left-0 flex h-4 items-center rounded px-[3px] py-0.5 text-[11px] font-semibold leading-none text-white",
  },
  variants: {
    size: {
      medium: {
        root: "size-10",
      },
      small: {
        root: "size-8",
      },
    },
    color: {
      red: {
        formatBox: "bg-destructive",
      },
      orange: {
        formatBox: "bg-orange-500",
      },
      yellow: {
        formatBox: "bg-yellow-500",
      },
      green: {
        formatBox: "bg-success",
      },
      sky: {
        formatBox: "bg-verified-base",
      },
      blue: {
        formatBox: "bg-information-base",
      },
      purple: {
        formatBox: "bg-feature-base",
      },
      pink: {
        formatBox: "bg-highlighted-base",
      },
      gray: {
        formatBox: "bg-stone-500",
      },
    },
  },
  defaultVariants: {
    color: "red",
    size: "medium",
  },
});

function FileFormatIcon({
  format,
  className,
  color,
  size,
  ...rest
}: VariantProps<typeof fileFormatIconVariants> & React.SVGProps<SVGSVGElement>) {
  const { root, formatBox } = fileFormatIconVariants({ color, size });

  return (
    <svg
      className={root({ class: className })}
      fill="none"
      height="40"
      viewBox="0 0 40 40"
      width="40"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        className="fill-white stroke-stone-300"
        d="M30 39.25H10C7.10051 39.25 4.75 36.8995 4.75 34V6C4.75 3.10051 7.10051 0.75 10 0.75H20.5147C21.9071 0.75 23.2425 1.30312 24.227 2.28769L33.7123 11.773C34.6969 12.7575 35.25 14.0929 35.25 15.4853V34C35.25 36.8995 32.8995 39.25 30 39.25Z"
        strokeWidth="1.5"
      />
      <path className="stroke-stone-300" d="M23 1V9C23 11.2091 24.7909 13 27 13H35" strokeWidth="1.5" />
      <foreignObject height="40" width="40" x="0" y="0">
        {/* @ts-ignore */}
        <div className={formatBox()} xmlns="http://www.w3.org/1999/xhtml">
          {format}
        </div>
      </foreignObject>
    </svg>
  );
}

export { FileFormatIcon };
