"use client";

import { Collapsible as CollapsiblePrimitive } from "radix-ui";

function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
	return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />;
}

function CollapsibleContent({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
	return (
		<CollapsiblePrimitive.CollapsibleContent
			className="overflow-hidden text-sm transition-[height,content_visibility] transition-discrete [interpolate-size:allow-keywords] aria-hidden:h-0"
			data-slot="collapsible-content"
			{...props}
		/>
	);
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
