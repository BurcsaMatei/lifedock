import Link from "next/link";

import { Button, Input } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { AuthShell } from "../../components/AuthShell";
import { form, linksRow } from "../authScreen.css";

export function ForgotPasswordScreen() {
  return (
    <AuthShell
      title="Recuperează parola"
      description="Introdu emailul contului și îți vom trimite instrucțiunile de resetare."
      footer={
        <div className={linksRow}>
          <Link href={ROUTES.auth.login}>Înapoi la autentificare</Link>
        </div>
      }
    >
      <form className={form}>
        <Input label="Email" name="email" type="email" autoComplete="email" />
        <Button type="submit" fullWidth>
          Trimite link de resetare
        </Button>
      </form>
    </AuthShell>
  );
}