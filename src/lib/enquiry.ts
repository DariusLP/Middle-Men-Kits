import { BADGE_COST, PRINTING_COST, calculateEstimate } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import type { CustomKitRequest, KitCustomisation, Product } from "@/lib/types";

export function getWhatsAppNumber() {
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "27836911431").replace(
    /\D/g,
    "",
  );
}

export function getInstagramUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "";
  // Prefer the live handle even if an older Vercel env value is still set.
  if (fromEnv.includes("middlemenkits")) return fromEnv;
  return "https://www.instagram.com/middlemenkits";
}

export function whatsappLink(message: string) {
  const phone = getWhatsAppNumber();
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildProductEnquiryMessage(input: {
  product: Pick<
    Product,
    | "name"
    | "club"
    | "country"
    | "season"
    | "kit_type"
    | "base_price"
    | "price_on_request"
    | "slug"
  >;
  customisation: KitCustomisation;
  siteUrl?: string;
}) {
  const { product, customisation } = input;
  const estimate = calculateEstimate({
    kitPrice: Number(product.base_price),
    printing: customisation.printing,
    badgeCount: customisation.badges.length,
    priceOnRequest: product.price_on_request,
  });
  const site =
    input.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  const productUrl = `${site}/shop/${product.slug}`;

  const lines = [
    "Hi Middle Men,",
    "",
    "I'd like to request the following kit:",
    "",
    `Kit: ${product.name}`,
    `Club / Country: ${product.club}${product.country ? ` (${product.country})` : ""}`,
    `Season: ${product.season}`,
    `Kit type: ${product.kit_type}`,
    `Size: ${customisation.size || "Not selected"}`,
  ];

  if (customisation.sleeve) {
    lines.push(`Sleeve: ${customisation.sleeve}`);
  }

  lines.push(`Name Printing: ${customisation.printing ? "Yes" : "No"}`);

  if (customisation.printing) {
    lines.push(`Name: ${customisation.playerName || "—"}`);
    lines.push(`Number: ${customisation.shirtNumber || "—"}`);
  }

  lines.push(
    `Badges: ${customisation.badges.length ? customisation.badges.join(", ") : "None"}`,
  );

  if (product.price_on_request) {
    lines.push("Kit Price: Price on Request");
    lines.push("Estimated Total: Price on Request (excluding delivery)");
  } else {
    lines.push(`Kit Price: ${formatPrice(estimate.kitPrice)}`);
    if (estimate.printingCost) {
      lines.push(`Printing: ${formatPrice(estimate.printingCost)}`);
    }
    if (estimate.badgeCost) {
      lines.push(
        `Badges (${customisation.badges.length} × ${formatPrice(BADGE_COST)}): ${formatPrice(estimate.badgeCost)}`,
      );
    }
    lines.push(
      `Estimated Total: ${formatPrice(estimate.estimatedTotal)} (excluding delivery)`,
    );
  }

  lines.push(`Product link: ${productUrl}`);

  if (customisation.notes.trim()) {
    lines.push("", `Notes: ${customisation.notes.trim()}`);
  }

  lines.push(
    "",
    "Please confirm availability, delivery costs and the final price.",
  );

  return lines.join("\n");
}

export function buildCustomRequestMessage(request: CustomKitRequest) {
  const estimate = calculateEstimate({
    kitPrice: 0,
    printing: request.printing,
    badgeCount: request.badges.length,
    priceOnRequest: true,
  });

  const lines = [
    "Hi Middle Men,",
    "",
    "I'd like to request a kit that isn't listed:",
    "",
    `Club / Country: ${request.club || request.country || "—"}`,
    `Season: ${request.season || "—"}`,
    `Kit type: ${request.kitType || "—"}`,
    `Size: ${request.size || "—"}`,
    `Sleeve: ${request.sleeve || "—"}`,
    `Name Printing: ${request.printing ? "Yes" : "No"}`,
  ];

  if (request.printing) {
    lines.push(`Name: ${request.playerName || "—"}`);
    lines.push(`Number: ${request.shirtNumber || "—"}`);
  }

  lines.push(
    `Badges: ${request.badges.length ? request.badges.join(", ") : "None"}`,
  );

  if (request.printing || request.badges.length) {
    lines.push(
      `Known add-ons so far: Printing ${request.printing ? formatPrice(PRINTING_COST) : "R0"}, Badges ${formatPrice(estimate.badgeCost)}`,
    );
  }

  lines.push("Kit Price: Price on Request (subject to supplier sourcing)");

  if (request.hasReferenceImage) {
    lines.push("Reference image: Customer will attach / has prepared an image.");
  }

  if (request.notes.trim()) {
    lines.push("", `Notes: ${request.notes.trim()}`);
  }

  lines.push(
    "",
    "This is a custom sourcing request. Please confirm whether it can be sourced, the price, delivery fee and timeline.",
  );

  return lines.join("\n");
}
