import { useState, useTransition } from "react";

import { Route } from "next";
import Link from "next/link";

import { useUploadFiles } from "@better-upload/client";
import { formatBytes } from "@better-upload/client/helpers";
import { IconArrowRight, IconExternalLink, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@ziron/ui/components/button";
import { Card } from "@ziron/ui/components/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, useFormContext } from "@ziron/ui/components/form";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";

import { removeExtension } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

import { FileIcon, UploadDropzoneProgress } from "@/components/ui/upload-dropzone-progress";

import { UPLOAD_ROUTES } from "@/lib/constants/upload";

import { deleteFile } from "../../lib/s3";

export const AttachmentUpload = ({
	attachment,
}: {
	attachment: { url: string; filename?: string; objectKey?: string } | null;
}) => {
	const form = useFormContext<zCardSchema>();
	const [uploadedData, setUploadedData] = useState<{ url: string; filename?: string; objectKey?: string } | null>(
		attachment
	);
	const [isDeleting, startTransition] = useTransition();

	const { control } = useUploadFiles({
		route: UPLOAD_ROUTES.attachment,

		onError: (error) => {
			toast.error("Upload Error", { description: error.message });
		},

		onUploadFail: (data) => {
			toast.error("Upload Failed", { description: data.failedFiles[0]?.error.message });
		},

		onUploadComplete: ({ files, metadata }) => {
			form.setValue("attachmentUrl", (metadata?.url as string) ?? null);
			form.setValue("attachmentFileName", files[0]?.raw.name);
			toast.success("Upload Successful", {
				description: `File: ${files[0]?.raw.name ?? null}, Size: ${formatBytes(files[0]?.raw.size ?? 0)}`,
			});
			setUploadedData({
				url: metadata?.url as string,
				filename: files[0]?.raw.name,
				objectKey: files[0]?.objectInfo.key,
			});
		},
	});

	function handleDelete() {
		startTransition(async () => {
			if (uploadedData && uploadedData.objectKey) {
				try {
					await deleteFile(uploadedData.objectKey);
					// Only update UI state on successful deletion
					form.setValue("attachmentUrl", null);
					form.setValue("attachmentFileName", undefined);
					form.setValue("attachmentObjectKey", undefined);
					setUploadedData(null);
					toast.success("File deleted successfully");
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : "Failed to delete file";
					toast.error("Delete Failed", { description: errorMessage });
					// UI state remains unchanged - file still appears in form
				}
			}
		});
	}

	return (
		<FormField
			control={form.control}
			name="attachmentUrl"
			render={({ field }) => (
				<FormItem className="col-span-2">
					<FormLabel className="flex items-center justify-between">
						Attachments
						<Link
							className="flex items-center gap-1 px-2 font-medium text-primary text-xs hover:underline"
							href="https://www.ilovepdf.com/compress_pdf"
							target="_blank"
						>
							Pdf Compressor
							<IconArrowRight className="size-3" />
						</Link>
					</FormLabel>
					<FormControl>
						<UploadDropzoneProgress
							accept="image/*"
							control={control}
							description="Accepted: PDF, Image, Document"
							{...field}
						/>
					</FormControl>
					<FormMessage />
					{uploadedData && (
						<Card className="flex flex-row justify-between gap-3 p-3">
							<Link
								className="flex items-center gap-1.5"
								href={uploadedData.url as Route}
								rel="noopener noreferrer"
								target="_blank"
							>
								<FileIcon type={uploadedData.filename?.split(".").pop() ?? ""} />
								<p className="line-clamp-1 font-medium text-sm">
									{removeExtension(uploadedData.filename)}
								</p>
								<IconExternalLink className="size-4 stroke-1 text-muted-foreground" />
							</Link>
							<Button
								className="hover:bg-red-600 hover:text-red-100"
								disabled={isDeleting}
								onClick={handleDelete}
								size="icon"
								variant="outline"
							>
								<LoadingSwap isLoading={isDeleting}>
									<IconX className="size-5" />
								</LoadingSwap>
							</Button>
						</Card>
					)}
				</FormItem>
			)}
		/>
	);
};
