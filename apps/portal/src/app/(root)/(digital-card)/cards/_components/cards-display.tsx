"use client";

import { useCallback, useMemo } from "react";

import { IconLayoutList, IconTable } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
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

import { selectedSortAtom, showArchivedAtom, viewModeAtom } from "@/features/card/cards-atoms";
import { orpc } from "@/lib/orpc/client";

import { CardSort } from "./card-sort";

const CARDS_DISPLAY_OPTIONS = [
	{ id: "cards", label: "Cards", icon: IconLayoutList },
	{ id: "rows", label: "Rows", icon: IconTable },
] as const;

export const CardsDisplay = ({ preferences }: { preferences: WorkspacePreferences }) => {
	const queryClient = useQueryClient();

	useHydrateAtoms([
		[viewModeAtom, preferences.viewMode],
		[showArchivedAtom, preferences.showArchived],
		[selectedSortAtom, preferences.sortBy],
	] as const);

	const [viewMode, setViewMode] = useAtom(viewModeAtom);
	const [showArchived, setShowArchived] = useAtom(showArchivedAtom);
	const [selectedSort, setSelectedSort] = useAtom(selectedSortAtom);

	// Store original preferences for reset functionality
	const originalPreferences = useMemo<WorkspacePreferences>(
		() => ({
			viewMode: preferences.viewMode,
			showArchived: preferences.showArchived,
			sortBy: preferences.sortBy,
		}),
		[preferences.viewMode, preferences.showArchived, preferences.sortBy]
	);

	// Mutation to persist preferences
	const updatePreferences = useMutation(
		orpc.workspace.updatePreferences.mutationOptions({
			onSuccess: (updatedPreferences) => {
				toast.success("Display preferences saved");
				// Update the query cache directly instead of invalidating to prevent refetch loop
				queryClient.setQueryData(orpc.workspace.getPreferences.queryOptions().queryKey, updatedPreferences);
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
					<Button className="w-full flex-1">
						<span className="relative">
							{isDirty && (
								<span className="-top-1 -right-1 absolute size-2 rounded-full bg-brand-secondary">
									<span className="-translate-1/2 absolute top-1/2 left-1/2 size-3 animate-pulse rounded-full bg-brand-secondary/50" />
								</span>
							)}
							<IconLayoutGrid />
						</span>
						Display
					</Button>
				</AnimateIcon>
			</PopoverTrigger>

			<PopoverContent className="bg-popover md:w-80">
				<div className="p-2">
					<div className="grid grid-cols-2 gap-2 rounded-md bg-muted/50 p-1">
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
									<Icon
										className={cn("size-5 text-muted-foreground", selected && "text-foreground")}
									/>
									{label}
								</button>
							);
						})}
					</div>
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
