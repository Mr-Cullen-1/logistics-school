import { useId, type ComponentPropsWithRef } from "react";

type InputProps = ComponentPropsWithRef<"input"> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Input({
  label,
  hint,
  error,
  id,
  className = "",
  "aria-describedby": describedBy,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-semibold text-ivory">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={[describedBy, hint || error ? messageId : undefined].filter(Boolean).join(" ") || undefined}
        className={`h-11 w-full rounded-cl-sm border bg-charcoal px-3.5 text-base text-ivory outline-none transition placeholder:text-muted focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-alert" : "border-muted/60"} ${className}`}
        {...props}
      />
      {(error || hint) && (
        <p id={messageId} className={`text-sm ${error ? "text-alert" : "text-steel"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
