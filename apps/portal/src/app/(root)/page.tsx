import Image from "next/image";
import Link from "next/link";

import { isAdminUser } from "@/features/auth/actions/user";
import { getCompanies } from "@/features/company/actions/queries";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@ziron/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ziron/ui/components/collapsible";
import { cn } from "@ziron/utils";

export default async function Page() {
  const companies = await getCompanies();
  const isAdmin = await isAdminUser();
  console.log(companies);
  return (
    <section className="mt-20 grid gap-8 px-4 py-6 md:px-12">
      {companies?.map((company, i) => (
        <Collapsible key={company.id} className="w-full">
          {/* Company Header */}
          <div className="flex w-full cursor-pointer items-center justify-between border-b pb-3">
            <CollapsibleTrigger asChild>
              <div className="flex w-full items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full border bg-white p-1">
                  <Image
                    src={company.logo!}
                    alt={`${company.name}'s Logo`}
                    title={`${company.name}'s Logo`}
                    height={35}
                    width={35}
                    className="size-4 object-contain"
                  />
                </div>
                <h2 className="font-medium capitalize">{company.name}</h2>
              </div>
            </CollapsibleTrigger>
            {isAdmin && (
              <div className="flex gap-2">
                {/* <EditCompanyButton initialData={company} /> */}
                <Button size="icon" variant="outline" asChild>
                  <Link href={`/card/new?company=${company.id}`}>
                    <IconPlus className="size-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Company Content */}
          <CollapsibleContent
            className={cn(
              "grid grid-cols-2 gap-4 pt-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
            )}
          >
            {/* {!company.persons.length ? (
              <div className="bg-background col-span-full flex w-full flex-col items-center justify-center gap-3 rounded-md border py-9">
                <Image
                  src="/not-available.svg"
                  height={200}
                  width={200}
                  alt="No Cards Available"
                />
                <p className="text-muted-foreground pt-2 font-semibold">
                  No Cards Available
                </p>
                {isAdmin && (
                  <Button className="gap-2" asChild>
                    <Link href={`/card/new?company=${company.id}`}>
                      <IconPlus className="size-4" /> Add Card
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <>
                {company.persons.map(async (person) => {
                  const cover = getAbsoluteUrl(
                    person.cover,
                    process.env.NEXT_PUBLIC_BASE_PATH as string,
                  );
                  const placeholderImage = await getPlaceholder(person.image);
                  const placeholderCover = await getPlaceholder(cover);

                  return (
                    <PersonCard
                      key={person.id}
                      person={{ ...person, company }}
                      placeholderImage={placeholderImage}
                      placeholderCover={placeholderCover}
                      isAdmin={isAdmin}
                    />
                  );
                })}
              </>
            )} */}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </section>
  );
}
