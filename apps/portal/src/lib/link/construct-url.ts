import { env } from "../env/client";

export const constructUrl = (path: string) => {
  return `${env.NEXT_PUBLIC_CLIENT_URL}/${path.startsWith("/") ? path.slice(1) : path}`;
};

export const getPrettyUrl = (url?: string | null) => {
  if (!url) return "";
  // remove protocol (http/https) and www.
  // also remove trailing slash
  return url
    .replace(/(^\w+:|^)\/\//, "")
    .replace("www.", "")
    .replace(/\/$/, "");
};
