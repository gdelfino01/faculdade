export const formatMoney = (
  value: number | string,
  symbol = "R$",
  locale = "pt-BR",
  options?: Intl.NumberFormatOptions
) => {
  if (!value && value !== 0) return `-`;

  let newSymbol = symbol;

  if (newSymbol.toLocaleUpperCase() === "BRL") {
    newSymbol = "R$";
  }

  if (newSymbol.toLocaleUpperCase() === "USD") {
    newSymbol = "$";
  }

  return `${newSymbol} ${(+value).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  })}`;
};

interface FormatMoneyShortOptions {
  symbol?: string;
  locale?: string;
  withFraction?: boolean;
  lowerCase?: boolean;
}

export const formatMoneyShort = (
  value: number,
  {
    symbol = "R$",
    locale = "pt-BR",
    withFraction = false,
    lowerCase = false,
  }: FormatMoneyShortOptions = {}
) => {
  let sign = "";

  if (value === 0) {
    return `${symbol} 0,00`;
  }

  if (value === null || value === undefined) return `-`;

  if (value < 0) {
    value = Math.abs(value);
    sign = "-";
  }

  if (value < 1000)
    return `${symbol} ${sign}${(+value).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (withFraction) {
    if (value < 1000000)
      return `${symbol} ${sign}${(value / 1000).toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      })}K`;
    if (value < 1000000000)
      return `${symbol} ${sign}${(value / 1000000).toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      })}M`;
    if (value < 1000000000000)
      return `${symbol} ${sign}${(value / 1000000000).toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      })}B`;
    return `${symbol} ${sign}${(value / 1000000000000).toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })}T`;
  }

  if (lowerCase) {
    if (value < 1000000) return `${symbol} ${sign}${Math.round(value / 1000)}k`;
    if (value < 1000000000)
      return `${symbol} ${sign}${Math.round(value / 1000000)}mi`;
    if (value < 1000000000000)
      return `${symbol} ${sign}${Math.round(value / 1000000000)}bi`;
    return `${symbol} ${sign}${Math.round(value / 1000000000000)}tri`;
  }

  if (value < 1000000) return `${symbol} ${sign}${Math.round(value / 1000)}K`;
  if (value < 1000000000)
    return `${symbol} ${sign}${Math.round(value / 1000000)}M`;
  if (value < 1000000000000)
    return `${symbol} ${sign}${Math.round(value / 1000000000)}B`;
  return `${symbol} ${sign}${Math.round(value / 1000000000000)}T`;
};
