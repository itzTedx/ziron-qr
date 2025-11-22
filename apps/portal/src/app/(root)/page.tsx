import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { IconPlus } from "@tabler/icons-react";

import { Button } from "@ziron/ui/components/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@ziron/ui/components/collapsible";
import { cn } from "@ziron/utils";

import { isAdminUser } from "@/features/auth/actions/user";
import { PersonCard } from "@/features/card/components/card-item";
import { getCompanies } from "@/features/company/actions/queries";
import EditCompanyButton from "@/features/company/components/edit-company-button";

export default async function Page() {
  const companies = await getCompanies();
  const isAdmin = await isAdminUser();

  if (!isAdmin) redirect("/login");

  return (
    <section className="mt-20 grid gap-8 px-4 py-6 md:px-12">
      {companies?.map((company) => (
        <Collapsible className="w-full" key={company.id}>
          <div className="flex w-full cursor-pointer items-center justify-between border-b pb-3">
            <CollapsibleTrigger className="flex w-full items-center gap-3">
              {company.logo && (
                <div className="flex size-8 items-center justify-center rounded-sm border bg-white p-1">
                  <Image
                    alt={`${company.name}'s Logo`}
                    className="size-4 object-contain"
                    height={35}
                    src={company.logo}
                    title={`${company.name}'s Logo`}
                    width={35}
                  />
                </div>
              )}
              <h2 className="font-medium capitalize">{company.name}</h2>
            </CollapsibleTrigger>

            <div className="flex gap-2">
              <EditCompanyButton initialData={company} />
              <Button asChild size="icon" variant="outline">
                <Link href={`/card/new?company=${company.id}`}>
                  <IconPlus className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <CollapsibleContent
            className={cn("grid grid-cols-2 gap-4 pt-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5")}
          >
            {company.cards?.length < 0 ? (
              <div className="col-span-full flex w-full flex-col items-center justify-center gap-3 rounded-md border bg-background py-9">
                <Image alt="No Cards Available" height={200} src="/not-available.svg" width={200} />
                <p className="pt-2 font-semibold text-muted-foreground">No Cards Available</p>
                {isAdmin && (
                  <Button asChild className="gap-2">
                    <Link href={`/card/new?company=${company.id}`}>
                      <IconPlus className="size-4" /> Add Card
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <>
                {company.cards?.map((card) => {
                  // const cover = getAbsoluteUrl(
                  //   person.cover,
                  //   process.env.NEXT_PUBLIC_BASE_PATH as string,
                  // );
                  // const placeholderImage = await getPlaceholder(person.image);
                  // const placeholderCover = await getPlaceholder(cover);

                  return <PersonCard card={card} key={card.id} />;
                })}
              </>
            )}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </section>
  );
}
