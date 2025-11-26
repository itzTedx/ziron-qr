import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ziron/ui/components/breadcrumb";

interface Props {
  title: string;
  currentPage?: string;
  children?: React.ReactNode;
}

export default async function Header({ title, currentPage, children }: Props) {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between gap-3 border-b bg-card px-4 py-2 sm:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{title}</BreadcrumbLink>
          </BreadcrumbItem>

          {currentPage && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbPage>{currentPage}</BreadcrumbPage>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex gap-2 sm:gap-3">{children}</div>
    </header>
  );
}
