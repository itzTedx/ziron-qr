import { useMemo, useState } from "react";

import { motion } from "motion/react";
import { UseFormReturn } from "react-hook-form";

import { Tabs, TabsList, TabsTrigger } from "@ziron/ui/components/tabs";

import { cn } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

import { customizeFields, generalFields, hasFieldErrors, linksFields } from "../detect-errors";

interface Props {
	form: UseFormReturn<zCardSchema>;
	children: React.ReactNode;
}

interface TabConfig {
	value: string;
	label: string;
	hasError: boolean;
}

export const TabsLists = ({ form, children }: Props) => {
	const [tab, setTab] = useState("general");
	// Check for errors in each tab
	const errors = form.formState.errors;
	const hasGeneralErrors = useMemo(() => hasFieldErrors(errors, generalFields), [errors]);
	const hasLinksErrors = useMemo(() => hasFieldErrors(errors, linksFields), [errors]);
	const hasCustomizeErrors = useMemo(() => hasFieldErrors(errors, customizeFields), [errors]);

	const tabs: TabConfig[] = [
		{ value: "general", label: "General", hasError: hasGeneralErrors },
		{ value: "links", label: "Links", hasError: hasLinksErrors },
		{ value: "customize", label: "Customize", hasError: hasCustomizeErrors },
	];

	return (
		<Tabs
			className="relative mt-4 h-fit w-full px-3 lg:px-6"
			defaultValue="general"
			onValueChange={setTab}
			value={tab}
		>
			<TabsList>
				{tabs.map(({ value, label, hasError }) => (
					<TabsTrigger
						className={cn(
							"relative py-2 data-[state=active]:bg-transparent",
							hasError && "text-destructive data-[state=active]:text-destructive"
						)}
						key={value}
						value={value}
					>
						<span className="relative z-10 inline-flex items-center gap-1.5">
							{label}
							{hasError && (
								<span
									aria-label={`Errors in ${label} tab`}
									className="size-2 rounded-full bg-destructive"
								/>
							)}
						</span>
						{tab === value && (
							<motion.span
								animate={{
									opacity: 1,
									transition: { duration: 0.01, type: "spring", stiffness: 300, damping: 20 },
								}}
								className={cn("absolute inset-0 z-0 block h-full w-full rounded-[inherit] bg-card")}
								exit={{
									opacity: 0,
									transition: { duration: 0.01 },
								}}
								initial={{ opacity: 0 }}
								layoutId="cardHoverEffect"
							/>
						)}
					</TabsTrigger>
				))}
			</TabsList>
			{children}
		</Tabs>
	);
};
