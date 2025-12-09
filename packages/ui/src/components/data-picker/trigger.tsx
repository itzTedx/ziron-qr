import { ComponentProps, forwardRef } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { Calendar, ChevronDown } from "lucide-react";

import { cn } from "@ziron/utils";

const triggerStyles = cva(
	[
		"group peer flex h-10 cursor-pointer appearance-none items-center gap-x-2 truncate rounded-md border px-3 text-sm outline-none transition-all",
		"bg-stone-50 text-foreground placeholder-muted-foreground transition-all dark:bg-input/8",
		"disabled:pointer-events-none disabled:bg-neutral-100 disabled:text-neutral-400",
		"focus-visible:border-neutral-500 data-[state=open]:border-neutral-500 data-[state=open]:ring-4 data-[state=open]:ring-neutral-200",
	],
	{
		variants: {
			hasError: {
				true: "border-red-500 ring-2 ring-red-200",
			},
		},
	}
);

interface TriggerProps extends ComponentProps<"button">, VariantProps<typeof triggerStyles> {
	placeholder?: string;
}

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
	({ className, children, placeholder, hasError, ...props }: TriggerProps, forwardedRef) => {
		return (
			<button className={cn(triggerStyles({ hasError }), className)} ref={forwardedRef} {...props}>
				<Calendar className={cn("h-4 w-4 shrink-0 text-muted-foreground", !!children && "text-foreground")} />
				<span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-foreground">
					{children ? (
						children
					) : placeholder ? (
						<span className="text-muted-foreground">{placeholder}</span>
					) : null}
				</span>
				<ChevronDown
					className={
						"size-4 shrink-0 text-muted-foreground transition-transform duration-75 group-data-[state=open]:rotate-180"
					}
				/>
			</button>
		);
	}
);

Trigger.displayName = "DatePicker.Trigger";

export { Trigger };
