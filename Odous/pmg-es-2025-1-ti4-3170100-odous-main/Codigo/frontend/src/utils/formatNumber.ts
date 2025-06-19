export const formatNumber = (
  value?: number,
  {
    precision,
    prefix = "",
    unity = "",
  }: { precision?: number; prefix?: string; unity?: string } = {}
) => {
  if (typeof value !== "number") {
    return "-";
  }

  const options: Intl.NumberFormatOptions = {};

  if (typeof precision === "number") {
    options.minimumFractionDigits = 0;
    options.maximumFractionDigits = precision;
  }

  return (
    (prefix ? prefix + " " : "") +
    value.toLocaleString("pt-BR", options) +
    unity
  );
};

export const deformatNumber = (input: string): number | undefined => {
  let cleanedInput = input.replace(/[^\d,]/g, ''); // Remove all non-numeric characters except ","

  cleanedInput = cleanedInput.replace(/,/g, '.'); // Replace all "," with "."
  if (cleanedInput === "") return undefined;

  const numberValue = Number(cleanedInput);

  if ((numberValue !== 0 && !numberValue) || isNaN(numberValue)) return undefined;

  return numberValue;
}