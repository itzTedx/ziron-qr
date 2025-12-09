import { client } from "@/lib/orpc/client";

/**
 * Get an avatar SVG as a data URL that can be used in img src
 * @param name - The name to generate the avatar from
 * @param options - Optional configuration for the avatar
 * @returns A data URL string that can be used in img src
 */
export async function getAvatarDataUrl(
	name: string,
	options?: {
		text?: string;
		size?: number;
		rounded?: number;
	}
): Promise<string> {
	const svg = await client.avatar.get.v1({
		name,
		text: options?.text ?? name.charAt(0).toUpperCase(),
		size: options?.size ?? 120,
		rounded: options?.rounded ?? 0,
	});

	// Convert SVG to data URL
	const encodedSvg = encodeURIComponent(svg);
	return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
}

/**
 * Get an avatar SVG string
 * @param name - The name to generate the avatar from
 * @param options - Optional configuration for the avatar
 * @returns SVG string
 */
export async function getAvatarSvg(
	name: string,
	options?: {
		text?: string;
		size?: number;
		rounded?: number;
	}
): Promise<string> {
	return client.avatar.get.v1({
		name,
		text: options?.text ?? name.charAt(0).toUpperCase(),
		size: options?.size ?? 120,
		rounded: options?.rounded ?? 0,
	});
}
