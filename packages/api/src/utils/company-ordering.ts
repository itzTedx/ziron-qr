import type { AnyColumn, SQL, SQLWrapper } from "@ziron/db";
import { Organization } from "@ziron/db/schema";

export const COMPANY_ORDERINGS = ["name_asc", "name_desc", "createdAt_asc", "createdAt_desc"] as const;

type OrderByOperators = {
  sql: unknown;
  asc: (column: SQLWrapper | AnyColumn) => SQL;
  desc: (column: SQLWrapper | AnyColumn) => SQL;
};

export const getOrder = (orderBy?: (typeof COMPANY_ORDERINGS)[number]) => {
  switch (orderBy) {
    case "name_asc":
      return (fields: Organization, { asc }) => asc(fields.name);
    case "name_desc":
      return (fields: Organization, { desc }) => desc(fields.name);
    case "createdAt_asc":
      return (fields: Organization, { asc }) => asc(fields.createdAt);
    case "createdAt_desc":
      return (fields: Organization, { desc }) => desc(fields.createdAt);
  }
};
