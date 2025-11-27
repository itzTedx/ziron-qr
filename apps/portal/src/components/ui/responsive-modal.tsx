"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ziron/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@ziron/ui/components/drawer";
import { useIsMobile } from "@ziron/ui/hooks/use-mobile";

import { cn } from "@ziron/utils";

function ResponsiveModal({ ...props }: React.ComponentProps<typeof Dialog>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <Drawer data-slot="responsive-modal" {...props} />;
  }

  return <Dialog data-slot="responsive-modal" {...props} />;
}

function ResponsiveModalTrigger({ ...props }: React.ComponentProps<typeof DialogTrigger>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerTrigger data-slot="responsive-modal-trigger" {...props} />;
  }

  return <DialogTrigger data-slot="responsive-modal-trigger" {...props} />;
}

interface ResponsiveModalContentProps extends React.ComponentProps<typeof DialogContent> {
  showCloseButton?: boolean;
}

function ResponsiveModalContent({
  className,
  children,
  showCloseButton = false,
  ...props
}: ResponsiveModalContentProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerContent className={className} data-slot="responsive-modal-content" {...props}>
        {children}
      </DrawerContent>
    );
  }

  return (
    <DialogContent
      className={cn("p-0", "sm:max-w-3xl", className)}
      data-slot="responsive-modal-content"
      showCloseButton={showCloseButton}
      {...props}
    >
      {children}
    </DialogContent>
  );
}

function ResponsiveModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerHeader className={cn(className)} data-slot="responsive-modal-header" {...props} />;
  }

  return <DialogHeader className={cn("border-b p-6", className)} data-slot="responsive-modal-header" {...props} />;
}

function ResponsiveModalTitle({ className, ...props }: React.ComponentProps<typeof DialogTitle>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerTitle className={cn(className)} data-slot="responsive-modal-title" {...props} />;
  }

  return <DialogTitle className={cn(className)} data-slot="responsive-modal-title" {...props} />;
}

function ResponsiveModalDescription({ className, ...props }: React.ComponentProps<typeof DialogDescription>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerDescription className={cn("sr-only", className)} data-slot="responsive-modal-description" {...props} />
    );
  }

  return <DialogDescription className={cn("sr-only", className)} data-slot="responsive-modal-description" {...props} />;
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
};
