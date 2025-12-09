"use client";

import { useState } from "react";

import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { IconPhone } from "@tabler/icons-react";

import { IconArrowMoveDownRight } from "@ziron/ui/assets/icons/arrows";
import { IconBuilding } from "@ziron/ui/assets/icons/building";
import { Badge } from "@ziron/ui/components/badge";

import { OrganizationWithCardsCount } from "@ziron/db/schema";

import { OrganizationCardMenu } from "./organization-card-menu";

export const OrganizationCard = ({ organization }: { organization: OrganizationWithCardsCount }) => {
	const [groupHover, setGroupHover] = useState(false);
	return (
		<div
			className="group rounded-xl border p-3"
			onPointerEnter={() => setGroupHover(true)}
			onPointerLeave={() => setGroupHover(false)}
		>
			<div className="grid grid-cols-[1.5fr_1fr] items-center gap-3 sm:grid-cols-[3fr_1fr_1.5fr] sm:gap-4 md:grid-cols-[2fr_1fr_0.5fr_1.5fr]">
				<div className="flex items-center gap-3">
					<figure className="relative flex aspect-square h-14 items-center justify-center overflow-hidden rounded-md">
						{organization.logo ? (
							<Image alt={organization.name} className="object-cover" fill src={organization.logo} />
						) : (
							<div className="flex size-14 shrink-0 items-center justify-center rounded-sm bg-muted/50 p-2">
								<IconBuilding />
							</div>
						)}
					</figure>

					<div>
						<h3 className="font-medium text-sm">{organization.name}</h3>
						{organization.website && (
							<div className="flex items-center gap-1">
								<IconArrowMoveDownRight className="size-3 shrink-0 text-muted-foreground" />{" "}
								<Link
									className="text-muted-foreground text-sm hover:underline"
									href={organization.website as Route}
									prefetch={false}
									rel="noopener noreferrer"
									target="_blank"
								>
									<p>{organization.website}</p>
								</Link>
							</div>
						)}
					</div>
				</div>
				{organization.phone && (
					<div className="flex items-center gap-1 text-sm">
						<IconPhone className="size-3 text-muted-foreground" /> <p>{organization.phone}</p>
					</div>
				)}
				<div>{organization.cardsCount ? <Badge>{organization.cardsCount} Cards</Badge> : null}</div>
				<div className="flex justify-end gap-2 sm:gap-3">
					<OrganizationCardMenu groupHover={groupHover} />
				</div>
			</div>
		</div>
	);
};
