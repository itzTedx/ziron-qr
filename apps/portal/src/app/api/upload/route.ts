import { type Router, route } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { aws } from "@better-upload/server/clients";

import { UPLOAD_FILE_TYPES, UPLOAD_ROUTES } from "@/lib/constants/upload";
import { env } from "@/lib/env/server";

import { generateObjectKey, generatePublicUrl } from "./helper";

const s3 = aws({
  region: env.AWS_BUCKET_REGION,
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
});

const router: Router = {
  client: s3,
  bucketName: env.AWS_BUCKET_NAME,
  routes: {
    [UPLOAD_ROUTES.attachment]: route({
      fileTypes: [UPLOAD_FILE_TYPES.attachment],
      multipleFiles: false,

      onBeforeUpload: async ({ file }) => {
        try {
          const objectKey = generateObjectKey(file, UPLOAD_ROUTES.attachment);
          return {
            objectInfo: {
              key: objectKey,
            },
          };
        } catch (error) {
          throw error;
        }
      },

      onAfterSignedUrl: async ({ file }) => {
        try {
          const url = generatePublicUrl(file.objectInfo.key);

          return { metadata: { url } };
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    }),
  },
};

export const { POST } = toRouteHandler(router);
