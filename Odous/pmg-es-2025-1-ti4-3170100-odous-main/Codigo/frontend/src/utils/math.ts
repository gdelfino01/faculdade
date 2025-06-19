export const safeSum = (...values: (number | null | undefined)[]) => {
  if (values.every((item) => typeof item !== "number")) {
    return undefined;
  }

  return values.reduce<number>((acc, item) => acc + (item || 0), 0);
};

export const safeMultiply = (...values: (number | null | undefined)[]) => {
  if (values.some((item) => typeof item !== "number")) {
    return undefined;
  }

  return values.reduce<number>(
    (acc, item) => acc * (typeof item === "number" ? item : 1),
    1
  );
};

export const safeDivide = (
  value1: number | undefined,
  value2: number | undefined
) => {
  if (typeof value1 !== "number" || !value2) {
    return undefined;
  }

  return value1 / value2;
};

export const safeNegative = (value: number | undefined) => {
  return typeof value === "number" ? -value : undefined;
};

export const safeSubtract = (
  value1: number | undefined,
  value2: number | undefined
) => {
  return safeSum(value1, safeNegative(value2));
};

export const safePercent = (
  value1: number | undefined,
  value2: number | undefined
) => {
  return safeMultiply(safeDivide(value1, value2) || 0, 100);
};

export const safeMin = (...values: (number | undefined)[]) => {
  if (values.every((item) => typeof item !== "number")) {
    return undefined;
  }

  return Math.min.apply(
    null,
    values.filter((item) => typeof item === "number") as number[]
  );
};

export const safeMax = (...values: (number | undefined)[]) => {
  if (values.every((item) => typeof item !== "number")) {
    return undefined;
  }

  return Math.max.apply(
    null,
    values.filter((item) => typeof item === "number") as number[]
  );
};