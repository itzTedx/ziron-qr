import { redirect } from "next/navigation";

import { Button } from "@ziron/ui/components/button";

import Header from "@/components/layout/header";

import { isAdminUser } from "@/features/auth/actions/user";
import { CompaniesList } from "@/features/company/components/companies-list";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

export default async function Page() {
  const queryClient = getQueryClient();
  const isAdmin = await isAdminUser();

  if (!isAdmin) redirect("/unauthorized");

  return (
    <>
      <Header title="Cards">
        <Button>Create Card</Button>
      </Header>
      <section className="container">
        <HydrateClient client={queryClient}>
          <CompaniesList />
        </HydrateClient>
      </section>
    </>
  );
}
