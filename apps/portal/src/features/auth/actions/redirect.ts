"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/server";

export async function redirectUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If user is already logged in, redirect based on role
  if (session?.user) {
    const isAdmin = session.user.role === "admin" || session.user.role === "dev";
    if (isAdmin) {
      redirect("/");
    } else {
      redirect("/unauthorized");
    }
  }
}
