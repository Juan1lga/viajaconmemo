export const sanitizeNumber = (num) => (num || "").replace(/\D/g, "");
export const buildWhatsAppUrl = (num, message) => {
  const clean = sanitizeNumber(num);
  const text = encodeURIComponent(message || "Hola, me interesa más información.");
  return `https://wa.me/${clean}?text=${text}`;
};
export const openWhatsApp = (num, message, target = "_blank") => {
  const url = buildWhatsAppUrl(num, message);
  window.open(url, target);
};