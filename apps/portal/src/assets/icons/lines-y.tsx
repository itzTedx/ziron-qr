import { SVGProps, useEffect, useRef } from "react";

import { cn } from "@ziron/utils";

const SCALES = [0.3, 1.5, 1.75, 0.75];

export function IconLinesY({
  "data-hovered": hovered,
  className,
  ...rest
}: { "data-hovered"?: boolean } & SVGProps<SVGSVGElement>) {
  const line1Ref = useRef<SVGLineElement>(null);
  const line2Ref = useRef<SVGLineElement>(null);
  const line3Ref = useRef<SVGLineElement>(null);
  const line4Ref = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!hovered) return;

    [line1Ref, line2Ref, line3Ref, line4Ref].forEach((ref, idx) => {
      if (!ref.current) return;

      ref.current.animate(
        [{ transform: "scaleY(1)" }, { transform: `scaleY(${SCALES[idx]})` }, { transform: "scaleY(1)" }],
        {
          delay: idx * 50,
          duration: 400,
        }
      );
    });
  }, [hovered]);

  return (
    <svg
      className={cn("[&_line]:transform-stroke [&_line]:origin-bottom", className)}
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g fill="currentColor">
        <line
          fill="none"
          ref={line1Ref}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="2.75"
          x2="2.75"
          y1="2.75"
          y2="15.25"
        />
        <line
          fill="none"
          ref={line2Ref}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="7"
          x2="7"
          y1="7.75"
          y2="15.25"
        />
        <line
          fill="none"
          ref={line3Ref}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="11"
          x2="11"
          y1="11.75"
          y2="15.25"
        />
        <line
          fill="none"
          ref={line4Ref}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="15.25"
          x2="15.25"
          y1="4.75"
          y2="15.25"
        />
      </g>
    </svg>
  );
}
