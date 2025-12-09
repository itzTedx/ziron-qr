import { PropsWithChildren } from "react";

import { Button } from "@ziron/ui/components/button";
import { Skeleton } from "@ziron/ui/components/skeleton";
import { PaginationState } from "@ziron/ui/components/table";

import { cn } from "@ziron/utils";

export function PaginationControls({
	pagination,
	setPagination,
	totalCount,
	unit = (p) => `item${p ? "s" : ""}`,
	className,
	children,
	showTotalCount = true,
}: PropsWithChildren<{
	pagination: PaginationState;
	setPagination: (pagination: PaginationState) => void;
	totalCount?: number;
	unit?: string | ((plural: boolean) => string);
	className?: string;
	showTotalCount?: boolean;
}>) {
	return (
		<div
			className={cn("flex items-center justify-between gap-2 text-faded-foreground text-sm leading-6", className)}
		>
			<div className="flex items-center gap-2">
				<div>
					{totalCount === undefined ? (
						<Skeleton className="h-5 w-24" />
					) : (
						<>
							<span className="hidden sm:inline-block">Viewing</span>{" "}
							{totalCount > 0 && (
								<>
									<span className="font-medium">
										{((pagination.pageIndex - 1) * pagination.pageSize + 1).toLocaleString()}-
										{Math.min(
											(pagination.pageIndex - 1) * pagination.pageSize + pagination.pageSize,
											totalCount
										).toLocaleString()}
									</span>{" "}
									{showTotalCount && "of "}
								</>
							)}
							{showTotalCount && <span className="font-medium">{totalCount.toLocaleString()}</span>}{" "}
							{typeof unit === "function" ? unit(totalCount !== 1) : unit}
						</>
					)}
				</div>
				{children}
			</div>
			<div className="flex items-center gap-2">
				<Button
					className="bg-faded"
					disabled={pagination.pageIndex === 1}
					onClick={() =>
						setPagination({
							...pagination,
							pageIndex: pagination.pageIndex - 1,
						})
					}
					size="sm"
					type="button"
					variant="outline"
				>
					Previous
				</Button>
				<Button
					className="bg-faded"
					disabled={
						!totalCount ||
						(pagination.pageIndex - 1) * pagination.pageSize + pagination.pageSize >= totalCount
					}
					onClick={() =>
						setPagination({
							...pagination,
							pageIndex: pagination.pageIndex + 1,
						})
					}
					size="sm"
					type="button"
					variant="outline"
				>
					Next
				</Button>
			</div>
		</div>
	);
}
