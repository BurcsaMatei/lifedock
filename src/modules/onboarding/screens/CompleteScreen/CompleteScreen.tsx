import Link from "next/link";

import { EmptyState } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { OnboardingShell } from "../../components/OnboardingShell";

export function CompleteScreen() {
  return (
    <OnboardingShell
      step="Pasul 5 din 5"
      title="Totul este pregătit"
      description="Contul tău LifeDock este gata. Poți intra în aplicație și începe să adaugi primele elemente."
    >
      <EmptyState
        title="Setup finalizat"
        description="Primul spațiu este configurat și poți continua în dashboard."
        action={<Link href={ROUTES.app.home}>Intră în aplicație</Link>}
      />
    </OnboardingShell>
  );
}