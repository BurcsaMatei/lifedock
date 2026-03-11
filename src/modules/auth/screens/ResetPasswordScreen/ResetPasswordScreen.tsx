import Link from "next/link";

import { Button, Input } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { AuthShell } from "../../components/AuthShell";
import { form, linksRow } from "../authScreen.css";

export function ResetPasswordScreen() {
  return (
    <AuthShell
      title="Setează o parolă nouă"
      description="Alege o parolă nouă pentru contul tău LifeDock."
      footer={
        <div className={linksRow}>
          <Link href={ROUTES.auth.login}>Înapoi la autentificare</Link>
        </div>
      }
    >
      <form className={form}>
        <Input
          label="Parolă nouă"
          name="newPassword"
          type="password"
          autoComplete="new-password"
        />
        <Input
          label="Confirmă parola"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
        />
        <Button type="submit" fullWidth>
          Salvează parola
        </Button>
      </form>
    </AuthShell>
  );
}