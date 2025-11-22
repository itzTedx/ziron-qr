import { createCompany, listCompanies } from "./company";

export const router = {
  company: {
    create: createCompany,
    list: listCompanies,
  },
};
