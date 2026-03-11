import Link from "next/link";

import { Button, Checkbox, Input } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { AuthShell } from "../../components/AuthShell";
import { form, linksRow } from "../authScreen.css";

export function LoginScreen() {
  return (
    <AuthShell
      title="Autentificare"
      description="Intră în LifeDock și continuă să îți gestionezi documentele, evenimentele și obligațiile."
      footer={
        <div className={linksRow}>
          <Link href={ROUTES.auth.forgotPassword}>Ai uitat parola?</Link>
          <Link href={ROUTES.auth.signup}>Creează cont</Link>
        </div>
      }
    >
      <form className={form}>
        <Input label="Email" name="email" type="email" autoComplete="email" />
        <Input
          label="Parolă"
          name="password"
          type="password"
          autoComplete="current-password"
        />
        <Checkbox
          label="Ține-mă autentificat"
          hint="Păstrează sesiunea activă pe acest dispozitiv."
          name="rememberMe"
        />
        <Button type="submit" fullWidth>
          Intră în cont
        </Button>
      </form>
    </AuthShell>
  );
}