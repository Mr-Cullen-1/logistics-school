import type { ComponentPropsWithoutRef } from "react";

export function Table({ children, className = "", ...props }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="overflow-x-auto rounded-cl-md border border-bronze/20">
      <table className={`w-full min-w-[520px] border-collapse text-left text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead(props: ComponentPropsWithoutRef<"thead">) {
  return <thead className="bg-charcoal text-xs font-semibold uppercase tracking-[0.12em] text-steel" {...props} />;
}

export function TableBody(props: ComponentPropsWithoutRef<"tbody">) {
  return <tbody className="divide-y divide-white/10" {...props} />;
}

export function TableRow(props: ComponentPropsWithoutRef<"tr">) {
  return <tr className="transition-colors hover:bg-white/[0.03]" {...props} />;
}

export function TableHeaderCell(props: ComponentPropsWithoutRef<"th">) {
  return <th scope="col" className="px-4 py-3 font-semibold" {...props} />;
}

export function TableCell(props: ComponentPropsWithoutRef<"td">) {
  return <td className="px-4 py-4 text-ivory" {...props} />;
}
