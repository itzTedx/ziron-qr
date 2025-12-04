import { useState } from "react";

import { IconDotsVertical } from "@tabler/icons-react";
import { Download } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import { Button } from "@ziron/ui/components/button";
import { ButtonGroup } from "@ziron/ui/components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@ziron/ui/components/dropdown-menu";

import { IconTable } from "@/assets/icons/table";

import { ExportCardModal } from "./export-cards-modal";
import { ImportCardsModal } from "./import-cards-modal";

export const MoreCardOptions = () => {
  const [openExport, setOpenExport] = useState(false);
  const [_, setIsOpenImport] = useQueryState("import", parseAsString);
  return (
    <>
      <ButtonGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-lg" variant="outline">
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Import Cards</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <button onClick={() => setIsOpenImport("csv")}>
                  <IconTable className="size-4" /> Import from CSV
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Export Cards</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <button onClick={() => setOpenExport(true)}>
                  <Download className="size-4" /> Export as CSV
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <ExportCardModal open={openExport} setOpen={setOpenExport} />
      <ImportCardsModal />
    </>
  );
};
