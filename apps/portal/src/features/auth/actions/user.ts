import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { eq } from "@ziron/db";
import { db } from "@ziron/db/client";
import { users } from "@ziron/db/schema";

import { auth } from "@/lib/auth/server";

export const getSession = async () => {
  "use cache";
  return auth.api.getSession({ headers: await headers() });
};

export const getCurrentUser = async () => {
  "use cache";

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    redirect("/login");
  }

  return {
    session: session.session,
    user,
  };
};

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An unknown error occurred.",
    };
  }
};

export const signUp = async (email: string, password: string, username: string) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: username,
      },
    });

    return {
      success: true,
      message: "Signed up successfully.",
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An unknown error occurred.",
    };
  }
};

/**
 * Checks if the current user has the 'admin' role.
 * @param requestHeaders - Optional headers to use for authentication. If not provided, will fetch headers.
 * @returns True if the user is an admin, false otherwise.
 */
export async function isAdminUser(): Promise<boolean> {
  const { user } = await getCurrentUser();
  return user.role === "admin" || user.role === "dev";
}
