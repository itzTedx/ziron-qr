export function getAvatar(name: string, image?: string | null) {
  return image ?? `https://avatar.vercel.sh/${name}`;
}
