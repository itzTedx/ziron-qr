import crypto from "crypto";

export const generateObjectKey = (file: { name: string; size: number; type: string }, uploadRoute: string) => {
	const filename = file.name.replace(/\.[^/.]+$/, "");
	const safeFileName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
	const fileExtension = file.name.split(".").pop() || "";
	const objectKey = `${uploadRoute}/${safeFileName}-${generateFileName()}.${fileExtension}`;

	return objectKey;
};

export const generateFileName = (bytes = 16) => crypto.randomBytes(bytes).toString("hex");
