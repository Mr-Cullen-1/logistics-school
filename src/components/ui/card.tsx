import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  description?: string;
};

export function Card({ title, description, children, className = "", ...props }: CardProps) {
  return (
    <section
      className={`min-w-0 rounded-cl-lg border border-bronze/20 bg-dark-slate p-6 shadow-panel ${className}`}
      {...props}
    >
      {title && <h2 className="text-xl font-semibold text-ivory">{title}</h2>}
      {description && <p className="mt-1 text-sm leading-6 text-steel">{description}</p>}
      {children && <div className={title || description ? "mt-5" : ""}>{children}</div>}
    </section>
  );
}
