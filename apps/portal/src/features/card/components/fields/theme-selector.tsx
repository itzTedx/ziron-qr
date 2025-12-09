"use client";

import { useId, useMemo } from "react";

import Image from "next/image";

import { IconCheck } from "@tabler/icons-react";

import { RadioGroup, RadioGroupItem } from "@ziron/ui/components/radio-group";

interface Props {
	value?: string;
	onChange: (value: string) => void;
}

// Move items outside component to prevent recreation
const THEME_ITEMS = [
	{ value: "default", label: "Default", image: "/images/default-template.png" },
	{ value: "modern", label: "Modern", image: "/images/modern-template.png" },
	{ value: "card", label: "Card", image: "/images/card-template.png" },
] as const;

export const ThemeSelector = ({ onChange, value }: Props) => {
	const id = useId();

	// Memoize the radio items
	const radioItems = useMemo(
		() =>
			THEME_ITEMS.map((item) => (
				<label
					className="relative grid shrink-0 flex-col items-center justify-center"
					key={`${id}-${item.value}`}
				>
					<RadioGroupItem
						className="peer sr-only after:absolute after:inset-0"
						id={`${id}-${item.value}`}
						value={item.value}
					/>
					<div className="relative shrink-0 cursor-pointer overflow-hidden rounded-2xl border p-1 shadow-black/5 shadow-sm outline-offset-2 transition-colors peer-focus-[visible]:outline peer-focus-[visible]:outline-2 peer-focus-[visible]:outline-ring/70 peer-data-disabled:cursor-not-allowed peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-muted/60 peer-data-disabled:opacity-50">
						<div className="relative aspect-7/15 h-60 md:h-96 lg:h-120">
							<Image
								alt={item.label}
								className="rounded-xl object-cover"
								fill
								priority
								sizes="(max-width: 768px) 60vh, (max-width: 1024px) 96vh, 30rem"
								src={item.image}
							/>
						</div>
					</div>

					<span className="group mt-2 flex items-center justify-center gap-2">
						<div className="flex aspect-square size-5 items-center justify-center rounded-full border border-primary text-background shadow-none ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-foreground">
							<IconCheck
								aria-hidden="true"
								className="peer-data-[state=unchecked]:hidden"
								size={16}
								strokeWidth={2}
							/>
						</div>
						<span className="font-medium text-xs">{item.label}</span>
					</span>
				</label>
			)),
		[id]
	);

	return (
		<fieldset className="space-y-4 pb-4">
			<RadioGroup className="flex gap-3" defaultValue={value} onValueChange={onChange}>
				{radioItems}
			</RadioGroup>
		</fieldset>
	);
};
