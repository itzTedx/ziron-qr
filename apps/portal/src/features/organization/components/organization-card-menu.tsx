"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import { motion } from "motion/react";

import { IconEdit } from "@ziron/ui/assets/icons/edit";
import { Button } from "@ziron/ui/components/button";
import { useMediaQuery } from "@ziron/ui/hooks";

export const OrganizationCardMenu = ({ groupHover }: { groupHover: boolean }) => {
	const { isMobile } = useMediaQuery();
	return (
		<motion.div
			animate={{
				width: groupHover && !isMobile ? "auto" : isMobile ? 79 : 36,
			}}
			className="flex items-center justify-end divide-x overflow-hidden rounded-md border"
			initial={false}
		>
			<Button className="rounded-none" size="sm" variant="ghost">
				<IconEdit />
			</Button>
			<Button className="rounded-none" size="sm" variant="ghost">
				<IconDotsVertical />
			</Button>
		</motion.div>
	);
};
