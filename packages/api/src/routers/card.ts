import { eq } from "@ziron/db";
import { db } from "@ziron/db/client";
import { Company, cards, emails, links, phones } from "@ziron/db/schema";
import { slugify } from "@ziron/utils";
import { cardSchema, z } from "@ziron/validators";

import { protectedProcedure } from "..";
import { getAvatar } from "../utils/get-avatar";

export const createCard = protectedProcedure
  .route({
    method: "POST",
    path: "/card",
    summary: "Create a new card",
    description: "Create a new card with the given name, phone, website, address, and logo",
    tags: ["card"],
  })
  .input(cardSchema)
  .output(
    z.object({
      cardName: z.string(),
    })
  )
  .handler(async ({ input, errors }) => {
    const placeholderCover = "/images/placeholder-cover.jpg";

    try {
      const uniqueSlug = await generateSlug(input.name);

      const card = await db.transaction(async (tx) => {
        const [newCard] = await db
          .insert(cards)
          .values({
            ...input,
            slug: input.slug ?? uniqueSlug,
            image: getAvatar(input.name, input.image),
            cover: input.cover ?? placeholderCover,
          })
          .returning({
            id: cards.id,
            name: cards.name,
          });

        if (!newCard) {
          throw errors.INTERNAL_SERVER_ERROR();
        }

        await Promise.all(
          [
            input.links &&
              input.links.length > 0 &&
              tx.insert(links).values(
                input.links.map((link, i) => ({
                  ...link,
                  cardId: newCard.id,
                  order: i,
                }))
              ),

            input.emails &&
              input.emails.length > 0 &&
              tx.insert(emails).values(
                input.emails.map((email, i) => ({
                  ...email,
                  cardId: newCard.id,
                  order: i,
                }))
              ),

            input.phones &&
              input.phones.length > 0 &&
              tx.insert(phones).values(
                input.phones.map((phone, i) => ({
                  ...phone,
                  cardId: newCard.id,
                  order: i,
                }))
              ),
          ].filter(Boolean)
        );

        return newCard;
      });

      if (!card) {
        throw errors.INTERNAL_SERVER_ERROR();
      }

      return {
        cardName: card.name,
      };
    } catch {
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

async function generateSlug(name: string) {
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

export const listCards = protectedProcedure
  .route({
    method: "GET",
    path: "/card",
    summary: "List all cards",
    description: "List all cards with their company",
    tags: ["card"],
  })
  .output(z.array(z.custom<Company>()))
  .handler(async () => {
    const data = await db.query.companies.findMany({
      where: (companies, { isNull }) => isNull(companies.deletedAt),
      with: {
        cards: true,
      },
    });

    return data;
  });
