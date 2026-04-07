/** Full URL hash path for product pages (respects Vite `base`, e.g. /Phones/). */
export function getProductWindowUrl(productId: number | string): string {
  const base = import.meta.env.BASE_URL
  return `${base}#/product/${productId}`
}
