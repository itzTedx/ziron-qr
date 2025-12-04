import { eq } from "@ziron/db";
import { workspaceTable } from "@ziron/db/schema";
import { updateWorkspacePreferencesSchema, workspacePreferencesSchema } from "@ziron/validators";

import { protectedProcedure } from "..";
import { dbProvider } from "../middleware/db-provider";

const defaultPreferences = {
  viewMode: "cards" as const,
  sortBy: "createdAt" as const,
  showArchived: false,
};

export const getWorkspacePreferences = protectedProcedure
  .use(dbProvider)
  .route({
    method: "GET",
    path: "/workspace/preferences",
    summary: "Get workspace preferences",
    description: "Get the current user's workspace preferences",
    tags: ["workspace"],
  })
  .output(workspacePreferencesSchema)
  .handler(async ({ context }) => {
    const userId = context.session.user.id;

    const workspace = await context.db.query.workspaceTable.findFirst({
      where: (workspace, { eq }) => eq(workspace.id, userId),
    });

    if (!workspace || !workspace.workspacePreferences) {
      return defaultPreferences;
    }

    return workspace.workspacePreferences;
  });

export const updateWorkspacePreferences = protectedProcedure
  .use(dbProvider)
  .route({
    method: "PUT",
    path: "/workspace/preferences",
    summary: "Update workspace preferences",
    description: "Update the current user's workspace preferences",
    tags: ["workspace"],
  })
  .input(updateWorkspacePreferencesSchema)
  .output(workspacePreferencesSchema)
  .handler(async ({ input, context }) => {
    const userId = context.session.user.id;

    // Get existing preferences or use defaults
    const existingWorkspace = await context.db.query.workspaceTable.findFirst({
      where: (workspace, { eq }) => eq(workspace.id, userId),
    });

    const currentPreferences = existingWorkspace?.workspacePreferences ?? defaultPreferences;

    // Merge with new preferences
    const updatedPreferences = {
      ...currentPreferences,
      ...input,
    };

    // Upsert workspace preferences
    if (existingWorkspace) {
      // Update existing workspace
      const [workspace] = await context.db
        .update(workspaceTable)
        .set({
          workspacePreferences: updatedPreferences,
          updatedAt: new Date(),
        })
        .where(eq(workspaceTable.id, userId))
        .returning({
          workspacePreferences: workspaceTable.workspacePreferences,
        });

      if (!workspace || !workspace.workspacePreferences) {
        return defaultPreferences;
      }

      return workspace.workspacePreferences;
    }

    // Create new workspace
    const [workspace] = await context.db
      .insert(workspaceTable)
      .values({
        id: userId,
        workspacePreferences: updatedPreferences,
      })
      .returning({
        workspacePreferences: workspaceTable.workspacePreferences,
      });

    if (!workspace || !workspace.workspacePreferences) {
      return defaultPreferences;
    }

    return workspace.workspacePreferences;
  });
