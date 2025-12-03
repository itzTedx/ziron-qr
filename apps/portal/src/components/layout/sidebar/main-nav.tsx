"use client";

import {
  ComponentType,
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { usePathname } from "next/navigation";

import { useMediaQuery } from "@ziron/ui/hooks";

import { cn } from "@ziron/utils";

type SideNavContext = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const SideNavContext = createContext<SideNavContext>({
  isOpen: false,
  setIsOpen: () => {},
});

export function MainNav({
  children,
  sidebar: Sidebar,
  toolContent,
  newsContent,
}: PropsWithChildren<{
  sidebar: ComponentType<{
    toolContent?: ReactNode;
    newsContent?: ReactNode;
  }>;
  toolContent?: ReactNode;
  newsContent?: ReactNode;
}>) {
  const _pathname = usePathname();

  const { isMobile } = useMediaQuery();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when side nav is open
  useEffect(() => {
    document.body.style.overflow = isOpen && isMobile ? "hidden" : "auto";
  }, [isOpen, isMobile]);

  // Close side nav when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[min-content_minmax(0,1fr)]">
      {/* Side nav backdrop */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-dvh w-screen transition-[background-color,backdrop-filter] md:sticky md:z-auto md:w-full md:bg-transparent",
          isOpen ? "bg-black/20 backdrop-blur-sm" : "bg-transparent max-md:pointer-events-none"
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.stopPropagation();
            setIsOpen(false);
          }
        }}
      >
        {/* Side nav */}
        <div
          className={cn(
            "relative h-full w-min max-w-full transition-transform md:translate-x-0",
            !isOpen && "-translate-x-full"
          )}
        >
          <Sidebar newsContent={newsContent} toolContent={toolContent} />
        </div>
      </div>
      <div className="pt-(--page-top-margin) pb-(--page-bottom-margin) [--page-bottom-margin:0px] [--page-top-margin:0px] md:h-screen md:pr-2 md:pb-2 md:[--page-bottom-margin:0.5rem] md:[--page-top-margin:0.5rem]">
        <div className="relative h-full overflow-y-auto bg-container pt-px md:rounded-xl">
          <SideNavContext.Provider value={{ isOpen, setIsOpen }}>{children}</SideNavContext.Provider>
        </div>
      </div>
    </div>
  );
}
