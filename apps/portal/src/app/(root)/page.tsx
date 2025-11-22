import { redirect } from "next/navigation";

import { isAdminUser } from "@/features/auth/actions/user";
import { CompaniesList } from "@/features/company/components/companies-list";
import { getQueryClient, HydrateClient } from "@/lib/orpc/query/hydration";

export default async function Page() {
  const queryClient = getQueryClient();
  const isAdmin = await isAdminUser();

  if (!isAdmin) redirect("/unauthorized");

  return (
    <section className="mt-20 w-full px-4 py-6 md:px-12">
      <HydrateClient client={queryClient}>
        <CompaniesList />
      </HydrateClient>
    </section>
  );
}
