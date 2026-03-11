import { helper, label, root, value } from "./StatCard.css";

type StatCardProps = {
  readonly label: string;
  readonly value: string;
  readonly helper?: string;
};

export function StatCard({
  helper: helperText,
  label: labelText,
  value: valueText
}: StatCardProps) {
  return (
    <section className={root}>
      <p className={label}>{labelText}</p>
      <p className={value}>{valueText}</p>
      {helperText ? <p className={helper}>{helperText}</p> : null}
    </section>
  );
}