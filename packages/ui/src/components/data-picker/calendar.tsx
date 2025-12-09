"use client";

import * as React from "react";
import { ElementType } from "react";

import { addYears, format, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames, useDayPicker } from "react-day-picker";

import { Button, buttonVariants } from "@ziron/ui/components/button";

import { cn } from "@ziron/utils";

interface NavigationButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	onClick: () => void;
	icon: ElementType;
	disabled?: boolean;
}

const NavigationButton = React.forwardRef<HTMLButtonElement, NavigationButtonProps>(
	({ onClick, icon: Icon, disabled, ...props }: NavigationButtonProps, forwardedRef) => {
		return (
			<Button
				disabled={disabled}
				onClick={onClick}
				ref={forwardedRef}
				size="icon-sm"
				type="button"
				variant="outline"
				{...props}
			>
				<Icon className="h-full w-full shrink-0" />
			</Button>
		);
	}
);

NavigationButton.displayName = "NavigationButton";

function Calendar({
	className,
	classNames,
	locale,
	showOutsideDays = true,
	disableNavigation = false,
	captionLayout = "label",
	buttonVariant = "ghost",
	formatters,
	components,
	showYearNavigation = false,

	// New props
	startMonth,
	endMonth,
	startDate,
	endDate,
	...props
}: React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>["variant"];
	showYearNavigation?: boolean;

	// New props
	startMonth?: Date;
	endMonth?: Date;
	startDate?: Date;
	endDate?: Date;
}) {
	const defaultClassNames = getDefaultClassNames();

	// Convert props to DayPicker format
	const computedStartMonth = startMonth;
	const computedEndMonth = endMonth;

	return (
		<DayPicker
			captionLayout={captionLayout}
			className={cn(
				"group/calendar bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent [--cell-size:--spacing(8)]",
				String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
				String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
				className
			)}
			classNames={{
				root: cn("w-fit", defaultClassNames.root),
				months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
				month: cn("flex w-full flex-col gap-4 p-3", defaultClassNames.month),
				nav: cn(
					"absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
					defaultClassNames.nav
				),
				button_previous: cn(
					buttonVariants({ variant: buttonVariant }),
					"size-(--cell-size) select-none p-0 aria-disabled:opacity-50",
					defaultClassNames.button_previous
				),
				button_next: cn(
					buttonVariants({ variant: buttonVariant }),
					"size-(--cell-size) select-none p-0 aria-disabled:opacity-50",
					defaultClassNames.button_next
				),
				month_caption: cn(
					"flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
					defaultClassNames.month_caption
				),
				dropdowns: cn(
					"flex h-(--cell-size) w-full items-center justify-center gap-1.5 font-medium text-sm",
					defaultClassNames.dropdowns
				),
				dropdown_root: cn(
					"relative rounded-md border border-input shadow-xs has-focus:border-ring has-focus:ring-[3px] has-focus:ring-ring/50",
					defaultClassNames.dropdown_root
				),
				dropdown: cn("absolute inset-0 bg-popover opacity-0", defaultClassNames.dropdown),
				caption_label: cn(
					"select-none font-medium",
					captionLayout === "label"
						? "text-sm"
						: "flex h-8 items-center gap-1 rounded-md pr-1 pl-2 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
					defaultClassNames.caption_label
				),
				table: "w-full border-collapse",
				weekdays: cn("flex", defaultClassNames.weekdays),
				weekday: cn(
					"flex-1 select-none rounded-md font-normal text-[0.8rem] text-muted-foreground",
					defaultClassNames.weekday
				),
				week: cn("mt-1 flex w-full", defaultClassNames.week),
				week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
				week_number: cn("select-none text-[0.8rem] text-muted-foreground", defaultClassNames.week_number),
				day: cn(
					"group/day relative aspect-square h-full w-full select-none p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md",
					props.showWeekNumber
						? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md"
						: "[&:first-child[data-selected=true]_button]:rounded-l-md",
					defaultClassNames.day
				),
				range_start: cn("rounded-l-md bg-accent", defaultClassNames.range_start),
				range_middle: cn("rounded-none", defaultClassNames.range_middle),
				range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
				today: cn(
					"rounded-md bg-accent text-accent-foreground data-[selected=true]:rounded-none",
					defaultClassNames.today
				),
				outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
				disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
				hidden: cn("invisible", defaultClassNames.hidden),
				...classNames,
			}}
			components={{
				Root: ({ className, rootRef, ...props }) => {
					return <div className={cn(className)} data-slot="calendar" ref={rootRef} {...props} />;
				},
				Nav: ({ className, ...props }) => {
					return <div className={cn("hidden", className)} data-slot="nav" {...props} />;
				},
				// Chevron: ({ className, orientation, ...props }) => {
				//   if (orientation === "left") {
				//     return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
				//   }

				//   if (orientation === "right") {
				//     return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
				//   }

				//   return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
				// },
				MonthCaption: ({ children, ...props }) => {
					const { goToMonth, nextMonth, previousMonth, months, dayPickerProps } = useDayPicker();
					const {
						numberOfMonths = 1,
						startMonth: dayPickerStartMonth,
						endMonth: dayPickerEndMonth,
					} = dayPickerProps;
					const currentMonth = props.calendarMonth.date;

					const displayIndex = months.findIndex((month) => isSameMonth(props.calendarMonth.date, month.date));
					const isFirst = displayIndex === 0;
					const isLast = displayIndex === months.length - 1;

					const hideNextButton = numberOfMonths > 1 && (isFirst || !isLast);
					const hidePreviousButton = numberOfMonths > 1 && (isLast || !isFirst);

					// Use startMonth/endMonth from dayPickerProps
					const startConstraint = dayPickerStartMonth;
					const endConstraint = dayPickerEndMonth;

					const goToPreviousYear = () => {
						const targetMonth = addYears(currentMonth, -1);
						if (previousMonth && (!startConstraint || targetMonth.getTime() >= startConstraint.getTime())) {
							goToMonth(targetMonth);
						}
					};

					const goToNextYear = () => {
						const targetMonth = addYears(currentMonth, 1);
						if (nextMonth && (!endConstraint || targetMonth.getTime() <= endConstraint.getTime())) {
							goToMonth(targetMonth);
						}
					};

					return (
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1">
								{showYearNavigation && !hidePreviousButton && (
									<NavigationButton
										aria-label="Go to previous year"
										disabled={
											disableNavigation ||
											!previousMonth ||
											(startConstraint &&
												addYears(currentMonth, -1).getTime() < startConstraint.getTime())
										}
										icon={ChevronsLeft}
										onClick={goToPreviousYear}
									/>
								)}
								{!hidePreviousButton && (
									<NavigationButton
										aria-label="Go to previous month"
										disabled={disableNavigation || !previousMonth}
										icon={ChevronLeft}
										onClick={() => previousMonth && goToMonth(previousMonth)}
									/>
								)}
							</div>

							<div
								aria-live="polite"
								className="font-medium text-foreground text-sm capitalize tabular-nums"
								role="presentation"
							>
								{format(
									props.calendarMonth.date,
									"LLLL yyy",
									locale ? ({ locale } as Parameters<typeof format>[2]) : undefined
								)}
							</div>

							<div className="flex items-center gap-1">
								{!hideNextButton && (
									<NavigationButton
										aria-label="Go to next month"
										disabled={disableNavigation || !nextMonth}
										icon={ChevronRight}
										onClick={() => nextMonth && goToMonth(nextMonth)}
									/>
								)}
								{showYearNavigation && !hideNextButton && (
									<NavigationButton
										aria-label="Go to next year"
										disabled={
											disableNavigation ||
											!nextMonth ||
											(endConstraint &&
												addYears(currentMonth, 1).getTime() > endConstraint.getTime())
										}
										icon={ChevronsRight}
										onClick={goToNextYear}
									/>
								)}
							</div>
						</div>
					);
				},

				DayButton: CalendarDayButton,
				WeekNumber: ({ children, ...props }) => {
					return (
						<td {...props}>
							<div className="flex size-(--cell-size) items-center justify-center text-center">
								{children}
							</div>
						</td>
					);
				},
				...components,
			}}
			endMonth={computedEndMonth}
			formatters={{
				formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
				...formatters,
			}}
			locale={locale}
			showOutsideDays={showOutsideDays}
			startMonth={computedStartMonth}
			{...props}
		/>
	);
}

function CalendarDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
	const defaultClassNames = getDefaultClassNames();

	const ref = React.useRef<HTMLButtonElement>(null);
	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);

	return (
		<Button
			className={cn(
				"flex aspect-square size-10 w-full min-w-(--cell-size) flex-col font-normal leading-none data-[range-end=true]:rounded-none data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-start=true]:rounded-l-md data-[range-end=true]:bg-primary data-[range-middle=true]:bg-primary/10 data-[range-start=true]:bg-primary data-[selected-single=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:text-accent-foreground data-[range-start=true]:text-primary-foreground data-[selected-single=true]:text-primary-foreground group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground [&>span]:text-xs [&>span]:opacity-70",
				defaultClassNames.day,
				className
			)}
			data-day={day.date.toLocaleDateString()}
			data-range-end={modifiers.range_end}
			data-range-middle={modifiers.range_middle}
			data-range-start={modifiers.range_start}
			data-selected-single={
				modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
			}
			ref={ref}
			size="icon"
			variant="ghost"
			{...props}
		/>
	);
}

export { Calendar, CalendarDayButton };
