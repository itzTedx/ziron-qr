import crypto from "crypto";

import { env } from "@/lib/env/server";

export const generateObjectKey = (file: { name: string; size: number; type: string }, uploadRoute: string) => {
  const filename = file.name.replace(/\.[^/.]+$/, "");
  const safeFileName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileExtension = file.name.split(".").pop() || "";
  const objectKey = `${uploadRoute}/${safeFileName}-${generateFileName()}.${fileExtension}`;

  return objectKey;
};

export const generateFileName = (bytes = 16) => crypto.randomBytes(bytes).toString("hex");

export const generatePublicUrl = (objectKey: string) => {
  return `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_BUCKET_REGION}.amazonaws.com/${objectKey}`;
};
