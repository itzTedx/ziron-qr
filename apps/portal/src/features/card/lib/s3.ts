"use server";

import { aws } from "@better-upload/server/clients";
import { deleteObject } from "@better-upload/server/helpers";

import { env } from "@/lib/env/server";

export async function deleteFile(objectKey: string) {
  const s3Client = aws({
    region: env.AWS_BUCKET_REGION,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  });

  await deleteObject(s3Client, {
    bucket: env.AWS_BUCKET_NAME,
    key: objectKey,
  });
}
