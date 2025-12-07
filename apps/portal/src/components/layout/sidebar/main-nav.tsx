import { ComponentType, PropsWithChildren, ReactNode, Suspense } from "react";

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
    <div className="min-h-screen max-sm:bg-card md:grid md:grid-cols-[min-content_minmax(0,1fr)]">
      <Suspense>
        <Sidebar toolContent={toolContent} />
      </Suspense>

      <div className="pt-(--page-top-margin) pb-(--page-bottom-margin) [--page-bottom-margin:0px] [--page-top-margin:0px] md:h-screen md:pr-2 md:pb-2 md:[--page-bottom-margin:0.5rem] md:[--page-top-margin:0.5rem]">
        <div className="relative h-full overflow-y-auto bg-container pt-px md:rounded-xl">{children}</div>
      </div>
    </div>
  );
}
