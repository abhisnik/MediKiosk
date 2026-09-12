export const required = value => Boolean(String(value ?? "").trim());

export function isValidPhone(phone) {
  return /^[0-9+()\-\s]{8,20}$/.test(phone.trim());
}