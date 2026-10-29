export function passwordProblem(password: string, phone: string, currentPin?: string): string | null {
  if (password.length < 8) return "Parol kamida 8 belgidan iborat bo'lishi kerak";
  if (password === phone || password === phone.replace(/\D/g, "")) return "Parol telefon raqamiga teng bo'lmasligi kerak";
  if (currentPin && password === currentPin) return "Parol PINga teng bo'lmasligi kerak";
  return null;
}
