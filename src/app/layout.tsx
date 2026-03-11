import type { ReactNode } from "react";

import { AppProviders } from "./providers/AppProviders";
import { baseMetadata, baseViewport } from "../shared/config/meta";
import { themeClass } from "../shared/theme/theme.css";
import "../shared/theme/theme.global.css";

export const metadata = baseMetadata;
export const viewport = baseViewport;

type RootLayoutProps = {
  readonly children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ro">
      <body className={themeClass}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}