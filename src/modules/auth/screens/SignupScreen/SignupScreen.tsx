import Link from "next/link";

import { Button, Checkbox, Input } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { AuthShell } from "../../components/AuthShell";
import { form, linksRow } from "../authScreen.css";

export function SignupScreen() {
  return (
    <AuthShell
      title="Creează cont"
      description="Începe cu un cont nou și configurează primul tău spațiu în LifeDock."
      footer={
        <div className={linksRow}>
          <Link href={ROUTES.auth.login}>Ai deja cont?</Link>
        </div>
      }
    >
      <form className={form}>
        <Input label="Nume complet" name="fullName" autoComplete="name" />
        <Input label="Email" name="email" type="email" autoComplete="email" />
        <Input
          label="Parolă"
          name="password"
          type="password"
          autoComplete="new-password"
        />
        <Checkbox
          label="Sunt de acord cu termenii și politica de confidențialitate"
          name="termsAccepted"
        />
        <Button type="submit" fullWidth>
          Creează cont
        </Button>
      </form>
    </AuthShell>
  );
}