// tests/cart.spec.ts
import { test, expect } from "@playwright/test";
import { calculateTotal } from "../src/cart";

test("calculateTotal should not allow price below zero", () => {
  const result = calculateTotal(10, 15); // $10 item, $15 discount
  expect(result).toBeGreaterThanOrEqual(0); // Should fail because result is -5
});