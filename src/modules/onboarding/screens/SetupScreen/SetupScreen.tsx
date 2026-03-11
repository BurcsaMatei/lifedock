import { Button, Checkbox } from "../../../../shared/components/ui";
import { OnboardingShell } from "../../components/OnboardingShell";
import { actions, checklist } from "../onboardingScreen.css";

export function SetupScreen() {
  return (
    <OnboardingShell
      step="Pasul 2 din 5"
      title="Ce vrei să organizezi?"
      description="Alege categoriile care contează pentru tine și pornești mai repede."
    >
      <div className={checklist}>
        <Checkbox label="Documente personale" />
        <Checkbox label="Mașină" />
        <Checkbox label="Facturi și abonamente" />
        <Checkbox label="Evenimente importante" />
        <Checkbox label="Obligații recurente" />
      </div>

      <div className={actions}>
        <Button>Continuă</Button>
      </div>
    </OnboardingShell>
  );
}