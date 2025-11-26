import { type Router, route } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { aws } from "@better-upload/server/clients";

import { UPLOAD_FILE_TYPES, UPLOAD_MAX_FILE_SIZE, UPLOAD_ROUTES } from "@/lib/constants/upload";
import { env } from "@/lib/env/server";
import { generatePublicUrl } from "@/lib/utils";

import { generateObjectKey } from "./helper";

const s3Client = aws({
  region: env.AWS_BUCKET_REGION,
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
});

const router: Router = {
  client: s3Client,
  bucketName: env.AWS_BUCKET_NAME,
  routes: {
    [UPLOAD_ROUTES.attachment]: route({
      fileTypes: UPLOAD_FILE_TYPES.attachment,
      multipleFiles: false,
      maxFileSize: UPLOAD_MAX_FILE_SIZE["2xl"],
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
    [UPLOAD_ROUTES.photo]: route({
      fileTypes: UPLOAD_FILE_TYPES.image,
      multipleFiles: false,
      maxFileSize: UPLOAD_MAX_FILE_SIZE.lg,

      onBeforeUpload: async ({ file }) => {
        try {
          const objectKey = generateObjectKey(file, UPLOAD_ROUTES.photo);
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
    [UPLOAD_ROUTES.cover]: route({
      fileTypes: UPLOAD_FILE_TYPES.image,
      multipleFiles: false,
      maxFileSize: UPLOAD_MAX_FILE_SIZE["2xl"],

      onBeforeUpload: async ({ file }) => {
        try {
          const objectKey = generateObjectKey(file, UPLOAD_ROUTES.cover);
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
