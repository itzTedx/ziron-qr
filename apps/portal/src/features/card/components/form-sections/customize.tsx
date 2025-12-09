import { FormControl, FormField, FormItem, FormLabel, FormMessage, useFormContext } from "@ziron/ui/components/form";
import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import { zCardSchema } from "@ziron/validators";

import ColorsInput from "@/components/ui/color-input";
import { Switch } from "@/components/ui/switch";

import { ThemeSelector } from "../fields/theme-selector";

interface Props {
	template: string;
}

export const CardCustomize = ({ template }: Props) => {
	const form = useFormContext<zCardSchema>();
	return (
		<div className="space-y-4">
			<FormField
				control={form.control}
				name="appearance.template"
				render={({ field }) => (
					<FormItem className="shrink-0 space-y-3 pb-6">
						<FormLabel>Choose a theme</FormLabel>
						<FormControl>
							<ScrollArea className="relative flex w-[calc(100svw-2rem)] gap-4 sm:w-auto md:gap-8">
								<ScrollBar orientation="horizontal" />
								<ThemeSelector onChange={field.onChange} value={field.value} />
							</ScrollArea>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<section className="divide-y">
				<h5 className="pb-3 font-medium text-sm">Customize Theme</h5>
				<FormField
					control={form.control}
					name={"appearance.isDarkMode"}
					render={({ field }) => (
						<FormItem className="flex w-full flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
							<FormLabel className="flex w-full items-center gap-1.5" htmlFor={field.name}>
								Dark Mode
								{/* <InfoTooltip
                  content={
                    <SimpleTooltipContent title="Display your logo in the center of the QR code." />
                  }
                /> */}
							</FormLabel>
							<FormControl>
								<div className="flex items-center justify-end">
									<div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center font-medium text-sm">
										<Switch
											checked={field.value}
											id={field.name}
											onCheckedChange={field.onChange}
										/>
									</div>
								</div>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={"appearance.theme"}
					render={({ field }) => (
						<FormItem className="flex w-full flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
							<FormLabel>Theme Color</FormLabel>
							<FormControl>
								<ColorsInput onChange={field.onChange} value={field.value} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				{template === "modern" || template === "card" ? (
					<FormField
						control={form.control}
						name={"appearance.btnColor"}
						render={({ field }) => (
							<FormItem className="flex w-full flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center">
								<FormLabel>Button</FormLabel>
								<FormControl>
									<ColorsInput onChange={field.onChange} value={field.value} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
				) : null}
			</section>
		</div>
	);
};
