import { CardForm } from "@/features/card/components/card-form";
import { getCompanies } from "@/features/company/actions/queries";

type Params = Promise<{ id: string }>;

export default async function CardPage({ params }: { params: Params }) {
  const { id } = await params;
  const companies = await getCompanies();

  // Fetching the card based on the ID
  // const { card } = await getCardById(params.id);

  if (!companies) return null;

  const isEditMode = id !== "new";

  return (
    <div>
      <CardForm
        companies={companies}
        isEditMode={isEditMode}
        // initialData={card}
        // id={id}
      />
    </div>
  );
}
