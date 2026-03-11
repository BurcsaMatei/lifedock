import Link from "next/link";

import { ScreenContainer } from "../shared/components/layout/ScreenContainer";
import { ROUTES } from "../shared/config/routes";

export default function LandingPage() {
  return (
    <ScreenContainer as="main">
      <h1>LifeDock</h1>
      <p>
        Hub simplu pentru documente, evenimente, facturi și obligații, în spații
        separate.
      </p>

      <ul>
        <li>
          <Link href={ROUTES.auth.signup}>Creează cont</Link>
        </li>
        <li>
          <Link href={ROUTES.auth.login}>Autentificare</Link>
        </li>
        <li>
          <Link href={ROUTES.app.home}>Intră în app shell</Link>
        </li>
      </ul>
    </ScreenContainer>
  );
}