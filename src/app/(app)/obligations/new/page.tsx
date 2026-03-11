import { ObligationForm } from "../../../../modules/obligations";
import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import { root } from "../../itemPage.css";

export default function ObligationCreatePage() {
  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Obligații"
          title="Adaugă obligație"
          description="Creează o obligație reală și salveaz-o în persistența aplicației."
        />

        <ObligationForm />
      </div>
    </ScreenContainer>
  );
}