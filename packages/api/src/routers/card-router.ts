import { os } from "@orpc/server";

import { eq } from "@ziron/db";
import { db } from "@ziron/db/client";
import { appearance, CardType, cards, emails, links, phones } from "@ziron/db/schema";
import { slugify } from "@ziron/utils";
import { cardSchema, transformSlug, ZodError, z } from "@ziron/validators";

import { protectedProcedure, publicProcedure } from "..";
import { dbProvider } from "../middleware/db-provider";
import { getAvatar } from "../utils/get-avatar";

export const createCard = protectedProcedure
  .use(dbProvider)
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
  .handler(async ({ input, errors, context }) => {
    const placeholderCover = "/images/placeholder-cover.jpg";

    try {
      const uniqueSlug = await generateSlug(input.name);

      const card = await context.db.transaction(async (tx) => {
        const [newCard] = await context.db
          .insert(cards)
          .values({
            ...input,
            slug: uniqueSlug,
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

        await tx.insert(appearance).values({
          cardId: newCard.id,
          template: input.appearance.template,
          theme: input.appearance.theme ?? "#4938ff",
          btnColor: input.appearance.btnColor ?? "#4938ff",
          isDarkMode: input.appearance.isDarkMode ?? false,
        });

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
      console.log("Error in checkSlugAvailability", error);
      throw errors.INTERNAL_SERVER_ERROR({ message: error instanceof ZodError ? error.message : "Unknown error" });
    }
  });

export const updateCard = protectedProcedure
  .use(dbProvider)
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
  .handler(async ({ input, errors, context }) => {
    const placeholderCover = "/images/placeholder-cover.jpg";

    const { error } = cardSchema.safeParse(input);

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
        organizationId: input.organizationId,
        slug: updateData.slug ?? uniqueSlug,
        image: getAvatar(updateData.name, updateData.image),
        cover: updateData.cover ?? placeholderCover,
        attachmentFileName: input.attachmentFileName,
        attachmentUrl: input.attachmentUrl,
      };

      const card = await context.db.transaction(async (tx) => {
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
          tx.delete(appearance).where(eq(appearance.cardId, updatedCard.id)),
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

        await tx.insert(appearance).values({
          cardId: updatedCard.id,
          template: updateData.appearance.template,
          theme: updateData.appearance.theme ?? "#4938ff",
          btnColor: updateData.appearance.btnColor ?? "#4938ff",
          isDarkMode: updateData.appearance.isDarkMode ?? false,
        });

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

export const duplicateCard = protectedProcedure
  .use(dbProvider)
  .route({
    method: "POST",
    path: "/card/:id/duplicate",
    summary: "Duplicate a card",
    description: "Create a duplicate of an existing card with all its data",
    tags: ["card"],
  })
  .input(z.object({ id: z.string() }))
  .output(
    z.object({
      cardId: z.string(),
      cardName: z.string(),
    })
  )
  .handler(async ({ input, errors, context }) => {
    const placeholderCover = "/images/placeholder-cover.jpg";

    try {
      // Fetch the original card with all relations
      const originalCard = await context.db.query.cards.findFirst({
        where: (cards, { eq, isNull, and }) =>
          and(eq(cards.id, input.id), isNull(cards.deletedAt), isNull(cards.archivedAt)),
        with: {
          emails: true,
          phones: true,
          links: true,
          appearance: true,
        },
      });

      if (!originalCard) {
        throw errors.NOT_FOUND();
      }

      // Generate a unique slug for the duplicate
      const uniqueSlug = await generateSlug(originalCard.name);

      const duplicatedCard = await context.db.transaction(async (tx) => {
        // Create the new card
        const [newCard] = await tx
          .insert(cards)
          .values({
            name: originalCard.name,
            slug: uniqueSlug,
            bio: originalCard.bio,
            designation: originalCard.designation,
            organizationId: originalCard.organizationId,
            address: originalCard.address,
            mapUrl: originalCard.mapUrl,
            image: originalCard.image,
            cover: originalCard.cover ?? placeholderCover,
            attachmentUrl: originalCard.attachmentUrl,
            attachmentFileName: originalCard.attachmentFileName,
            attachmentObjectKey: originalCard.attachmentObjectKey,
          })
          .returning({
            id: cards.id,
            name: cards.name,
          });

        if (!newCard) {
          throw errors.INTERNAL_SERVER_ERROR();
        }

        // Copy all related data
        await Promise.all(
          [
            originalCard.links &&
              originalCard.links.length > 0 &&
              tx.insert(links).values(
                originalCard.links.map((link, i) => ({
                  label: link.label,
                  url: link.url,
                  icon: link.icon,
                  category: link.category,
                  cardId: newCard.id,
                  order: i,
                }))
              ),

            originalCard.emails &&
              originalCard.emails.length > 0 &&
              tx.insert(emails).values(
                originalCard.emails.map((email, i) => ({
                  email: email.email,
                  label: email.label,
                  cardId: newCard.id,
                  order: i,
                }))
              ),

            originalCard.phones &&
              originalCard.phones.length > 0 &&
              tx.insert(phones).values(
                originalCard.phones.map((phone, i) => ({
                  phone: phone.phone,
                  label: phone.label,
                  cardId: newCard.id,
                  order: i,
                }))
              ),
          ].filter(Boolean)
        );

        // Copy appearance settings
        if (originalCard.appearance) {
          await tx.insert(appearance).values({
            cardId: newCard.id,
            template: originalCard.appearance.template,
            theme: originalCard.appearance.theme ?? "#4938ff",
            btnColor: originalCard.appearance.btnColor ?? "#4938ff",
            isDarkMode: originalCard.appearance.isDarkMode ?? false,
          });
        }

        return newCard;
      });

      if (!duplicatedCard) {
        throw errors.INTERNAL_SERVER_ERROR();
      }

      return {
        cardId: duplicatedCard.id,
        cardName: duplicatedCard.name,
      };
    } catch (error) {
      console.log("Error in duplicateCard", error);
      if (error instanceof Error && error.message.includes("NOT_FOUND")) {
        throw error;
      }
      throw errors.INTERNAL_SERVER_ERROR({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

export const archiveCard = protectedProcedure
  .use(dbProvider)
  .route({
    method: "POST",
    path: "/card/:id/archive",
    summary: "Archive a card",
    description: "Archive a card by ID",
    tags: ["card"],
  })
  .input(z.object({ id: z.string() }))
  .output(z.object({ success: z.boolean(), cardName: z.string() }))
  .handler(async ({ input, errors, context }) => {
    try {
      const [data] = await context.db
        .update(cards)
        .set({ archivedAt: new Date() })
        .where(eq(cards.id, input.id))
        .returning({
          name: cards.name,
        });

      if (!data) {
        throw errors.NOT_FOUND();
      }
      return { success: true, cardName: data.name };
    } catch (error) {
      console.log("Error in archiveCard", error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

export const deleteCard = protectedProcedure
  .use(dbProvider)
  .route({
    method: "DELETE",
    path: "/card/:id",
    summary: "Delete a card",
    description: "Delete a card by ID",
    tags: ["card"],
  })
  .input(z.object({ id: z.string() }))
  .output(z.object({ success: z.boolean(), cardName: z.string() }))
  .handler(async ({ input, errors, context }) => {
    try {
      const [data] = await Promise.all([
        context.db.update(cards).set({ deletedAt: new Date() }).where(eq(cards.id, input.id)).returning({
          name: cards.name,
        }),
        context.db.update(links).set({ deletedAt: new Date() }).where(eq(links.cardId, input.id)),
        context.db.update(emails).set({ deletedAt: new Date() }).where(eq(emails.cardId, input.id)),
        context.db.update(phones).set({ deletedAt: new Date() }).where(eq(phones.cardId, input.id)),
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

export const listCards = os
  .use(dbProvider)
  .route({
    method: "GET",
    path: "/card",
    summary: "List all cards",
    description: "List all cards with their company",
    tags: ["card"],
  })
  .output(z.array(z.custom<CardType>()))
  .handler(async ({ context }) => {
    const data = await context.db.query.cards.findMany({
      where: (organization, { isNull }) => isNull(organization.deletedAt),
      with: {
        organization: true,
        emails: true,
        phones: true,
        links: true,
        appearance: true,
      },
    });

    return data;
  });

export const getCard = publicProcedure
  .use(dbProvider)
  .route({
    method: "GET",
    path: "/card/:id",
    summary: "Get a card by ID",
    description: "Get a card by ID",
    tags: ["card"],
  })
  .input(
    z.object({
      id: z.string().optional(),
    })
  )
  .output(z.custom<CardType>().optional())
  .handler(async ({ input, context, errors }) => {
    const cardId = input.id;

    if (!cardId) {
      throw errors.BAD_REQUEST({ message: "Card ID is required" });
    }

    const data = await context.db.query.cards.findFirst({
      where: (cards, { eq, isNull, and }) =>
        and(eq(cards.id, cardId), isNull(cards.deletedAt), isNull(cards.archivedAt)),
      with: {
        emails: true,
        phones: true,
        links: true,
        organization: true,
        appearance: true,
      },
    });

    if (!data) throw errors.NOT_FOUND();

    return data;
  });

export const getCardBySlug = publicProcedure
  .use(dbProvider)
  .route({
    method: "GET",
    path: "/card/:slug",
    summary: "Get a card by Slug",
    description: "Get a card by Slug",
    tags: ["card"],
  })
  .input(z.object({ slug: z.string() }))
  .output(z.custom<CardType>().optional())
  .handler(async ({ input, context }) => {
    if (input.slug !== "new") {
      const data = await context.db.query.cards.findFirst({
        where: (cards, { eq, isNull, and }) =>
          and(eq(cards.slug, input.slug), isNull(cards.deletedAt), isNull(cards.archivedAt)),
        with: {
          emails: true,
          phones: true,
          links: true,
          organization: true,
          appearance: true,
        },
      });

      return data;
    }
  });
