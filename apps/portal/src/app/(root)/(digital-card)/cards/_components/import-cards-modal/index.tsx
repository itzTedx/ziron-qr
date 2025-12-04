import { useEffect, useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import Papa from "papaparse";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { IconLogoMono } from "@ziron/ui/assets/logo";
import { AnimatedSizeContainer } from "@ziron/ui/components/animated-size-container";
import { Button } from "@ziron/ui/components/button";
import { zodResolver } from "@ziron/ui/components/form";
import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import { ImportCardType, importCardSchema, zCardSchema } from "@ziron/validators";

import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";

import { IconTable } from "@/assets/icons/table";

import { orpc, queryClient } from "@/lib/orpc/client";

import { FieldMapping } from "./field-mapping";
import { SelectFile } from "./select-file";

const pages = ["select-file", "confirm-import"] as const;

export const ImportCardsModal = () => {
  const [isOpen, setIsOpen] = useQueryState("import", parseAsString);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const page = pages[pageNumber];

  const [fileColumns, setFileColumns] = useState<string[] | null>(null);
  const [firstRows, setFirstRows] = useState<Record<string, string>[] | null>(null);

  const form = useForm<ImportCardType>({
    resolver: zodResolver(importCardSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const file = form.watch("file");
  const [isImporting, setIsImporting] = useState(false);

  // Get organizations for default organizationId
  const { data: organizations } = useQuery(orpc.organization.list.queryOptions());
  const defaultOrganizationId = organizations?.[0]?.id;

  // Create card mutation
  const createCardMutation = useMutation(
    orpc.card.create.mutationOptions({
      onError: (error) => {
        toast.error("Failed to create card", { description: error.message });
      },
    })
  );

  // Go to second page if file looks good
  useEffect(() => {
    if (file && fileColumns && pageNumber === 0) {
      setPageNumber(1);
    }
  }, [file, fileColumns, pageNumber]);

  const onSubmit = async (data: ImportCardType) => {
    if (!data.file || !defaultOrganizationId) {
      toast.error("Missing required data");
      return;
    }

    setIsImporting(true);

    try {
      // Parse the full CSV file
      const csvText = await data.file.text();
      const parseResult = Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      if (!parseResult.data || parseResult.data.length === 0) {
        toast.error("CSV file is empty");
        setIsImporting(false);
        return;
      }

      // Transform CSV rows to card data
      const cardsToCreate: zCardSchema[] = [];
      const errors: string[] = [];

      for (let i = 0; i < parseResult.data.length; i++) {
        const row = parseResult.data[i];
        if (!row) continue;

        // Map CSV columns to card fields
        const cardData: Partial<zCardSchema> = {
          organizationId: defaultOrganizationId,
          appearance: {
            template: "default",
            theme: "#4938ff",
            btnColor: "#4938ff",
            isDarkMode: false,
          },
        };

        // Map each field
        if (data.fields?.name && data.fields.name in row && row[data.fields.name]) {
          cardData.name = String(row[data.fields.name]).trim();
        }
        if (data.fields?.email && data.fields.email in row && row[data.fields.email]) {
          const emailValue = String(row[data.fields.email]).trim();
          cardData.emails = [
            {
              email: emailValue,
              label: "Primary",
            },
          ];
        }
        if (data.fields?.phone && data.fields.phone in row && row[data.fields.phone]) {
          const phoneValue = String(row[data.fields.phone]).trim();
          cardData.phones = [
            {
              phone: phoneValue,
              label: "Primary",
            },
          ];
        }
        if (data.fields?.address && data.fields.address in row && row[data.fields.address]) {
          cardData.address = String(row[data.fields.address]).trim() || null;
        }
        if (data.fields?.mapUrl && data.fields.mapUrl in row && row[data.fields.mapUrl]) {
          cardData.mapUrl = String(row[data.fields.mapUrl]).trim() || null;
        }
        if (data.fields?.designation && data.fields.designation in row && row[data.fields.designation]) {
          cardData.designation = String(row[data.fields.designation]).trim() || undefined;
        }
        if (data.fields?.bio && data.fields.bio in row && row[data.fields.bio]) {
          cardData.bio = String(row[data.fields.bio]).trim() || undefined;
        }
        if (data.fields?.image && data.fields.image in row && row[data.fields.image]) {
          cardData.image = String(row[data.fields.image]).trim() || undefined;
        }
        if (data.fields?.cover && data.fields.cover in row && row[data.fields.cover]) {
          cardData.cover = String(row[data.fields.cover]).trim() || undefined;
        }
        if (data.fields?.attachmentUrl && data.fields.attachmentUrl in row && row[data.fields.attachmentUrl]) {
          try {
            const urlValue = String(row[data.fields.attachmentUrl]).trim();
            cardData.attachmentUrl = new URL(urlValue).href || null;
          } catch {
            // Invalid URL, skip
          }
        }
        if (data.fields?.slug && data.fields.slug in row && row[data.fields.slug]) {
          cardData.slug = String(row[data.fields.slug]).trim() || undefined;
        }

        // Parse links if provided (assuming comma-separated or JSON)
        if (data.fields?.links && data.fields.links in row && row[data.fields?.links]) {
          try {
            const linksValue = String(row[data.fields.links]).trim();
            // Try parsing as JSON first
            const parsedLinks = JSON.parse(linksValue) as unknown;
            if (Array.isArray(parsedLinks)) {
              cardData.links = parsedLinks.map(
                (link: { label?: string; url?: string; icon?: string; category?: string }) => ({
                  label: link.label || "Link",
                  url: link.url || "",
                  icon: link.icon || "link",
                  category: link.category,
                })
              );
            }
          } catch {
            // If not JSON, skip links
          }
        }
      }

      if (cardsToCreate.length === 0) {
        toast.error("No valid cards to import");
        setIsImporting(false);
        return;
      }

      // Create cards sequentially to avoid overwhelming the server
      let successCount = 0;
      let failCount = 0;

      for (const cardData of cardsToCreate) {
        try {
          await createCardMutation.mutateAsync(cardData);
          successCount++;
        } catch (error) {
          failCount++;
          console.error("Failed to create card:", error);
        }
      }

      // Show results
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} card${successCount > 1 ? "s" : ""}`);
        queryClient.invalidateQueries({
          queryKey: orpc.card.list.queryKey(),
        });
      }
      if (failCount > 0) {
        toast.error(`Failed to import ${failCount} card${failCount > 1 ? "s" : ""}`);
      }
      if (errors.length > 0) {
        toast.warning(`${errors.length} row${errors.length > 1 ? "s" : ""} had errors`, {
          description: errors.slice(0, 3).join(", "),
        });
      }

      // Close modal and reset
      setIsOpen(null);
      setPageNumber(0);
      form.reset();
      setFileColumns(null);
      setFirstRows(null);
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import cards", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <ResponsiveModal onOpenChange={(open) => setIsOpen(open ? "csv" : null)} open={isOpen === "csv"}>
      <ResponsiveModalContent className="md:max-w-xl">
        <ResponsiveModalHeader className="flex flex-col items-center gap-y-3 py-8 text-center!">
          <div className="flex items-center gap-x-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg border bg-muted">
              <IconTable className="size-5" />
            </div>
            <ArrowRight className="size-4 stroke-1 text-muted-foreground" />
            <IconLogoMono className="size-9" />
          </div>
          <ResponsiveModalTitle>Import Cards From a CSV File</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Easily import your links into Ziron with just a few clicks.
            <br />
            Make sure your CSV file matches the required format.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        <div className="relative">
          {page === "confirm-import" && (
            <div className="-top-5 absolute inset-x-0 mx-4 grid grid-cols-[1fr_min-content_1fr] items-center gap-x-4 gap-y-2 rounded-md border bg-card p-2 text-center font-medium text-muted-foreground text-sm uppercase sm:mx-12">
              <p>CSV data column</p>
              <ArrowRight className="size-4 text-muted-foreground" />
              <p>Ziron data field</p>
            </div>
          )}
          <AnimatedSizeContainer height>
            <div className="flex flex-col gap-y-6 px-4 py-8 text-left sm:px-12">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {page === "select-file" && (
                  <SelectFile
                    file={file}
                    fileColumns={fileColumns}
                    form={form}
                    setFileColumns={setFileColumns}
                    setFirstRows={setFirstRows}
                  />
                )}

                {page === "confirm-import" && (
                  <>
                    <ScrollArea className="scrollbar-hide max-h-[340px] overflow-y-auto">
                      <FieldMapping
                        control={form.control}
                        fileColumns={fileColumns}
                        firstRows={firstRows}
                        setValue={form.setValue}
                        watch={form.watch}
                      />
                      <ScrollBar />
                    </ScrollArea>
                    <Button
                      className="mt-4 w-full"
                      disabled={!form.formState.isValid || isImporting || !defaultOrganizationId}
                      type="submit"
                      variant="inverted"
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        "Confirm import"
                      )}
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setPageNumber(0);
                        form.reset();
                        setFileColumns(null);
                        setFirstRows(null);
                      }}
                      type="button"
                      variant="link"
                    >
                      Choose another file
                    </Button>
                  </>
                )}
              </form>
            </div>
          </AnimatedSizeContainer>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
