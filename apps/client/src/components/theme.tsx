"use client";

import { useEffect } from "react";

import { useTheme } from "next-themes";

interface ProvidersProps {
	isDarkMode?: boolean;
}

export function Theme({ isDarkMode }: ProvidersProps) {
	const { setTheme } = useTheme();

	useEffect(() => {
		setTheme(isDarkMode ? "dark" : "light");
	}, [isDarkMode, setTheme]);

	return null;
}
