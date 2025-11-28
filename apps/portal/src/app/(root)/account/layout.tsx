import type { Route } from "next";
import Link from "next/link";

import { IconChevronLeft } from "@tabler/icons-react";

import { IconSettings } from "@ziron/ui/assets/icons/settings";
import { IconShield } from "@ziron/ui/assets/icons/shield";
import { Label } from "@ziron/ui/components/label";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <aside className="sticky top-4 m-3 ml-0 h-full flex-1 rounded-lg bg-sidebar p-3">
        <Link className="group mb-2 flex items-center gap-3 px-3 py-2" href="/">
          <div className="group-hover:-translate-x-0.5 flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground transition-[transform_background-color_color] duration-150 group-hover:bg-muted-foreground/20 group-hover:text-foreground">
            <IconChevronLeft className="size-3" />
          </div>
          <span className="font-semibold text-foreground/80 text-lg transition-colors duration-150 group-hover:text-foreground">
            Settings
          </span>
        </Link>

        <Label className="mb-2 px-3 font-light text-muted-foreground">Account</Label>

        <ul className="space-y-0.5">
          <li>
            <Link
              className="flex items-center gap-2 rounded-lg bg-brand-secondary/10 px-3 py-2 text-brand-secondary hover:bg-muted hover:text-muted-foreground"
              href={"/account/settings" as Route}
            >
              <IconSettings className="size-4" />
              <span className="text-sm">General</span>
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground/90 hover:bg-muted hover:text-muted-foreground"
              href={"/account/settings" as Route}
            >
              <IconShield className="size-4" />
              <span className="text-sm">Security</span>
            </Link>
          </li>
        </ul>
      </aside>

      <div className="h-screen md:pt-2 md:pr-2 md:pb-2">
        <main className="h-full overflow-hidden bg-stone-50/80 sm:rounded-xl dark:bg-stone-950">{children}</main>
      </div>
    </>
  );
}
