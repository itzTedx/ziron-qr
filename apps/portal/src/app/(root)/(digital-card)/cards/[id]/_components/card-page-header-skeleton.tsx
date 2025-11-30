import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";
import { Skeleton } from "@ziron/ui/components/skeleton";

export function CardPageContentSkeleton() {
  return (
    <section className="h-full flex-1">
      <ScrollArea className="h-full flex-1 overflow-y-auto">
        <div>
          {/* Cover Image Skeleton */}
          <div className="h-48 bg-secondary">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Profile Dashboard Skeleton */}
          <section className="-mt-16 container mx-auto">
            <div className="relative grid grid-cols-10 rounded-xl border-background bg-card px-6 py-4 shadow-muted/30 backdrop-blur-xl sm:border sm:shadow-lg md:grid-cols-12 md:divide-x">
              <div className="col-span-10 flex items-center md:col-span-4 md:px-3 lg:pr-6">
                <Skeleton className="size-24 shrink-0 rounded-full" />
                <div className="w-full space-y-2 max-md:mt-3 md:ml-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="col-span-10 mt-4 space-y-3 md:col-span-8 md:mt-0 md:px-3 lg:pl-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </section>

          {/* Form Content Skeleton */}
          <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 pb-6">
            {/* Form Section (2 columns) */}
            <div className="col-span-2 space-y-6">
              {/* Tabs Skeleton */}
              <div className="flex gap-2 border-b">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>

              {/* Form Fields Skeleton */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section (1 column) */}
            <div className="col-span-1">
              <Skeleton className="h-[600px] w-full rounded-lg" />
            </div>
          </div>
        </div>
        <ScrollBar />
      </ScrollArea>
    </section>
  );
}
