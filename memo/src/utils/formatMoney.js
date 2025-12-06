export const formatMoney = (amount, currency = "USD") => {
  if (amount === undefined || amount === null || amount === "") return "";
  const num = Number(amount);
  if (Number.isNaN(num)) return String(amount);
  const cur = (typeof currency === "string" ? currency.trim().toUpperCase() : "USD");
  const locale = cur === "MXN" ? "es-MX" : "en-US";
  try {
    const opts = { style: "currency", currency: cur, maximumFractionDigits: 2, currencyDisplay: cur === "MXN" ? "code" : "symbol" };
    return new Intl.NumberFormat(locale, opts).format(num);
  } catch (_) {
    if (cur === "MXN") {
      return `${cur} ${num.toFixed(2)}`;
    }
    return `$${num.toFixed(2)}`;
  }
};

export const bestPrice = (pkg) => {
  if (!pkg) return { amount: undefined, currency: "USD" };
  const currency = pkg.currency === "MXN" ? "MXN" : "USD";
  const amount = (pkg.priceDouble != null && pkg.priceDouble !== "") ? pkg.priceDouble : ((pkg.price != null && pkg.price !== "") ? pkg.price : pkg.priceChild);
  return { amount, currency };
};