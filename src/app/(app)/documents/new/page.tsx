import { DocumentForm } from "../../../../modules/documents";
import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import { root } from "../../itemPage.css";

export default function DocumentCreatePage() {
  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Documente"
          title="Adaugă document"
          description="Creează un document real și salvează-l în persistența aplicației."
        />

        <DocumentForm />
      </div>
    </ScreenContainer>
  );
}