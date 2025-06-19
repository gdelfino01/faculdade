import dayjs from "dayjs";

export function getDateRange(
  period: string,
  customStart?: string,
  customEnd?: string
) {
  const today = dayjs();
  switch (period) {
    case "Últimos 7 dias":
      return {
        startDate: today.subtract(6, "day").format("YYYY-MM-DD"),
        endDate: today.format("YYYY-MM-DD"),
      };
    case "Últimos 30 dias":
      return {
        startDate: today.subtract(29, "day").format("YYYY-MM-DD"),
        endDate: today.format("YYYY-MM-DD"),
      };
    case "Mês atual":
      return {
        startDate: today.startOf("month").format("YYYY-MM-DD"),
        endDate: today.endOf("month").format("YYYY-MM-DD"),
      };
    case "Personalizado":
      return {
        startDate: customStart || "",
        endDate: customEnd || "",
      };
    default:
      return { startDate: "", endDate: "" };
  }
}