export const PRINTING_COST = 200;
export const BADGE_COST = 100;

export const PRICE_HINTS = {
  vintage: { min: 500, max: 550, label: "Vintage / Retro R500–R550" },
  player_version: {
    min: 650,
    max: 700,
    label: "Latest Season Player Version R650–R700",
  },
  other: { min: 500, max: 700, label: "Typical range R500–R700" },
} as const;

export type PriceBreakdown = {
  kitPrice: number;
  printingCost: number;
  badgeCost: number;
  estimatedTotal: number;
  priceOnRequest: boolean;
};

export function calculateEstimate(input: {
  kitPrice: number;
  printing: boolean;
  badgeCount: number;
  priceOnRequest?: boolean;
}): PriceBreakdown {
  const printingCost = input.printing ? PRINTING_COST : 0;
  const badgeCost = Math.max(0, input.badgeCount) * BADGE_COST;
  const kitPrice = Number(input.kitPrice) || 0;
  return {
    kitPrice,
    printingCost,
    badgeCost,
    estimatedTotal: kitPrice + printingCost + badgeCost,
    priceOnRequest: Boolean(input.priceOnRequest),
  };
}

export const PRICE_DISCLAIMER =
  "Estimated price excludes delivery. Final price and availability will be confirmed before your order is placed.";
