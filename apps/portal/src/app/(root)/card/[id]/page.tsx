import { getCardById } from "@/features/card/actions/queries";
import { CardForm } from "@/features/card/components/card-form";
import { getCompanies } from "@/features/company/actions/queries";

type Params = Promise<{ id: string }>;

interface Props {
  params: Params;
}

export default async function CardPage({ params }: Props) {
  const { id } = await params;
  const companies = await getCompanies();

  // Fetching the card based on the ID
  const card = await getCardById(id);

  if (!companies) return null;

  const isEditMode = id !== "new";

  return (
    <div>
      <CardForm companies={companies} initialData={card} isEditMode={isEditMode} />
    </div>
  );
}
