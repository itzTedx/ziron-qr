import { OrganizationWithCardsCount } from "@ziron/db/schema";

import { OrganizationCard } from "./organization-card";

export const OrganizationsList = ({ organizations }: { organizations: OrganizationWithCardsCount[] }) => {
  return (
    <div className="grid gap-4">
      {organizations.map((organization) => (
        <OrganizationCard key={organization.id} organization={organization} />
      ))}
    </div>
  );
};
