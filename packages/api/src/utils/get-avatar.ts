import { slugify } from "@ziron/utils";

export function getAvatar(name: string, image?: string | null) {
	return image ?? `https://avatar.vercel.sh/${slugify(name)}.svg?text=${name.charAt(0).toUpperCase()}`;
}
