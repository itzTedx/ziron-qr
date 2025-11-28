import { Route } from "next";

import Header from "@/components/layout/header";
import { CreateButton } from "@/components/ui/create-button";

import { EmptyOrganization } from "@/features/organization/components/empty-organization";

export default function OrganizationsPage() {
  return (
    <>
      <Header title="Organizations">
        <CreateButton href={"/organization/new" as Route} label="Create Organization" />
      </Header>
      <section className="px-6 pt-12">
        <EmptyOrganization />
      </section>
    </>
  );
}
