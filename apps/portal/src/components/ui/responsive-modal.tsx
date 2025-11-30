"use client";

import * as React from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ziron/ui/components/dialog";
import {
  Drawer,
  DrawerClose,
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
      <DrawerContent className={className} {...props}>
        {children}
      </DrawerContent>
    );
  }

  return (
    <DialogContent className={cn("p-0", "sm:max-w-3xl", className)} showCloseButton={showCloseButton} {...props}>
      {children}
    </DialogContent>
  );
}

function ResponsiveModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerHeader className={cn(className)} {...props} />;
  }

  return <DialogHeader className={cn("border-b p-6", className)} {...props} />;
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
    return <DrawerDescription className={cn("sr-only", className)} {...props} />;
  }

  return <DialogDescription className={cn("sr-only", className)} {...props} />;
}

function ResponsiveModalClose({ ...props }: React.ComponentProps<typeof DialogClose>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerClose {...props} />;
  }

  return <DialogClose {...props} />;
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
};
