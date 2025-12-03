import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@ziron/utils";

const kbdVariants = cva(
  [
    "hidden w-fit select-none items-center justify-center gap-1 rounded-sm px-1 font-medium font-sans transition-colors duration-200 sm:inline-flex",
    "in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10",
  ],
  {
    variants: {
      variant: {
        default: "bg-faded/60 text-foreground/80",
        secondary: "bg-foreground text-background shadow-xs hover:bg-foreground/80",
        outline: "border border-input bg-muted/10 shadow-xs hover:bg-muted/50 hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "h-5 min-w-5 text-xs [&_svg:not([class*='size-'])]:size-3",
        lg: "h-7 min-w-7 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-4 min-w-4 rounded text-xs [&_svg:not([class*='size-'])]:size-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Kbd({ className, variant, size, ...props }: React.ComponentProps<"kbd"> & VariantProps<typeof kbdVariants>) {
  return <kbd className={cn(kbdVariants({ variant, size, className }))} data-slot="kbd" {...props} />;
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <kbd className={cn("inline-flex items-center gap-0.5", className)} data-slot="kbd-group" {...props} />;
}

export { Kbd, KbdGroup, kbdVariants };
