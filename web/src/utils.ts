import BigNumber from "bignumber.js";

export function formatAsCurrency(amount: BigNumber, decimalPlaces = 2): string {
  const amountAsNumber =
    !amount || amount.isNaN()
      ? 0
      : amount.decimalPlaces(decimalPlaces).toNumber();

  const formatter = new Intl.NumberFormat("en-US", {
    compactDisplay: "short",
    currency: "USD",
    currencyDisplay: "symbol",
    maximumFractionDigits: decimalPlaces,

    minimumFractionDigits: decimalPlaces,
    // only ever use $ / £, not USD$
    signDisplay: "never",
    style: "currency",
  });
  return formatter.format(amountAsNumber);
}

export function formatNumber(
  amount = new BigNumber(0),
  decimalPlaces = 2
): string {
  const amountAsNumber =
    !amount || amount.isNaN()
      ? 0
      : amount.decimalPlaces(decimalPlaces, BigNumber.ROUND_FLOOR).toNumber();

  const formatter = new Intl.NumberFormat("en-US", {
    compactDisplay: "short",
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: decimalPlaces,
    signDisplay: "never",
  });
  return formatter.format(amountAsNumber);
}

export function splitAddress(address: string): string {
  return typeof address === "string"
    ? `${address.slice(0, 4)}...${address.slice(
        address.length - 4,
        address.length
      )}`
    : address;
}


export function formatPct(pct?: BigNumber, sign = false, decimals = 2): string {
  const pctAsNumber =
    !pct || pct.isNaN()
      ? 0
      : pct
          .multipliedBy(100)
          .decimalPlaces(decimals, BigNumber.ROUND_HALF_UP)
          .toNumber();

  const formatter = new Intl.NumberFormat("en-US", {
    compactDisplay: "short",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
    signDisplay: sign ? "exceptZero" : "never",
  });
  return `${formatter.format(pctAsNumber)}%`;
}
