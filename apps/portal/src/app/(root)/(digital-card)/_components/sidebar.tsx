import type { Route } from "next";
import Link from "next/link";

import { IconBuilding } from "@ziron/ui/assets/icons/building";
import { IconCard2 } from "@ziron/ui/assets/icons/card";
import { IconChart } from "@ziron/ui/assets/icons/chart";
import { IconMouse } from "@ziron/ui/assets/icons/mouse";
import { Label } from "@ziron/ui/components/label";

import { SidebarLink } from "./sidebar-link";

export function DigitalCardSidebar() {
  return (
    <aside className="fixed top-0 left-0 z-50 hidden h-dvh w-screen max-md:pointer-events-none md:sticky md:z-auto md:block md:w-full">
      <div className="size-full overflow-hidden py-2 pr-2 transition-opacity duration-300">
        <div className="scrollbar-hide relative flex h-full flex-col overflow-y-auto overflow-x-hidden rounded-xl bg-sidebar/60 backdrop-blur-xl">
          <div className="relative flex grow flex-col p-3 text-muted-foreground">
            <Link className="group mb-2 flex items-center gap-3 px-3 py-2" href="/">
              <span className="font-semibold text-foreground text-lg transition-colors duration-150 group-hover:text-foreground">
                Digital Cards
              </span>
            </Link>

            <div className="flex flex-col gap-8">
              <ul className="space-y-0.5">
                <li>
                  <SidebarLink href={"/"} icon={<IconCard2 className="size-4" />}>
                    Cards
                  </SidebarLink>
                </li>
                <li>
                  <SidebarLink href={"/organization" as Route} icon={<IconBuilding className="size-4" />}>
                    Organizations
                  </SidebarLink>
                </li>
              </ul>

              {/* <div className="flex flex-col gap-0.5">
                <Label className="my-2 px-3 font-light text-muted-foreground">Library</Label>
                <ul className="space-y-0.5">
                  <li>
                    <Link
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground/90 hover:bg-muted"
                      href={"/account/settings" as Route}
                    >
                      <IconTemplate className="size-4" />
                      <span className="text-sm">Templates</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground/90 hover:bg-muted"
                      href={"/account/settings" as Route}
                    >
                      <IconPhoto className="size-4" />
                      <span className="text-sm">Media</span>
                    </Link>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>

          <div className="flex flex-col gap-0.5 p-3 text-muted-foreground">
            <Label className="my-1.5 px-3 font-light text-muted-foreground/60">Resources</Label>
            <ul className="space-y-0.5">
              <li>
                <SidebarLink href={"/analytics"} icon={<IconChart className="size-4" />}>
                  Analytics
                </SidebarLink>
              </li>
              <li>
                <SidebarLink href={"/templates"} icon={<IconMouse className="size-4" />}>
                  Templates
                </SidebarLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
