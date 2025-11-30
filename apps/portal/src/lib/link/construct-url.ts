import { env } from "../env/client";

export const constructUrl = (path: string) => {
  return `${env.NEXT_PUBLIC_CLIENT_URL}/${path.startsWith("/") ? path.slice(1) : path}`;
};
