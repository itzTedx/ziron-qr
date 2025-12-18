import z from "zod";

import { eq } from "@ziron/db";
import { db } from "@ziron/db/client";
import { cards } from "@ziron/db/schema";
import { slugify } from "@ziron/utils";
import { transformSlug } from "@ziron/validators";

import { protectedProcedure } from "../..";
import { dbProvider } from "../../middleware/db-provider";

export async function generateSlug(name: string) {
	let slug = slugify(name);
	let counter = 1;

	let exists = await db.query.cards.findMany({
		where: eq(cards.slug, slug),
		columns: {
			slug: true,
		},
		limit: 1,
	});

	while (exists.length > 0) {
		slug = `${slugify(name)}-${counter}`;

		exists = await db.query.cards.findMany({
			where: eq(cards.slug, slug),
			columns: {
				slug: true,
			},
			limit: 1,
		});

		counter++;
	}

	return slug;
}

export const checkSlugAvailability = protectedProcedure
	.use(dbProvider)
	.route({
		method: "POST",
		path: "/card/check-slug",
		summary: "Check if a slug is available",
		description: "Check if a slug is available",
		tags: ["card"],
	})
	.input(z.object({ slug: z.string() }))
	.output(
		z.object({
			isAvailable: z.boolean(),
			slug: z.string(),
		})
	)
	.handler(async ({ input, errors, context }) => {
		try {
			const isAvailable = await context.db.query.cards.findFirst({
				where: eq(cards.slug, input.slug),
			});

			return {
				isAvailable: !isAvailable,
				slug: transformSlug(input.slug),
			};
		} catch (error) {
			console.error("Error in checkSlugAvailability:", error);
			throw errors.INTERNAL_SERVER_ERROR({
				message:
					error instanceof Error
						? `Failed to check slug availability for "${input.slug}": ${error.message}`
						: "Failed to check slug availability: Unknown error occurred",
			});
		}
	});
