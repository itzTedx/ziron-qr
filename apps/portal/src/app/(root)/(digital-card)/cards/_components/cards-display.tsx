import { useCallback, useMemo } from "react";

import { IconChevronDown, IconLayoutList, IconTable } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { Button } from "@ziron/ui/components/button";
import { Kbd } from "@ziron/ui/components/kbd";
import { Popover, PopoverContent, PopoverTrigger } from "@ziron/ui/components/popover";
import { Separator } from "@ziron/ui/components/separator";
import { useKeyboardShortcut } from "@ziron/ui/hooks";

import { cn } from "@ziron/utils/dist/cn";
import { WorkspacePreferences } from "@ziron/validators";

import { AnimateIcon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";

import { BoxArchive, IconArrowsUpDown, IconLayoutGrid } from "@/assets/icons";

import { orpc } from "@/lib/orpc/client";
import { getQueryClient } from "@/lib/orpc/query/hydration";

import { CardSort } from "./card-sort";
import { selectedSortAtom, showArchivedAtom, viewModeAtom } from "./cards-atoms";

const CARDS_DISPLAY_OPTIONS = [
  { id: "cards", label: "Cards", icon: IconLayoutList },
  { id: "rows", label: "Rows", icon: IconTable },
] as const;

export const CardsDisplay = () => {
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [showArchived, setShowArchived] = useAtom(showArchivedAtom);
  const [selectedSort, setSelectedSort] = useAtom(selectedSortAtom);
  const { data: preferences } = useQuery(orpc.workspace.getPreferences.queryOptions());

  const queryClient = getQueryClient();

  // Store original preferences for reset functionality
  const originalPreferences = useMemo<WorkspacePreferences>(
    () => ({
      viewMode: preferences?.viewMode ?? "cards",
      showArchived: preferences?.showArchived ?? false,
      sortBy: preferences?.sortBy ?? "createdAt",
    }),
    [preferences?.viewMode, preferences?.showArchived, preferences?.sortBy]
  );

  // Mutation to persist preferences
  const updatePreferences = useMutation(
    orpc.workspace.updatePreferences.mutationOptions({
      onSuccess: () => {
        toast.success("Display preferences saved");
        queryClient.invalidateQueries(orpc.workspace.getPreferences.queryOptions());
      },
      onError: (error) => {
        toast.error("Failed to save preferences", { description: error.message });
      },
    })
  );

  const reset = useCallback(() => {
    setViewMode(originalPreferences.viewMode);
    setShowArchived(originalPreferences.showArchived);
    setSelectedSort(originalPreferences.sortBy);
  }, [originalPreferences, setSelectedSort, setShowArchived, setViewMode]);

  const persist = useCallback(() => {
    updatePreferences.mutate({
      viewMode,
      showArchived,
      sortBy: selectedSort,
    });
  }, [viewMode, showArchived, selectedSort, updatePreferences]);

  const isDirty = useMemo(() => {
    if (viewMode !== preferences?.viewMode) return true;
    if (selectedSort !== preferences?.sortBy) return true;
    if (showArchived !== preferences?.showArchived) return true;

    return false;
  }, [viewMode, selectedSort, showArchived, preferences]);

  useKeyboardShortcut("a", () => setShowArchived(!showArchived));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <AnimateIcon animateOnHover asChild>
          <Button className="w-full flex-1 bg-inherit" size="lg" variant="outline">
            <IconLayoutGrid /> Display <IconChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </AnimateIcon>
      </PopoverTrigger>

      <PopoverContent className="bg-popover md:w-80">
        <div className="grid grid-cols-2 gap-2 rounded-md bg-popover p-2">
          {CARDS_DISPLAY_OPTIONS.map(({ id, label, icon: Icon }) => {
            const selected = viewMode === id;
            return (
              <button
                aria-pressed={selected}
                className={cn(
                  "flex h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-transparent transition-colors",
                  selected
                    ? "border-muted bg-muted/50 text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                key={id}
                onClick={() => setViewMode(id)}
              >
                <Icon className={cn("size-5 text-muted-foreground", selected && "text-foreground")} />
                {label}
              </button>
            );
          })}
        </div>
        <Separator />
        <div className="flex h-16 items-center justify-between gap-2 px-4">
          <span className="flex items-center gap-2">
            <IconArrowsUpDown className="size-4 stroke-1.5" />
            Ordering
          </span>
          <div>
            <CardSort selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
          </div>
        </div>
        <Separator />

        <div className="group flex h-16 items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-2">
            <div className="flex w-6 items-center justify-center">
              <BoxArchive className="size-4 text-neutral-800 group-hover:hidden" />
              <Kbd className="sm:hidden sm:group-hover:inline-flex">A</Kbd>
            </div>
            Show archived links
          </div>

          <Switch checked={showArchived} onCheckedChange={setShowArchived} />
        </div>
        <AnimatePresence initial={false}>
          {isDirty && (
            <>
              <Separator />
              <motion.div
                animate={{ height: "auto" }}
                className="overflow-hidden"
                exit={{ height: 0 }}
                initial={{ height: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center justify-end gap-2 p-2">
                  <Button className="h-8 w-auto px-2" onClick={reset} variant="outline">
                    Reset to default
                  </Button>
                  <Button className="h-8 w-auto px-2" onClick={persist} variant="inverted">
                    Set as default
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
};
