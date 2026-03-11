import Link from "next/link";

import { EmptyState } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { AuthShell } from "../../components/AuthShell";

export function VerifyEmailScreen() {
  return (
    <AuthShell
      title="Verifică adresa de email"
      description="Am trimis un mesaj de confirmare. După verificare, poți continua în aplicație."
    >
      <EmptyState
        title="Verificare în așteptare"
        description="Deschide emailul primit și confirmă adresa pentru a activa contul."
        action={<Link href={ROUTES.auth.login}>Am verificat emailul</Link>}
      />
    </AuthShell>
  );
}