import { FieldErrors, UseFormReturn } from "react-hook-form";

import { zCardSchema } from "@ziron/validators";

// Define field paths for each tab
export const generalFields = ["name", "emails", "phones", "address", "mapUrl", "companyId", "designation", "bio"];
export const linksFields = ["links"];
export const customizeFields = [
	"appearance.template",
	"appearance.theme",
	"appearance.btnColor",
	"appearance.isDarkMode",
];

/**
 * Helper function to check if any of the specified field paths have errors
 * @param errors - The form errors object
 * @param fieldPaths - Array of field paths to check (e.g., ["name", "emails", "appearance.theme"])
 * @returns true if any of the specified fields have errors
 */
export function hasFieldErrors(errors: FieldErrors<zCardSchema>, fieldPaths: string[]): boolean {
	for (const fieldPath of fieldPaths) {
		// Handle nested paths (e.g., "appearance.theme")
		const pathParts = fieldPath.split(".");
		let currentError: unknown = errors;

		// Navigate through nested path
		for (const part of pathParts) {
			if (currentError && typeof currentError === "object" && part in currentError) {
				currentError = (currentError as Record<string, unknown>)[part];
			} else {
				currentError = undefined;
				break;
			}
		}

		// Check if we found an error
		if (currentError !== undefined && currentError !== null) {
			// For array fields, check if any item has errors
			if (Array.isArray(currentError)) {
				if (currentError.some((item) => item !== undefined && item !== null)) {
					return true;
				}
			} else if (typeof currentError === "object") {
				// For object errors (array errors stored as objects with numeric keys)
				if (Object.keys(currentError).length > 0) {
					return true;
				}
			} else {
				// For simple field errors
				return true;
			}
		}
	}

	return false;
}

// Check for errors in General tab fields
export const detectGeneralErrors = (form: UseFormReturn<zCardSchema>) => {
	const errors = form.formState.errors;

	// Check simple fields
	if (errors.name || errors.address || errors.mapUrl || errors.companyId || errors.designation || errors.bio) {
		return true;
	}

	// Check emails array - react-hook-form stores array errors as an object with numeric keys
	if (errors.emails) {
		// Check if emails has any error (could be array-level or item-level)
		const emailErrors = errors.emails;
		if (Array.isArray(emailErrors)) {
			// If it's an array, check if any item has errors
			return emailErrors.some((item) => item !== undefined);
		}
		// If it's an object, check if any key has an error
		if (typeof emailErrors === "object") {
			return Object.keys(emailErrors).length > 0;
		}
	}

	// Check phones array - react-hook-form stores array errors as an object with numeric keys
	if (errors.phones) {
		// Check if phones has any error (could be array-level or item-level)
		const phoneErrors = errors.phones;
		if (Array.isArray(phoneErrors)) {
			// If it's an array, check if any item has errors
			return phoneErrors.some((item) => item !== undefined);
		}
		// If it's an object, check if any key has an error
		if (typeof phoneErrors === "object") {
			return Object.keys(phoneErrors).length > 0;
		}
	}

	return false;
};
