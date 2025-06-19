export default function formatAsPercentage(value: unknown) {
  if (value == null || typeof value !== "number" || isNaN(value)) return "-";

  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
