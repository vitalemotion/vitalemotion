export const SHIPPING_COST_COP = 10000;

export function calculateShippingCost(hasPhysicalItems: boolean) {
  return hasPhysicalItems ? SHIPPING_COST_COP : 0;
}

export function formatCOP(value: number) {
  return `$${Math.round(value).toLocaleString("es-CO")}`;
}
