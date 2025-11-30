import Link from "next/link";

import { IconChevronLeft } from "@tabler/icons-react";

import { IconSettings } from "@ziron/ui/assets/icons/settings";
import { IconShield } from "@ziron/ui/assets/icons/shield";
import { Label } from "@ziron/ui/components/label";

import { SidebarLink } from "@/components/layout/sidebar/sidebar-link";

export const SettingsSidebar = () => {
  return (
    <aside className="fixed top-0 left-0 z-50 hidden h-dvh w-screen max-md:pointer-events-none md:sticky md:z-auto md:block md:w-full">
      <div className="size-full overflow-hidden py-2 pr-2 transition-opacity duration-300">
        <div className="scrollbar-hide relative flex h-full flex-col overflow-y-auto overflow-x-hidden rounded-xl bg-sidebar/60 backdrop-blur-xl">
          <div className="relative flex grow flex-col p-3 text-muted-foreground">
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
                <SidebarLink href="/settings/account" icon={<IconSettings className="size-4" />}>
                  General
                </SidebarLink>
              </li>
              <li>
                <SidebarLink href="/settings/security" icon={<IconShield className="size-4" />}>
                  Security
                </SidebarLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};
