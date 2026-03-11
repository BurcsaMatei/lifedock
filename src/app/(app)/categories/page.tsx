import Link from "next/link";

import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../shared/components/layout/ScreenContainer";
import {
  actionLink,
  card,
  cardHeading,
  description,
  list,
  root,
  title
} from "../../../shared/components/layout/listScreen.css";
import { ROUTES } from "../../../shared/config/routes";

const categoryLinks = [
  {
    href: ROUTES.app.documents,
    title: "Documente",
    description: "Acte personale, auto, locuință, studii sau companie."
  },
  {
    href: ROUTES.app.events,
    title: "Evenimente",
    description: "Întâlniri, examene, aniversări și alte date importante."
  },
  {
    href: ROUTES.app.bills,
    title: "Facturi",
    description: "Scadențe, plăți recurente și costuri de urmărit."
  },
  {
    href: ROUTES.app.obligations,
    title: "Obligații",
    description: "Task-uri administrative și termene limită."
  }
] as const;

export default function CategoriesPage() {
  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Categorii"
          title="Zonele principale din LifeDock"
          description="Intră rapid în tipul de element pe care vrei să îl gestionezi."
        />

        <div className={list}>
          {categoryLinks.map((item) => (
            <article key={item.href} className={card}>
              <div className={cardHeading}>
                <h2 className={title}>{item.title}</h2>
                <p className={description}>{item.description}</p>
              </div>

              <div>
                <Link href={item.href} className={actionLink}>
                  Deschide
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ScreenContainer>
  );
}