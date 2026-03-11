import { Button, Checkbox, Select } from "../../../../shared/components/ui";
import { OnboardingShell } from "../../components/OnboardingShell";
import { actions, checklist, stack } from "../onboardingScreen.css";

const reminderOptions = [
  { label: "30 zile înainte", value: "30d" },
  { label: "7 zile înainte", value: "7d" },
  { label: "1 zi înainte", value: "1d" },
  { label: "În ziua respectivă", value: "0d" }
] as const;

export function NotificationSetupScreen() {
  return (
    <OnboardingShell
      step="Pasul 4 din 5"
      title="Setează reminderele implicite"
      description="Alege cum vrei să fii anunțat pentru lucrurile importante."
    >
      <div className={stack}>
        <Select
          label="Reminder principal"
          options={reminderOptions}
          placeholder="Selectează un reminder"
        />

        <div className={checklist}>
          <Checkbox label="Activează notificările push" />
          <Checkbox label="Primește și un reminder în ziua respectivă" />
        </div>
      </div>

      <div className={actions}>
        <Button>Continuă</Button>
      </div>
    </OnboardingShell>
  );
}