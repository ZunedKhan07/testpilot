// src/cart.ts
export const calculateTotal = (price: number, Discount: number): number => {
  // BUG: Subtracting discount directly without bounds check
  return price - discount; 
};