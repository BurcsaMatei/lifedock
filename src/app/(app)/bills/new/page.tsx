import { BillForm } from "../../../../modules/bills";
import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import { root } from "../../itemPage.css";

export default function BillCreatePage() {
  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Facturi"
          title="Adaugă factură"
          description="Creează o factură reală și salveaz-o în persistența aplicației."
        />

        <BillForm />
      </div>
    </ScreenContainer>
  );
}