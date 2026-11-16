import { NextResponse } from "next/server";
import { isStripeConfigured, isSupabaseConfigured } from "@/lib/env";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import type { GuestCartItem, ShippingAddress } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items: GuestCartItem[];
      shipping: ShippingAddress;
    };

    const items = body.items ?? [];
    const shipping = body.shipping;

    if (!items.length || !shipping?.email || !shipping?.fullName) {
      return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
    }

    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
    const shippingCost = subtotal >= 150 ? 0 : 8;
    const total = subtotal + shippingCost;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    let userId: string | null = null;
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id ?? null;
      if (!userId) {
        return NextResponse.json({ error: "Sign in required" }, { status: 401 });
      }
    }

    if (!isStripeConfigured()) {
      const orderId = `demo_${Date.now()}`;
      return NextResponse.json({ demo: true, orderId });
    }

    const stripe = getStripe();

    let orderId: string | null = null;
    if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createServiceRoleClient();
      const { data: order, error } = await admin
        .from("orders")
        .insert({
          user_id: userId,
          status: "pending",
          subtotal,
          shipping: shippingCost,
          total,
          shipping_address: shipping,
        })
        .select("id")
        .single();

      if (error || !order) {
        return NextResponse.json(
          { error: error?.message || "Could not create order" },
          { status: 500 },
        );
      }
      orderId = order.id;

      await admin.from("order_items").insert(
        items.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          variant_id: item.variantId,
          name: item.name,
          size: item.size,
          unit_price: item.price,
          quantity: item.quantity,
        })),
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: shipping.email,
      line_items: [
        ...items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.price * 100),
            product_data: {
              name: `${item.name} (${item.size})`,
              metadata: {
                variantId: item.variantId,
                productId: item.productId,
              },
            },
          },
        })),
        ...(shippingCost > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "usd",
                  unit_amount: Math.round(shippingCost * 100),
                  product_data: { name: "Shipping" },
                },
              },
            ]
          : []),
      ],
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      metadata: {
        orderId: orderId ?? "",
        userId: userId ?? "",
      },
    });

    if (orderId && isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createServiceRoleClient();
      await admin
        .from("orders")
        .update({ stripe_session_id: session.id })
        .eq("id", orderId);
    }

    return NextResponse.json({ url: session.url, orderId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
