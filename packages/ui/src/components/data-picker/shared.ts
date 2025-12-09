import { createContext, Dispatch, SetStateAction } from "react";

import { format, Locale } from "date-fns";

import { DatePreset, DateRangePreset, PickerProps } from "./types";

export const DatePickerContext = createContext<{
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}>({
	isOpen: false,
	setIsOpen: () => {},
});

const isBrowserLocaleClockType24h = () => {
	const language = typeof window !== "undefined" ? window.navigator.language : "en-US";

	const hr = new Intl.DateTimeFormat(language, {
		hour: "numeric",
	}).format();

	return Number.isInteger(Number(hr));
};

export const formatDate = (date: Date, locale: Locale, includeTime = false): string => {
	const usesAmPm = !isBrowserLocaleClockType24h();
	let dateString: string;

	if (includeTime) {
		dateString = usesAmPm
			? format(date, "d MMM, yyyy h:mm a", { locale })
			: format(date, "d MMM, yyyy HH:mm", { locale });
	} else {
		dateString = format(date, "d MMM, yyyy", { locale });
	}

	return dateString;
};

export const validatePresets = (presets: DateRangePreset[] | DatePreset[], rules: PickerProps) => {
	const {
		// New props
		startMonth,
		endMonth,
		startDate,
		endDate,
	} = rules;

	// Use new props if available, fallback to deprecated ones
	const startMonthToUse = startMonth;
	const endMonthToUse = endMonth;
	const startDateToUse = startDate;
	const endDateToUse = endDate;

	if (presets && presets.length > 0) {
		// Handle year constraints (from deprecated fromYear/toYear or computed from startMonth/endMonth)
		const fromYearToUse = startMonthToUse?.getFullYear();
		const toYearToUse = endMonthToUse?.getFullYear();

		presets.forEach((preset) => {
			if ("date" in preset) {
				const presetYear = preset.date.getFullYear();
				const presetMonth = preset.date.getMonth();

				if (fromYearToUse && presetYear < fromYearToUse) {
					throw new Error(`Preset ${preset.label} is before start year ${fromYearToUse}.`);
				}

				if (toYearToUse && presetYear > toYearToUse) {
					throw new Error(`Preset ${preset.label} is after end year ${toYearToUse}.`);
				}

				if (startMonthToUse) {
					if (presetMonth < startMonthToUse.getMonth()) {
						throw new Error(
							`Preset ${preset.label} is before startMonth ${format(startMonthToUse, "MMM, yyyy")}.`
						);
					}
				}

				if (endMonthToUse) {
					if (presetMonth > endMonthToUse.getMonth()) {
						throw new Error(
							`Preset ${preset.label} is after endMonth ${format(endMonthToUse, "MMM, yyyy")}.`
						);
					}
				}

				if (startDateToUse) {
					if (preset.date.getTime() < startDateToUse.getTime()) {
						throw new Error(
							`Preset ${preset.label} is before startDate ${format(startDateToUse, "MMM dd, yyyy")}.`
						);
					}
				}

				if (endDateToUse) {
					if (preset.date.getTime() > endDateToUse.getTime()) {
						throw new Error(
							`Preset ${preset.label} is after endDate ${format(endDateToUse, "MMM dd, yyyy")}.`
						);
					}
				}
			}

			if ("dateRange" in preset) {
				const presetFromYear = preset.dateRange.from?.getFullYear();
				const presetToYear = preset.dateRange.to?.getFullYear();

				if (presetFromYear && fromYearToUse && presetFromYear < fromYearToUse) {
					throw new Error(`Preset ${preset.label}'s 'from' is before start year ${fromYearToUse}.`);
				}

				if (presetToYear && toYearToUse && presetToYear > toYearToUse) {
					throw new Error(`Preset ${preset.label}'s 'to' is after end year ${toYearToUse}.`);
				}

				if (startMonthToUse && preset.dateRange.from) {
					const presetMonth = preset.dateRange.from.getMonth();

					if (presetMonth < startMonthToUse.getMonth()) {
						throw new Error(
							`Preset ${preset.label}'s 'from' is before startMonth ${format(startMonthToUse, "MMM, yyyy")}.`
						);
					}
				}

				if (endMonthToUse && preset.dateRange.to) {
					const presetMonth = preset.dateRange.to.getMonth();

					if (presetMonth > endMonthToUse.getMonth()) {
						throw new Error(
							`Preset ${preset.label}'s 'to' is after endMonth ${format(endMonthToUse, "MMM, yyyy")}.`
						);
					}
				}

				if (startDateToUse && preset.dateRange.from) {
					if (preset.dateRange.from.getTime() < startDateToUse.getTime()) {
						throw new Error(
							`Preset ${preset.label}'s 'from' is before startDate ${format(startDateToUse, "MMM dd, yyyy")}.`
						);
					}
				}

				if (endDateToUse && preset.dateRange.to) {
					const presetToTime = preset.dateRange.to.getTime();
					if (presetToTime > endDateToUse.getTime()) {
						throw new Error(
							`Preset ${preset.label}'s 'to' is after endDate ${format(endDateToUse, "MMM dd, yyyy")}.`
						);
					}
				}
			}
		});
	}
};
