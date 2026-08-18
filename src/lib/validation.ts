export function isVietnamPhone(phone: string) {
  const normalized = phone.replace(/[\s.-]/g, "");
  return /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(normalized) || /^(0|\+84)2\d{8,9}$/.test(normalized);
}

export function cleanText(value: unknown, max = 500) {
  return String(value || "").trim().slice(0, max);
}
