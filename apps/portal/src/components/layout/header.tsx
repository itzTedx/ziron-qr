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
import { PageWidthWrapper } from "./page-width-wrapper";
import { SidebarTrigger } from "./sidebar/sidebar-trigger";

interface Props {
	title: string;
	currentPage?: string;
	children?: React.ReactNode;
	showBackButton?: boolean;
	backHref?: Route;
}

export default function Header({ title, currentPage, children, showBackButton = false, backHref }: Props) {
	return (
		<header className="sticky top-0 z-50 h-14 w-full overflow-hidden border-b py-2">
			<PageWidthWrapper className="flex items-center justify-between gap-3">
				<div className="flex grow items-center gap-2">
					<SidebarTrigger className="sm:hidden" />
					<Breadcrumb className="w-full">
						<BreadcrumbList
							className={cn(
								showBackButton
									? "slide-in-from-left-2 fade-in animate-in duration-300"
									: "slide-in-from-right-2 animate-in duration-200"
							)}
						>
							{currentPage ? (
								<>
									<BreadcrumbItem className={cn(backHref && "group")}>
										{showBackButton && <BackButton href={backHref} />}
										<BreadcrumbLink href="/">{title}</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbPage>{currentPage}</BreadcrumbPage>
									</BreadcrumbItem>
								</>
							) : (
								<BreadcrumbItem className={cn(backHref && "group")}>
									{showBackButton && <BackButton href={backHref} />}
									<BreadcrumbPage>{title}</BreadcrumbPage>
								</BreadcrumbItem>
							)}
						</BreadcrumbList>
					</Breadcrumb>
				</div>
				<div className="flex shrink-0 flex-wrap gap-2 sm:gap-3">{children}</div>
			</PageWidthWrapper>
		</header>
	);
}
