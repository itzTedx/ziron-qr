import { OrganizationWithCards } from "@ziron/db/schema";

export const OrganizationsList = ({ organizations }: { organizations: OrganizationWithCards[] }) => {
  return (
    <div>
      {organizations.map((organization) => (
        <div key={organization.id}>{organization.name}</div>
      ))}
    </div>
  );
};
