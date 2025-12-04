import { CardPageContent, CardPageHeader } from "../_components/card-page-content";

export default function DuplicateCardPage({ params }: PageProps<"/cards/[id]/duplicate">) {
  return (
    <>
      <CardPageHeader params={params} />
      <CardPageContent isDuplicateMode={true} params={params} />
    </>
  );
}
