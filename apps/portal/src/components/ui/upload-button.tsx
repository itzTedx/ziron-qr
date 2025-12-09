import { useId } from "react";

import type { UploadHookControl } from "@better-upload/client";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@ziron/ui/components/button";

import { cn } from "@ziron/utils";

type UploadButtonProps = {
	control: UploadHookControl<false>;
	accept?: string;
	metadata?: Record<string, unknown>;
	uploadOverride?: (...args: Parameters<UploadHookControl<false>["upload"]>) => void;
	className?: string;
	// Add any additional props you need.
	buttonProps?: React.ComponentProps<typeof Button>;
	inputRef?: React.Ref<HTMLInputElement>;
};

export function UploadButton({
	control: { upload, isPending },
	accept,
	metadata,
	uploadOverride,
	className,
	buttonProps,
	inputRef,
}: UploadButtonProps) {
	const id = useId();

	return (
		<Button className={cn("relative", className)} disabled={isPending} type="button" {...buttonProps}>
			<label className="absolute inset-0 cursor-pointer" htmlFor={id}>
				<input
					accept={accept}
					className="absolute inset-0 size-0 opacity-0"
					id={id}
					onChange={(e) => {
						if (e.target.files?.[0] && !isPending) {
							if (uploadOverride) {
								uploadOverride(e.target.files[0], { metadata });
							} else {
								upload(e.target.files[0], { metadata });
							}
						}
						e.target.value = "";
					}}
					ref={inputRef}
					type="file"
				/>
			</label>
			{isPending ? (
				<>
					<Loader2 className="size-4 animate-spin" />
					Upload file
				</>
			) : (
				<>
					<Upload className="size-4" />
					Upload file
				</>
			)}
		</Button>
	);
}
