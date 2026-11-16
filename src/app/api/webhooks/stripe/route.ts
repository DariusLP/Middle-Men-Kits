import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { isSupabaseConfigured } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook config" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;

    if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY && orderId) {
      const admin = createServiceRoleClient();

      await admin
        .from("orders")
        .update({
          status: "paid",
          stripe_session_id: session.id,
        })
        .eq("id", orderId);

      const { data: orderItems } = await admin
        .from("order_items")
        .select("variant_id, quantity")
        .eq("order_id", orderId);

      if (orderItems) {
        for (const item of orderItems) {
          if (!item.variant_id) continue;
          const { data: variant } = await admin
            .from("product_variants")
            .select("stock")
            .eq("id", item.variant_id)
            .single();
          if (!variant) continue;
          await admin
            .from("product_variants")
            .update({
              stock: Math.max(0, Number(variant.stock) - Number(item.quantity)),
            })
            .eq("id", item.variant_id);
        }
      }

      if (userId) {
        const { data: cart } = await admin
          .from("carts")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();
        if (cart) {
          await admin.from("cart_items").delete().eq("cart_id", cart.id);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
