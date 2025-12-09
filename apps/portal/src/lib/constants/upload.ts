export const UPLOAD_ROUTES = {
	attachment: "attachment",
	photo: "photo",
	cover: "cover",
	logo: "logo",
} as const;

export const UPLOAD_FILE_TYPES = {
	attachment: ["image/*", "application/pdf,"],
	image: ["image/*"],
};

export const UPLOAD_MAX_FILE_SIZE = {
	"2xl": 1024 * 1024 * 20, // 20MB
	xl: 1024 * 1024 * 10, // 10MB
	lg: 1024 * 1024 * 5, // 5MB
	md: 1024 * 1024 * 2, // 2MB
	sm: 1024 * 1024 * 1, // 1MB
} as const;
