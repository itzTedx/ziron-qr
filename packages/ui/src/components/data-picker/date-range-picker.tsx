import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";

import { endOfDay, isSameDay, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { SelectRangeEventHandler } from "react-day-picker";

import { useKeyboardShortcut, useMediaQuery, useScrollProgress } from "@ziron/ui/hooks";

import { cn } from "@ziron/utils";

import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Calendar as CalendarPrimitive } from "./calendar";
import { Presets } from "./presets";
import { DatePickerContext, formatDate, validatePresets } from "./shared";
import { Trigger } from "./trigger";
import { DateRange, DateRangePreset, PickerProps } from "./types";

type RangeDatePickerProps = {
	presets?: DateRangePreset[];
	presetId?: DateRangePreset["id"];
	defaultValue?: DateRange;
	value?: DateRange;
	onChange?: (dateRange?: DateRange, preset?: DateRangePreset) => void;
} & PickerProps;

const DateRangePickerInner = ({
	value,
	defaultValue,
	presetId,
	onChange,
	presets,
	disabled,
	disableNavigation,
	disabledDays,
	showYearNavigation = false,
	locale = enUS,
	placeholder = "Select date range",
	hasError,
	align = "center",
	className,
	...props
}: RangeDatePickerProps) => {
	const { isDesktop } = useMediaQuery();

	const [open, setOpen] = useState(false);
	const [preset, setPreset] = useState<DateRangePreset | undefined>(
		presets && presetId ? presets?.find(({ id }) => id === presetId) : undefined
	);
	const [range, setRange] = useState<DateRange | undefined>(preset?.dateRange ?? value ?? defaultValue ?? undefined);
	const [month, setMonth] = useState<Date | undefined>(range?.to);

	const initialRange = useMemo(() => {
		return range;
	}, [range]);

	// Update internal state when value prop changes
	useEffect(() => {
		setRange(value);
	}, [value]);

	// Update internal state when preset props change
	useEffect(() => {
		const p = presets?.find(({ id }) => id === presetId);
		setPreset(p);
		setRange(p?.dateRange ?? value ?? defaultValue);
	}, [presets, presetId, defaultValue, value]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: we want to memoize by all values
	useEffect(() => {
		if (!open) setMonth(range?.to);
		else if (range) setMonth(range.to);
	}, [open]);

	const onCalendarSelect: SelectRangeEventHandler = (selectedRange, selectedDay) => {
		const newRange = range?.from && range?.to ? { from: selectedDay } : selectedRange;

		// Handle same-day selection: set start of day and end of day with local timezone
		if (newRange?.from && newRange?.to && isSameDay(newRange.from, newRange.to)) {
			newRange.from = startOfDay(newRange.from);
			newRange.to = endOfDay(newRange.to);
		}

		setRange(newRange);
		setPreset(undefined);
		if (newRange?.from && newRange?.to) {
			onChange?.(newRange);
			setOpen(false);
		}
	};

	const onPresetSelected = (preset: DateRangePreset) => {
		let adjustedDateRange = preset.dateRange;

		// Handle same-day selection for presets: set start of day and end of day with local timezone
		if (
			adjustedDateRange?.from &&
			adjustedDateRange?.to &&
			isSameDay(adjustedDateRange.from, adjustedDateRange.to)
		) {
			adjustedDateRange = {
				from: startOfDay(adjustedDateRange.from),
				to: endOfDay(adjustedDateRange.to),
			};
		}

		setRange(adjustedDateRange);
		setPreset(preset);
		onChange?.(adjustedDateRange, preset);
		setOpen(false);
	};

	const onCancel = () => {
		setRange(initialRange);
		setOpen(false);
	};

	const onOpenChange = (open: boolean) => {
		if (!open) onCancel();

		setOpen(open);
	};

	const displayRange = useMemo(() => {
		if (!range) return null;

		return `${range.from ? formatDate(range.from, locale) : ""} - ${range.to ? formatDate(range.to, locale) : ""}`;
	}, [range, locale]);

	useKeyboardShortcut(
		(presets?.filter((preset) => preset.shortcut).map((preset) => preset.shortcut) as string[]) ?? [],
		(e) => {
			const preset = presets?.find((preset) => preset.shortcut === e.key);
			if (preset) onPresetSelected(preset);
		}
	);

	return (
		<DatePickerContext.Provider value={{ isOpen: open, setIsOpen: setOpen }}>
			<Popover onOpenChange={onOpenChange} open={open}>
				<PopoverTrigger asChild>
					<Trigger
						aria-invalid={props["aria-invalid"]}
						aria-label={props["aria-label"]}
						aria-labelledby={props["aria-labelledby"]}
						aria-required={props.required || props["aria-required"]}
						className={className}
						disabled={disabled}
						hasError={hasError}
						placeholder={placeholder}
					>
						{preset?.label ?? displayRange}
					</Trigger>
				</PopoverTrigger>
				<PopoverContent align={align} className="w-auto p-0">
					<div className="flex w-full">
						<div className="scrollbar-hide relative flex w-full flex-col overflow-x-scroll sm:flex-row-reverse sm:items-start">
							{presets && presets.length > 0 && (
								<PresetScrollContainer>
									<div className="absolute px-3 sm:inset-0 sm:left-0">
										<div className="sm:py-3">
											<Presets
												currentPresetId={presetId}
												currentValue={range}
												onSelect={onPresetSelected}
												presets={presets}
											/>
										</div>
									</div>
								</PresetScrollContainer>
							)}
							<div className="scrollbar-hide overflow-x-scroll">
								<CalendarPrimitive
									className="scrollbar-hide overflow-x-scroll"
									classNames={{
										months: "flex flex-row divide-x overflow-x-scroll scrollbar-hide",
									}}
									disabled={disabledDays}
									disableNavigation={disableNavigation}
									locale={locale}
									mode="range"
									month={month}
									numberOfMonths={isDesktop ? 2 : 1}
									onMonthChange={setMonth}
									onSelect={onCalendarSelect}
									selected={range}
									showYearNavigation={showYearNavigation}
									{...props}
								/>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</DatePickerContext.Provider>
	);
};

export function DateRangePicker({ presets, ...props }: RangeDatePickerProps) {
	if (presets) validatePresets(presets, props);

	return <DateRangePickerInner presets={presets} {...props} />;
}

function PresetScrollContainer({ children }: PropsWithChildren) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollProgress, updateScrollProgress } = useScrollProgress(ref);
	return (
		<div className="relative sm:h-full">
			<div
				className={cn(
					"relative flex h-16 w-full items-center sm:h-full sm:w-48",
					"border-b sm:border-b-0 sm:border-l",
					"overflow-auto"
				)}
				onScroll={updateScrollProgress}
				ref={ref}
			>
				{children}
			</div>
			{/* Bottom scroll fade */}
			<div
				className="pointer-events-none absolute bottom-0 left-0 hidden h-16 w-full rounded-b-lg bg-linear-to-t from-card sm:block"
				style={{ opacity: 1 - Math.pow(scrollProgress, 2) }}
			/>
		</div>
	);
}
