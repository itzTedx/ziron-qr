import { getAvatarDataUrl } from "@/lib/avatar";

/**
 * Get avatar URL for a card
 * Falls back to generated avatar if no image is provided
 */
export async function getCardAvatarUrl(name: string, image?: string | null): Promise<string> {
	if (image) {
		return image;
	}

	return getAvatarDataUrl(name, {
		text: name.charAt(0).toUpperCase(),
		size: 120,
		rounded: 999, // Fully rounded
	});
}
