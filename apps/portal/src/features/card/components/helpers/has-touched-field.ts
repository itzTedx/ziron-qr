// Helper function to check if any field is touched (including nested fields)
export function hasAnyTouchedField(touchedFields: Record<string, unknown>): boolean {
	for (const key in touchedFields) {
		if (touchedFields[key] === true) {
			return true;
		}
		if (typeof touchedFields[key] === "object" && touchedFields[key] !== null) {
			if (hasAnyTouchedField(touchedFields[key] as Record<string, unknown>)) {
				return true;
			}
		}
	}
	return false;
}
