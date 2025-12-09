"use client";

import * as React from "react";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@ziron/ui/components/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@ziron/ui/components/drawer";
import { ScrollArea } from "@ziron/ui/components/scroll-area";
import { useIsMobile } from "@ziron/ui/hooks";

import { cn } from "@ziron/utils";

function ResponsiveModal({ ...props }: React.ComponentProps<typeof Dialog>) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return <Drawer {...props} />;
	}

	return <Dialog {...props} />;
}

function ResponsiveModalTrigger({ ...props }: React.ComponentProps<typeof DialogTrigger>) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return <DrawerTrigger {...props} />;
	}

	return <DialogTrigger {...props} />;
}

interface ResponsiveModalContentProps extends React.ComponentProps<typeof DialogContent> {
	showCloseButton?: boolean;
	title?: string;
	description?: string;
}

function ResponsiveModalContent({
	className,
	children,
	showCloseButton = false,
	title,
	description,

	...props
}: ResponsiveModalContentProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<DrawerContent className={cn("flex flex-col overflow-hidden", className)} {...props}>
				{title && (
					<DrawerHeader className="border-b bg-card p-4 text-start!">
						<DrawerTitle>{title}</DrawerTitle>
						<DrawerDescription className="sr-only">{description ?? "This is a modal"}</DrawerDescription>
					</DrawerHeader>
				)}
				<ScrollArea className="flex-1 overflow-y-auto rounded-[inherit]">{children}</ScrollArea>
			</DrawerContent>
		);
	}

	return (
		<DialogContent
			className={cn("gap-0 p-0", "sm:max-w-3xl", className)}
			showCloseButton={showCloseButton}
			{...props}
		>
			{title && (
				<DialogHeader className="border-b p-6">
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription className="sr-only">{description ?? "This is a modal"}</DialogDescription>
				</DialogHeader>
			)}
			<ScrollArea className="overflow-y-auto rounded-[inherit]">{children}</ScrollArea>
		</DialogContent>
	);
}

function ResponsiveModalHeader({ className, ...props }: React.ComponentProps<"div">) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<DrawerHeader
				className={cn("rounded-t-[inherit] border-b bg-card p-4 text-start!", className)}
				{...props}
			/>
		);
	}

	return <DialogHeader className={cn("rounded-t-[inherit] border-b p-6", className)} {...props} />;
}

function ResponsiveModalTitle({ className, ...props }: React.ComponentProps<typeof DialogTitle>) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return <DrawerTitle className={cn(className)} {...props} />;
	}

	return <DialogTitle className={cn(className)} {...props} />;
}

function ResponsiveModalDescription({ className, ...props }: React.ComponentProps<typeof DialogDescription>) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return <DrawerDescription className={cn("text-muted-foreground text-sm", className)} {...props} />;
	}

	return <DialogDescription className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function ResponsiveModalClose({ ...props }: React.ComponentProps<typeof DialogClose>) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return <DrawerClose {...props} />;
	}

	return <DialogClose {...props} />;
}

function ResponsiveModalFooter({ className, ...props }: React.ComponentProps<"div">) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return <DrawerFooter className={cn("sticky bottom-0 mt-auto border-t", className)} {...props} />;
	}

	return <DialogFooter className={cn("rounded-b-[inherit] border-t px-6 py-4", className)} {...props} />;
}
// Backward-compatible wrapper component (maintains old API)
interface ResponsiveModalWrapperProps {
	children: React.ReactNode;
	isOpen?: boolean;
	asChild?: boolean;
	trigger?: React.ReactNode;
	onOpenChange?: (value: boolean) => void;
	title: string;
	description?: string;
	className?: string;
	showCloseButton?: boolean;
}

function ResponsiveModalWrapper({
	children,
	className,
	isOpen,
	onOpenChange,
	trigger,
	asChild,
	title,
	description,
	showCloseButton = false,
}: ResponsiveModalWrapperProps) {
	return (
		<ResponsiveModalRoot onOpenChange={onOpenChange} open={isOpen}>
			{trigger && <ResponsiveModalTrigger asChild={asChild}>{trigger}</ResponsiveModalTrigger>}
			<ResponsiveModalContent className={className} showCloseButton={showCloseButton}>
				<ResponsiveModalHeader>
					<ResponsiveModalTitle>{title}</ResponsiveModalTitle>
					{description && <ResponsiveModalDescription>{description}</ResponsiveModalDescription>}
				</ResponsiveModalHeader>
				{children}
			</ResponsiveModalContent>
		</ResponsiveModalRoot>
	);
}

// Rename the root component to avoid naming conflict
const ResponsiveModalRoot = ResponsiveModal;

// Export the wrapper as the default ResponsiveModal for backward compatibility
// and export individual components for the new component-based API
export {
	ResponsiveModal,
	ResponsiveModalWrapper as ResponsiveModalLegacy,
	ResponsiveModalTrigger,
	ResponsiveModalContent,
	ResponsiveModalHeader,
	ResponsiveModalTitle,
	ResponsiveModalDescription,
	ResponsiveModalClose,
	ResponsiveModalFooter,
};
