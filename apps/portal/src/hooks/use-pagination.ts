import { useEffect, useMemo } from "react";

import { parseAsInteger, useQueryState } from "nuqs";

import { DEFAULT_PAGINATION_LIMIT } from "@/lib/constants/pagination";

import { useTablePagination } from "./use-table-pagination";

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export function usePagination(pageSize = DEFAULT_PAGINATION_LIMIT) {
  const [searchParams, setSearchParams] = useQueryState("page", parseAsInteger.withDefault(1));

  const page = useMemo(() => searchParams ?? 1, [searchParams]);

  const { pagination, setPagination } = useTablePagination({
    pageSize,
    page,
    onPageChange: (p) => {
      setSearchParams(p === 1 ? null : p, { scroll: false });
    },
  });

  // Update state when URL parameter changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to update the state when the URL parameter changes
  useEffect(() => {
    const page = searchParams ?? 1;
    setPagination((p) => ({
      ...p,
      pageIndex: page,
    }));
  }, [searchParams]);

  // Update URL parameter when state changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to update the URL parameter when the state changes
  useEffect(() => {
    setSearchParams(pagination.pageIndex === 1 ? null : pagination.pageIndex, { scroll: false });
  }, [pagination]);

  return { pagination, setPagination };
}
