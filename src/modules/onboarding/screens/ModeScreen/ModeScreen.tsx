import { Button } from "../../../../shared/components/ui";
import { OnboardingShell } from "../../components/OnboardingShell";
import {
  cardGrid,
  optionCard,
  optionDescription,
  optionTitle
} from "../onboardingScreen.css";

export function ModeScreen() {
  return (
    <OnboardingShell
      step="Pasul 1 din 5"
      title="Alege primul tău spațiu"
      description="Poți începe cu Personal, Student sau Companie. Vei putea adăuga altele mai târziu."
    >
      <div className={cardGrid}>
        <section className={optionCard}>
          <h2 className={optionTitle}>Personal</h2>
          <p className={optionDescription}>
            Pentru acte, facturi, evenimente și obligații personale.
          </p>
          <Button>Alege Personal</Button>
        </section>

        <section className={optionCard}>
          <h2 className={optionTitle}>Student</h2>
          <p className={optionDescription}>
            Pentru examene, proiecte, documente și plăți legate de studii.
          </p>
          <Button variant="secondary">Alege Student</Button>
        </section>

        <section className={optionCard}>
          <h2 className={optionTitle}>Companie</h2>
          <p className={optionDescription}>
            Pentru facturi, documente, scadențe și obligații administrative.
          </p>
          <Button variant="secondary">Alege Companie</Button>
        </section>
      </div>
    </OnboardingShell>
  );
}