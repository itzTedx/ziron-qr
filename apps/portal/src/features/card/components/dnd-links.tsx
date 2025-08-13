"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { IconGripVertical, IconPlus, IconTrash } from "@tabler/icons-react";
import { Reorder } from "framer-motion";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@ziron/ui/components/button";
import { Card } from "@ziron/ui/components/card";
import { DialogClose } from "@ziron/ui/components/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@ziron/ui/components/form";
import { Input } from "@ziron/ui/components/input";
import { cn } from "@ziron/utils";
import { zCardSchema } from "@ziron/validators";

import { LINKS } from "../data/constants";
import { Link } from "../types";

interface LinkItemProps {
  data: {
    category: string;
    label: string;
    url: string;
    icon: string;
    id?: string;
  };
  index: number;
  loading: boolean;
  onRemove: (index: number) => void;
  form: ReturnType<typeof useFormContext<zCardSchema>>;
}

// Memoized Link Item Component
const LinkItem = ({ data, index, loading, onRemove, form }: LinkItemProps) => {
  const isGeneral = data.category === "General";

  return (
    <Card className="flex flex-row items-center justify-between gap-2 px-3 py-2">
      {isGeneral ? (
        <div className="grid w-full gap-4 md:grid-cols-5">
          <FormField
            control={form.control}
            name={`links.${index}.label`}
            render={({ field }) => (
              <FormItem className="flex gap-2 md:col-span-2 md:gap-3">
                <Image
                  src={data.icon}
                  height={40}
                  width={40}
                  alt=""
                  className="flex-shrink-0"
                />
                <FormControl>
                  <Input
                    className="space-y-0"
                    {...field}
                    disabled={loading}
                    placeholder={`${data.label} Title`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            key={data.id}
            name={`links.${index}.url`}
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    placeholder={`${data.label} Url`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : (
        <div className="flex flex-1 gap-2 md:gap-3">
          <Image src={data.icon} height={40} width={40} alt="" />
          <FormField
            control={form.control}
            key={data.id}
            name={`links.${index}.url`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    placeholder={`${data.label} url`}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        className="text-destructive hover:text-destructive shrink-0"
        size="icon"
        onClick={() => onRemove(index)}
      >
        <IconTrash size={16} />
      </Button>
      <button
        type="button"
        title="Drag to Re-Order"
        className="hover:text-foreground text-gray-400 hover:bg-transparent"
        onClick={(e) => e.preventDefault()}
      >
        <IconGripVertical size={16} />
      </button>
    </Card>
  );
};
LinkItem.displayName = "LinkItem";

// Memoized Suggestion Card
interface SuggestionCardProps {
  link: { label: string; url: string; icon: string; id?: number };
  item: { label: string };
  onAppend: (data: {
    category: string;
    label: string;
    url: string;
    icon: string;
  }) => void;
}

const SuggestionCard = ({ link, item, onAppend }: SuggestionCardProps) => (
  <Card
    onClick={() =>
      onAppend({
        category: item.label,
        label: link.label,
        url: link.url,
        icon: link.icon,
      })
    }
    className="hover:border-primary hover:bg-muted/20 flex size-28 cursor-pointer flex-col items-center gap-2 transition-colors"
    role="button"
  >
    <Image src={link.icon} height={40} width={40} alt="" />
    <p className="text-sm font-medium whitespace-nowrap">{link.label}</p>
  </Card>
);

SuggestionCard.displayName = "SuggestionCard";

export const DndLinks = () => {
  const form = useFormContext<zCardSchema>();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false); // Add modal open state
  const dragRef = useRef<HTMLDivElement>(null);

  const { fields, append, remove, move } = useFieldArray({
    name: "links",
    control: form.control,
  });

  // Memoize callbacks
  const handleAppend = useCallback(
    (data: { category: string; label: string; url: string; icon: string }) => {
      append(data);
    },
    [append],
  );

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  const handleReorder = useCallback(
    (e: typeof fields) => {
      const activeEl = fields[active];
      e.forEach((item, index) => {
        if (item === activeEl) {
          move(active, index);
          setActive(index);
        }
      });
    },
    [active, fields, move],
  );

  // Memoize suggestions data
  const suggestionLinks = useMemo(
    () =>
      LINKS.map((item) =>
        item.links.slice(0, 4).map((link) => ({
          ...link,
          itemLabel: item.label,
        })),
      ).flat(),
    [],
  );

  const handleLinkAdd = (link: Link, category: string) => {
    append({
      id: link.id.toString(),
      label: link.label,
      url: link.url,
      icon: link.icon,
      category: category,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-8 pt-3" ref={dragRef}>
        <Reorder.Group
          as="div"
          className="w-full space-y-4"
          values={fields}
          onReorder={handleReorder}
        >
          {fields.map((data, index) => (
            <Reorder.Item
              as="div"
              id={data.id}
              dragConstraints={dragRef}
              onDragStart={() => setActive(index)}
              value={data}
              key={data.id}
            >
              <LinkItem
                data={{
                  category: data.category || "",
                  label: data.label || "",
                  url: data.url || "",
                  icon: data.icon || "",
                  id: data.id,
                }}
                index={index}
                loading={false}
                onRemove={handleRemove}
                form={form}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
      <ResponsiveModal
        title={"Add Link"}
        className="min-w-2xl"
        asChild
        isOpen={open} // Use isOpen instead of open
        closeModal={setOpen} // Use closeModal instead of setOpen
        trigger={
          <Button type="button" variant="outline" size="lg" className="w-full">
            <IconPlus size={16} className="mr-2" /> Add
          </Button>
        }
      >
        <div className="p-6 pt-0 pb-6">
          {LINKS.map((item, i) => (
            <div key={i} className="py-3">
              <h4 className="text-muted-foreground pb-2 text-sm">
                {item.label}
              </h4>

              <div
                className={cn(
                  "grid gap-x-6",
                  item.links.length > 1 ? "grid-cols-2" : "grid-cols-1",
                )}
              >
                {item.links.map((link, i) => (
                  <div
                    className="flex items-center justify-between border-b py-3"
                    key={`addLink-${i}-${link.label}`}
                  >
                    <div className="flex items-center gap-4 font-medium">
                      <div className="relative size-8">
                        <Image src={link.icon} fill alt="" sizes="10vw" />
                      </div>

                      <p>{link.label}</p>
                    </div>
                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        onClick={() => handleLinkAdd(link, item.label)}
                        className="text-primary h-8 gap-2 px-2 font-semibold"
                      >
                        <IconPlus className="size-3 stroke-[2.5]" />
                        Add
                      </Button>
                    </DialogClose>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ResponsiveModal>

      <section>
        <div className="flex items-center justify-between">
          <h3>Suggestions</h3>
          <Button
            variant="link"
            type="button"
            onClick={useCallback(() => {
              setOpen(true);
            }, [setOpen])}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
          {suggestionLinks.map((link) => (
            <SuggestionCard
              key={link.id}
              link={{ ...link, id: link.id }}
              item={{ label: link.itemLabel }}
              onAppend={handleAppend}
            />
          ))}
          <Card
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            className="text-muted-foreground hover:border-primary hover:bg-muted/20 flex flex-col items-center justify-center text-sm font-medium transition-colors"
            role="button"
          >
            View More
          </Card>
        </div>
      </section>
    </>
  );
};
