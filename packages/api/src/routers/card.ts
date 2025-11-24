import { eq } from "@ziron/db";
import { db } from "@ziron/db/client";
import { CardType, Company, cards, emails, links, phones } from "@ziron/db/schema";
import { slugify } from "@ziron/utils";
import { cardSchema, transformSlug, ZodError, z } from "@ziron/validators";

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
                input.links.map((link, i) => {
                  const { id: _id, ...linkData } = link;
                  return {
                    ...linkData,
                    cardId: newCard.id,
                    order: i,
                  };
                })
              ),

            input.emails &&
              input.emails.length > 0 &&
              tx.insert(emails).values(
                input.emails.map((email, i) => {
                  const { id: _id, ...emailData } = email;
                  return {
                    ...emailData,
                    cardId: newCard.id,
                    order: i,
                  };
                })
              ),

            input.phones &&
              input.phones.length > 0 &&
              tx.insert(phones).values(
                input.phones.map((phone, i) => {
                  const { id: _id, ...phoneData } = phone;
                  return {
                    ...phoneData,
                    cardId: newCard.id,
                    order: i,
                  };
                })
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

export const checkSlugAvailability = protectedProcedure
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
  .handler(async ({ input, errors }) => {
    try {
      const isAvailable = await db.query.cards.findFirst({
        where: eq(cards.slug, input.slug),
      });

      return {
        isAvailable: !isAvailable,
        slug: transformSlug(input.slug),
      };
    } catch (error) {
      console.log("Error in checkSlugAvailability", error);
      throw errors.INTERNAL_SERVER_ERROR({ message: error instanceof ZodError ? error.message : "Unknown error" });
    }
  });

export const updateCard = protectedProcedure
  .route({
    method: "PUT",
    path: "/card/:id",
    summary: "Update a card",
    description: "Update a card with the given name, phone, website, address, and logo",
    tags: ["card"],
  })
  .input(
    cardSchema.extend({
      id: z.string(),
    })
  )
  .output(
    z.object({
      cardName: z.string(),
    })
  )
  .handler(async ({ input, errors }) => {
    const placeholderCover = "/images/placeholder-cover.jpg";

    const { error } = cardSchema.safeParse(input);
    console.log("Validation Error", error);
    if (error) throw errors.BAD_REQUEST({ message: error.message });

    try {
      const uniqueSlug = await generateSlug(input.name);
      const { id, ...updateData } = input;

      const cardData = {
        name: input.name,
        address: input.address,
        mapUrl: input.mapUrl,
        bio: input.bio,
        designation: input.designation,
        companyId: input.companyId,
        slug: updateData.slug ?? uniqueSlug,
        image: getAvatar(updateData.name, updateData.image),
        cover: updateData.cover ?? placeholderCover,
        attachmentFileName: input.attachmentFileName,
        attachmentUrl: input.attachmentUrl,
      };

      const card = await db.transaction(async (tx) => {
        const [updatedCard] = await tx.update(cards).set(cardData).where(eq(cards.id, id)).returning({
          id: cards.id,
          name: cards.name,
        });

        if (!updatedCard) {
          throw errors.INTERNAL_SERVER_ERROR();
        }

        // Batch delete operations
        await Promise.all([
          tx.delete(links).where(eq(links.cardId, updatedCard.id)),
          tx.delete(phones).where(eq(phones.cardId, updatedCard.id)),
          tx.delete(emails).where(eq(emails.cardId, updatedCard.id)),
        ]);

        await Promise.all(
          [
            updateData.links &&
              updateData.links.length > 0 &&
              tx.insert(links).values(
                updateData.links.map((link, i) => {
                  const { id: _id, ...linkData } = link;
                  return {
                    ...linkData,
                    cardId: updatedCard.id,
                    order: i,
                  };
                })
              ),

            updateData.emails &&
              updateData.emails.length > 0 &&
              tx.insert(emails).values(
                updateData.emails.map((email, i) => {
                  const { id: _id, ...emailData } = email;
                  return {
                    ...emailData,
                    cardId: updatedCard.id,
                    order: i,
                  };
                })
              ),

            updateData.phones &&
              updateData.phones.length > 0 &&
              tx.insert(phones).values(
                updateData.phones.map((phone, i) => {
                  const { id: _id, ...phoneData } = phone;
                  return {
                    ...phoneData,
                    cardId: updatedCard.id,
                    order: i,
                  };
                })
              ),
          ].filter(Boolean)
        );

        return updatedCard;
      });

      if (!card) {
        throw errors.INTERNAL_SERVER_ERROR();
      }

      return {
        cardName: card.name,
      };
    } catch (error) {
      console.log("Error in updateCard", error);
      throw errors.INTERNAL_SERVER_ERROR({ message: error instanceof Error ? error.message : "Unknown error" });
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

export const deleteCard = protectedProcedure
  .route({
    method: "DELETE",
    path: "/card/:id",
    summary: "Delete a card",
    description: "Delete a card by ID",
    tags: ["card"],
  })
  .input(z.object({ id: z.string() }))
  .output(z.object({ success: z.boolean(), cardName: z.string() }))
  .handler(async ({ input, errors }) => {
    try {
      const [data] = await Promise.all([
        db.update(cards).set({ deletedAt: new Date() }).where(eq(cards.id, input.id)).returning({
          name: cards.name,
        }),
        db.update(links).set({ deletedAt: new Date() }).where(eq(links.cardId, input.id)),
        db.update(emails).set({ deletedAt: new Date() }).where(eq(emails.cardId, input.id)),
        db.update(phones).set({ deletedAt: new Date() }).where(eq(phones.cardId, input.id)),
      ]);

      if (!data[0]) {
        throw errors.NOT_FOUND();
      }
      return { success: true, cardName: data[0].name };
    } catch (error) {
      console.log("Error in deleteCard", error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

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
      where: (cards, { isNull }) => isNull(cards.deletedAt),
      with: {
        cards: true,
      },
    });

    console.log("Data from listCards", data);

    return data;
  });

export const getCard = protectedProcedure
  .route({
    method: "GET",
    path: "/card/:id",
    summary: "Get a card by ID",
    description: "Get a card by ID",
    tags: ["card"],
  })
  .input(z.object({ id: z.string() }))
  .output(z.custom<CardType>().optional())
  .handler(async ({ input }) => {
    if (input.id !== "new") {
      const data = await db.query.cards.findFirst({
        where: (cards, { eq, isNull, and }) => and(eq(cards.id, input.id), isNull(cards.deletedAt)),
        with: {
          emails: true,
          phones: true,
          links: true,
          company: true,
          styles: true,
        },
      });

      return data;
    }
  });
