import { EventForm } from "../../../../modules/events";
import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import { root } from "../../itemPage.css";

export default function EventCreatePage() {
  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Evenimente"
          title="Adaugă eveniment"
          description="Creează un eveniment real și salvează-l în persistența aplicației."
        />

        <EventForm />
      </div>
    </ScreenContainer>
  );
}