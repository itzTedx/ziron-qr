import { useEffect, useState } from "react";

import { PaginationState } from "@ziron/ui/components/table";

export function useTablePagination({
  pageSize,
  page,
  onPageChange,
}: {
  pageSize: number;
  page: number;
  onPageChange?: (page: number) => void;
}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize,
  });

  useEffect(() => {
    setPagination((p) => ({
      ...p,
      pageIndex: page,
    }));
  }, [page]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to call onPageChange when pagination changes
  useEffect(() => {
    onPageChange?.(pagination.pageIndex);
  }, [pagination]);

  return { pagination, setPagination };
}
