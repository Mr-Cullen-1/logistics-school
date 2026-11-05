import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "default" | "small";
};

const variants = {
  primary: "border-gold bg-gold text-charcoal hover:bg-[#E2BF90]",
  secondary: "border-bronze bg-transparent text-ivory hover:bg-bronze/10",
  tertiary: "border-muted bg-transparent text-ivory hover:bg-white/5",
  danger: "border-alert bg-transparent text-alert hover:bg-alert/10 focus-visible:outline-alert",
};

export function Button({
  variant = "primary",
  size = "default",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-[8px] border font-semibold transition duration-150 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${size === "small" ? "min-h-9 px-3 text-sm" : "min-h-11 px-5 text-sm"} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
