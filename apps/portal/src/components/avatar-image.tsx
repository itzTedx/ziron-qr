import Image from "next/image";

import { getAvatarDataUrl } from "@/lib/avatar";

interface AvatarImageProps {
  name: string;
  image?: string | null;
  size?: number;
  rounded?: number;
  className?: string;
  alt?: string;
}

/**
 * Server Component: Avatar image that uses the orpc avatar route
 * Falls back to generated avatar if no image is provided
 */
export async function AvatarImage({ name, image, size = 120, rounded = 999, className, alt }: AvatarImageProps) {
  const avatarUrl = image ?? (await getAvatarDataUrl(name, { size, rounded }));

  return <Image alt={alt ?? `${name}'s avatar`} className={className} height={size} src={avatarUrl} width={size} />;
}
