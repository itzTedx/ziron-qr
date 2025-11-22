import { SidebarTrigger } from "@ziron/ui/components/sidebar";

import { getCurrentUser } from "@/features/auth/actions/user";

import { AddAction } from "../ui/add-actions";
import { ThemeToggle } from "../ui/theme-toggle";
import HeaderTitle from "./header-title";

export default async function Header() {
  const session = await getCurrentUser();
  const isAdmin = session.user.role === "admin";

  return (
    <header className="sticky top-0 z-50 flex h-12 w-full items-center justify-between gap-3 border-b bg-background/80 px-2 py-2 backdrop-blur-lg sm:px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />

        <HeaderTitle />
      </div>
      <div className="flex gap-2 sm:gap-3">
        {/* <Search data={companies!} /> */}
        <ThemeToggle />
        {isAdmin && <AddAction />}
      </div>
    </header>
  );
}
