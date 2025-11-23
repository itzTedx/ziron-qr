import { notFound } from "next/navigation";

import { CardForm } from "@/features/card/components/card-form";
import { getCompanies } from "@/features/company/actions/queries";
import { client } from "@/lib/orpc/client";

type Params = Promise<{ id: string }>;

interface Props {
  params: Params;
}

export default async function CardPage({ params }: Props) {
  const { id } = await params;
  const companies = await getCompanies();

  // Fetching the card based on the ID
  const card = await client.card.get({ id });
  if (!card && id !== "new") {
    return notFound();
  }

  const isEditMode = id !== "new";

  return (
    <div>
      <CardForm companies={companies} initialData={card} isEditMode={isEditMode} />
    </div>
  );
}
