import { os } from "@orpc/server";

import { and, count, desc, eq, gte, isNull, lte } from "@ziron/db";
import { db } from "@ziron/db/client";
import {
  appearance,
  Card,
  type CardType,
  type CardWithPageVisits,
  cards,
  emails,
  links,
  organizationTable,
  pageVisits,
  phones,
} from "@ziron/db/schema";
import { slugify } from "@ziron/utils";
import {
  cardSchema,
  exportCardSchema,
  columns as exportColumns,
  transformSlug,
  workspacePreferencesSchema,
  z,
} from "@ziron/validators";

import { protectedProcedure, publicProcedure } from "..";
import { dbProvider } from "../middleware/db-provider";
import { getAvatar } from "../utils/get-avatar";
import { convertToCSV } from "../utils/json-to-csv";

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
          throw errors.INTERNAL_SERVER_ERROR({
            message: `Failed to create card: Database insert returned no card for name "${input.name}"`,
          });
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
        throw errors.INTERNAL_SERVER_ERROR({
          message: `Failed to create card: Transaction completed but no card was returned for name "${input.name}"`,
        });
      }

      return {
        cardName: card.name,
      };
    } catch (error) {
      console.error("Error in createCard:", error);
      throw errors.INTERNAL_SERVER_ERROR({
        message:
          error instanceof Error
            ? `Failed to create card: ${error.message}`
            : "Failed to create card: Unknown error occurred",
      });
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
      console.error("Error in checkSlugAvailability:", error);
      throw errors.INTERNAL_SERVER_ERROR({
        message:
          error instanceof Error
            ? `Failed to check slug availability for "${input.slug}": ${error.message}`
            : "Failed to check slug availability: Unknown error occurred",
      });
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
      id: z.string(),
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
          throw errors.INTERNAL_SERVER_ERROR({
            message: `Failed to update card: Database update returned no card for ID "${id}"`,
          });
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
        throw errors.INTERNAL_SERVER_ERROR({
          message: `Failed to update card: Transaction completed but no card was returned for ID "${id}"`,
        });
      }

      return {
        id: card.id,
        cardName: card.name,
      };
    } catch (error) {
      console.error("Error in updateCard:", error);
      throw errors.INTERNAL_SERVER_ERROR({
        message:
          error instanceof Error
            ? `Failed to update card with ID "${input.id}": ${error.message}`
            : "Failed to update card: Unknown error occurred",
      });
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
          throw errors.INTERNAL_SERVER_ERROR({
            message: `Failed to duplicate card: Database insert returned no card when duplicating card ID "${input.id}"`,
          });
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
        throw errors.INTERNAL_SERVER_ERROR({
          message: `Failed to duplicate card: Transaction completed but no duplicated card was returned for ID "${input.id}"`,
        });
      }

      return {
        cardId: duplicatedCard.id,
        cardName: duplicatedCard.name,
      };
    } catch (error) {
      console.error("Error in duplicateCard:", error);
      if (error instanceof Error && error.message.includes("NOT_FOUND")) {
        throw error;
      }
      throw errors.INTERNAL_SERVER_ERROR({
        message:
          error instanceof Error
            ? `Failed to duplicate card with ID "${input.id}": ${error.message}`
            : "Failed to duplicate card: Unknown error occurred",
      });
    }
  });

export const archiveCard = protectedProcedure
  .use(dbProvider)
  .route({
    method: "POST",
    path: "/card/:id/archive",
    summary: "Archive or unarchive a card",
    description:
      "Archive or unarchive a card by ID. If the card is archived, it will be unarchived. If not archived, it will be archived.",
    tags: ["card"],
  })
  .input(z.object({ id: z.string() }))
  .output(z.object({ success: z.boolean(), cardName: z.string() }))
  .handler(async ({ input, errors, context }) => {
    try {
      // First, get the current card to check if it's archived
      const currentCard = await context.db.query.cards.findFirst({
        where: eq(cards.id, input.id),
        columns: {
          id: true,
          name: true,
          archivedAt: true,
        },
      });

      if (!currentCard) {
        throw errors.NOT_FOUND();
      }

      // Toggle archive status: if archived, unarchive (set to null), otherwise archive (set to date)
      const [data] = await context.db
        .update(cards)
        .set({ archivedAt: currentCard.archivedAt ? null : new Date() })
        .where(eq(cards.id, input.id))
        .returning({
          name: cards.name,
        });

      if (!data) {
        throw errors.NOT_FOUND();
      }
      return { success: true, cardName: data.name };
    } catch (error) {
      console.error("Error in archiveCard:", error);
      if (error instanceof Error && error.message.includes("NOT_FOUND")) {
        throw error;
      }
      throw errors.INTERNAL_SERVER_ERROR({
        message:
          error instanceof Error
            ? `Failed to archive/unarchive card with ID "${input.id}": ${error.message}`
            : "Failed to archive/unarchive card: Unknown error occurred",
      });
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
      console.error("Error in deleteCard:", error);
      if (error instanceof Error && error.message.includes("NOT_FOUND")) {
        throw error;
      }
      throw errors.INTERNAL_SERVER_ERROR({
        message:
          error instanceof Error
            ? `Failed to delete card with ID "${input.id}": ${error.message}`
            : "Failed to delete card: Unknown error occurred",
      });
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
  .input(workspacePreferencesSchema.optional().default({ viewMode: "cards", sortBy: "createdAt", showArchived: false }))
  .output(z.array(z.custom<CardWithPageVisits>()))
  .handler(async ({ context, input }) => {
    const filters = input ?? {};

    const conditions = [isNull(cards.deletedAt)];

    if (filters.showArchived === false) {
      conditions.push(isNull(cards.archivedAt));
    }
    // When showArchived === true, show all cards (no filter needed)

    // For "organization" and "clicks" sorting, we need to use SQL builder
    // because relational query API doesn't support ordering by related columns or aggregates
    if (filters.sortBy === "organization" || filters.sortBy === "clicks") {
      let sortedCardIds: { id: string }[];

      if (filters.sortBy === "organization") {
        sortedCardIds = await context.db
          .select({
            id: cards.id,
          })
          .from(cards)
          .leftJoin(organizationTable, eq(cards.organizationId, organizationTable.id))
          .where(and(...conditions))
          .orderBy(desc(organizationTable.name));
      } else {
        // filters.sortBy === "clicks"
        sortedCardIds = await context.db
          .select({
            id: cards.id,
          })
          .from(cards)
          .leftJoin(pageVisits, eq(cards.id, pageVisits.cardId))
          .where(and(...conditions))
          .groupBy(cards.id)
          .orderBy(desc(count(pageVisits.id)));
      }

      // Fetch full card data with relations using relational query API
      const cardIds = sortedCardIds.map((row) => row.id);
      if (cardIds.length === 0) {
        return [];
      }

      // Fetch only the sorted cards with relations using relational query API
      // We fetch all matching cards and filter in memory to maintain sort order
      // (relational query API doesn't support ordering by the sorted IDs array)
      const allData = await context.db.query.cards.findMany({
        where: and(...conditions),
        with: {
          organization: true,
          pageVisits: {
            columns: {
              referer: true,
            },
          },
        },
      });

      // Maintain the sort order from the SQL query by mapping IDs to cards
      const cardMap = new Map(allData.map((card) => [card.id, card]));
      const sortedCards: CardWithPageVisits[] = [];
      for (const id of cardIds) {
        const card = cardMap.get(id);
        if (card) {
          sortedCards.push(card);
        }
      }
      return sortedCards;
    }

    // For "createdAt" sorting, use relational query API (simpler and works fine)
    const data = await context.db.query.cards.findMany({
      where: and(...conditions),
      orderBy: (cards, { desc }) => [desc(cards.createdAt)],
      with: {
        organization: true,
        emails: true,
        phones: true,
        links: true,
        appearance: true,
        pageVisits: {
          columns: {
            referer: true,
          },
        },
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
  .output(z.custom<Partial<CardType>>().optional())
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
  .output(z.custom<CardType>())
  .handler(async ({ input, context, errors }) => {
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

    if (!data) throw errors.NOT_FOUND();

    return data;
  });

export const getAllCards = publicProcedure
  .use(dbProvider)
  .route({
    method: "GET",
    path: "/card/all",
    summary: "Get all cards",
    description: "Get all cards",
    tags: ["card"],
  })
  .output(z.array(z.custom<Card>()))
  .handler(async ({ context }) => {
    const data = await context.db.query.cards.findMany({
      where: (cards, { isNull, and }) => and(isNull(cards.deletedAt), isNull(cards.archivedAt)),
      with: {
        organization: true,
      },
    });
    return data;
  });

export const countCards = publicProcedure
  .use(dbProvider)
  .route({
    method: "GET",
    path: "/card/count",
    summary: "Count all cards",
    description: "Count all cards",
    tags: ["card"],
  })
  .input(z.object({ showArchived: z.boolean().optional() }))
  .output(z.number())
  .handler(async ({ context, input }) => {
    const filters = input ?? {};

    // Build where conditions
    const conditions = [isNull(cards.deletedAt)];

    if (filters.showArchived === false) {
      conditions.push(isNull(cards.archivedAt));
    }
    // When showArchived === true, show all cards (no filter needed)

    const [data] = await context.db
      .select({ count: count() })
      .from(cards)
      .where(and(...conditions));

    return data?.count ?? 0;
  });

export const exportAllCards = protectedProcedure
  .use(dbProvider)
  .route({
    method: "POST",
    path: "/card/export",
    summary: "Export all cards as CSV",
    description: "Export all cards as CSV with optional date filtering and column selection",
    tags: ["card"],
  })
  .input(exportCardSchema)
  .output(z.string())
  .handler(async ({ input, context }) => {
    // Build where conditions
    const conditions = [isNull(cards.deletedAt)];

    // Apply date filtering
    if (input.dateRange.from) {
      conditions.push(gte(cards.createdAt, input.dateRange.from));
    }
    if (input.dateRange.to) {
      conditions.push(lte(cards.createdAt, input.dateRange.to));
    }

    // Fetch cards with related data
    const data = await context.db.query.cards.findMany({
      where: and(...conditions),
      with: {
        emails: true,
        phones: true,
        links: true,
        appearance: true,
      },
      orderBy: (cards, { desc }) => [desc(cards.createdAt)],
    });

    // Transform data according to selected columns
    const transformedData = data.map((card) => {
      const row: Record<string, string> = {};

      for (const columnId of input.columns) {
        const column = exportColumns.find((col) => col.id === columnId);
        if (!column) continue;

        let value: unknown;

        switch (columnId) {
          case "name":
            value = card.name;
            break;
          case "email":
            // Get primary email or first email
            value = card.emails?.find((e) => e.label === "primary")?.email ?? card.emails?.[0]?.email ?? "";
            break;
          case "phone":
            // Get primary phone or first phone
            value = card.phones?.find((p) => p.label === "primary")?.phone ?? card.phones?.[0]?.phone ?? "";
            break;
          case "address":
            value = card.address ?? "";
            break;
          case "mapUrl":
            value = card.mapUrl ?? "";
            break;
          case "designation":
            value = card.designation ?? "";
            break;
          case "bio":
            value = card.bio ?? "";
            break;
          case "links":
            // Join all links as comma-separated
            value = card.links?.map((link) => `${link.label}: ${link.url}`).join(", ") ?? "";
            break;
          case "image":
            value = card.image ?? "";
            break;
          case "cover":
            value = card.cover ?? "";
            break;
          case "attachmentUrl":
            value = card.attachmentUrl ?? "";
            break;
          case "slug":
            value = card.slug ?? "";
            break;
          case "appearance":
            // Format appearance data
            value = card.appearance
              ? `Template: ${card.appearance.template}, Theme: ${card.appearance.theme}, Dark Mode: ${card.appearance.isDarkMode}`
              : "";
            break;
          default:
            value = "";
        }

        row[column.label] = column.transform(value);
      }

      return row;
    });

    // Convert to CSV
    const csv = convertToCSV(transformedData);

    return csv;
  });
