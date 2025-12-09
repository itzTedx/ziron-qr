import { DndLinks } from "../dnd-links";
import { AttachmentUpload } from "../fields/attachment-upload";

export const CardLinks = ({ attachment }: { attachment: { url: string; filename?: string } | null }) => {
	return (
		<div className="space-y-6">
			<DndLinks />

			<AttachmentUpload attachment={attachment} />
		</div>
	);
};
