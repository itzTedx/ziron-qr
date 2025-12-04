import { ComponentType, PropsWithChildren, ReactNode, Suspense } from "react";

import { cn } from "@ziron/utils";

export function MainNav({
  children,
  sidebar: Sidebar,
  toolContent,
}: PropsWithChildren<{
  sidebar: ComponentType<{
    toolContent?: ReactNode;
  }>;
  toolContent?: ReactNode;
}>) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[min-content_minmax(0,1fr)]">
      {/* Side nav backdrop */}
      <div
        className={cn(
          "fixed top-0 left-0 z-99 h-dvh w-screen transition-[background-color,backdrop-filter] md:sticky md:z-auto md:w-full md:bg-transparent"
        )}
      >
        {/* Side nav */}
        <div className={cn("relative h-full w-min max-w-full bg-background transition-transform md:translate-x-0")}>
          <Suspense>
            <Sidebar toolContent={toolContent} />
          </Suspense>
        </div>
      </div>
      <div className="pt-(--page-top-margin) pb-(--page-bottom-margin) [--page-bottom-margin:0px] [--page-top-margin:0px] md:h-screen md:pr-2 md:pb-2 md:[--page-bottom-margin:0.5rem] md:[--page-top-margin:0.5rem]">
        <div className="relative h-full overflow-y-auto bg-container pt-px md:rounded-xl">{children}</div>
      </div>
    </div>
  );
}
