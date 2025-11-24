"use client";

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

interface Props {
  children: React.ReactNode;
  isOpen?: boolean;
  asChild?: boolean;
  trigger?: React.ReactNode;
  closeModal?: (value: boolean) => void;
  title: string;
  description?: string;
  className?: string;
}

export const ResponsiveModal = ({
  children,
  className,
  isOpen,
  closeModal,
  trigger,
  asChild,
  title,
  description,
}: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer onOpenChange={closeModal} open={isOpen}>
        {trigger && <DrawerTrigger asChild={asChild}>{trigger}</DrawerTrigger>}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription className="sr-only">{title}</DrawerDescription>}
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog onOpenChange={closeModal} open={isOpen}>
      {trigger && <DialogTrigger asChild={asChild}>{trigger}</DialogTrigger>}
      <DialogContent className={cn("p-0", "sm:max-w-3xl", className)}>
        <DialogHeader className="border-b p-6">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription className="sr-only">{title}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
