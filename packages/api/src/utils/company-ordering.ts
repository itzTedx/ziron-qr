import type { AnyColumn, SQL, SQLWrapper } from "@ziron/db";
import { companies } from "@ziron/db/schema";

export const COMPANY_ORDERINGS = ["name_asc", "name_desc", "createdAt_asc", "createdAt_desc"] as const;

type CompanyFields = {
  id: typeof companies.id;
  name: typeof companies.name;
  slug: typeof companies.slug;
  phone: typeof companies.phone;
  website: typeof companies.website;
  email: typeof companies.email;
  address: typeof companies.address;
  logo: typeof companies.logo;
  createdAt: typeof companies.createdAt;
  updatedAt: typeof companies.updatedAt;
  deletedAt: typeof companies.deletedAt;
};

type OrderByOperators = {
  sql: unknown;
  asc: (column: SQLWrapper | AnyColumn) => SQL;
  desc: (column: SQLWrapper | AnyColumn) => SQL;
};

export const getOrder = (orderBy: (typeof COMPANY_ORDERINGS)[number]) => {
  switch (orderBy) {
    case "name_asc":
      return (fields: CompanyFields, { asc }: OrderByOperators) => asc(fields.name);
    case "name_desc":
      return (fields: CompanyFields, { desc }: OrderByOperators) => desc(fields.name);
    case "createdAt_asc":
      return (fields: CompanyFields, { asc }: OrderByOperators) => asc(fields.createdAt);
    case "createdAt_desc":
      return (fields: CompanyFields, { desc }: OrderByOperators) => desc(fields.createdAt);
  }
};
