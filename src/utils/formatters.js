export function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
}

export function titleCase(value = "") {
  return value.replace(/\b\w/g, c => c.toUpperCase());
}