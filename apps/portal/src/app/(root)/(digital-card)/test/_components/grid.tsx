import { useId } from "react";

import { cn } from "@ziron/utils";

export function Grid({
  cellSize = 12,
  strokeWidth = 1,
  patternOffset = [0, 0],
  className,
}: {
  cellSize?: number;
  strokeWidth?: number;
  patternOffset?: [number, number];
  className?: string;
}) {
  const id = useId();

  return (
    <svg className={cn("pointer-events-none absolute inset-0 text-black/10", className)} height="100%" width="100%">
      <defs>
        <pattern
          height={cellSize}
          id={`grid-${id}`}
          patternUnits="userSpaceOnUse"
          width={cellSize}
          x={patternOffset[0] - 1}
          y={patternOffset[1] - 1}
        >
          <path
            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect fill={`url(#grid-${id})`} height="100%" width="100%" />
    </svg>
  );
}
