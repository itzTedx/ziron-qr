"use client";

import * as React from "react";

import { CheckIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@ziron/utils";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
	return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} data-slot="radio-group" {...props} />;
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
	return (
		<RadioGroupPrimitive.Item
			className={cn(
				"aspect-square size-9 rounded-full border border-primary text-background ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:ring-1 data-[state=checked]:ring-foreground md:size-7",
				className
			)}
			data-slot="radio-group-item"
			{...props}
		>
			<RadioGroupPrimitive.Indicator
				className="relative flex items-center justify-center"
				data-slot="radio-group-indicator"
			>
				<CheckIcon className="size-6 text-current md:size-4" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
}

export { RadioGroup, RadioGroupItem };
