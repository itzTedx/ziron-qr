"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { SlotPrimitive } from "@ziron/ui/components/button";

import { cn } from "@ziron/utils";

import { authClient } from "@/lib/auth/client";

export const LogoutButton = ({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function logout() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
        },
      });
    });
  }

  const Comp = asChild ? SlotPrimitive.Slot : "button";
  return (
    <Comp
      aria-disabled={isPending}
      className={cn("flex cursor-pointer items-center gap-2", className)}
      data-slot="button"
      disabled={isPending}
      onClick={logout}
      {...props}
    />
  );
};
