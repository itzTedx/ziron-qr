import { Route } from "next";

import Header from "@/components/layout/header";
import { CreateButton } from "@/components/ui/create-button";

export default function OrganizationsPage() {
  return (
    <>
      <Header title="Organizations">
        <CreateButton href={"/organization/new" as Route} label="Create Organization" />
      </Header>
      <section className="container">hello</section>
    </>
  );
}
