import { Route } from "next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ziron/ui/components/breadcrumb";

import { cn } from "@ziron/utils";

import { BackButton } from "./back-button";

interface Props {
  title: string;
  currentPage?: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
  backHref?: Route;
}

export default function Header({ title, currentPage, children, showBackButton = false, backHref }: Props) {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between gap-3 overflow-hidden border-b bg-stone-50 px-6 py-2 backdrop-blur-2xl dark:bg-stone-950">
      <div className="flex items-center gap-3">
        <Breadcrumb>
          <BreadcrumbList
            className={cn(
              "fade-in animate-in",
              showBackButton ? "slide-in-from-left-2 duration-300" : "slide-in-from-right-2 duration-200"
            )}
            key={showBackButton ? "with-back" : "without-back"}
          >
            <BreadcrumbItem className={cn(backHref && "group")}>
              {showBackButton && <BackButton href={backHref} />}
              <BreadcrumbLink className="truncate" href="/">
                {title}
              </BreadcrumbLink>
            </BreadcrumbItem>

            {currentPage && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbPage>{currentPage}</BreadcrumbPage>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex gap-2 sm:gap-3">{children}</div>
    </header>
  );
}
