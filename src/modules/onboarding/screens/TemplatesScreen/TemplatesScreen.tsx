import { Button, Checkbox } from "../../../../shared/components/ui";
import { OnboardingShell } from "../../components/OnboardingShell";
import { actions, checklist } from "../onboardingScreen.css";

export function TemplatesScreen() {
  return (
    <OnboardingShell
      step="Pasul 3 din 5"
      title="Alege câteva template-uri rapide"
      description="Acestea vor precompleta primele item-uri utile din contul tău."
    >
      <div className={checklist}>
        <Checkbox label="Carte de identitate" />
        <Checkbox label="Permis auto" />
        <Checkbox label="RCA" />
        <Checkbox label="Factură internet" />
        <Checkbox label="Zi de naștere" />
      </div>

      <div className={actions}>
        <Button>Continuă</Button>
      </div>
    </OnboardingShell>
  );
}