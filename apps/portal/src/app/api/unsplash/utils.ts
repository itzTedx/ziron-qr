import { createApi } from "unsplash-js";

import { env } from "@/lib/env/server";

export const unsplash = createApi({
  accessKey: env.UNSPLASH_ACCESS_KEY,
});
