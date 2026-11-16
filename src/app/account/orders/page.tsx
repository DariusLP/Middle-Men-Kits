import Link from "next/link";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/motion/primitives";
import { formatPrice } from "@/lib/format";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { OrderWithItems } from "@/lib/types";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:pt-32">
        <h1 className="font-display text-5xl tracking-wide">
          Orders
        </h1>
        <p className="mt-4 text-ink-muted">
          Order history appears after Supabase is connected.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/orders");

  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as OrderWithItems[];

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:pt-32">
      <FadeIn>
        <Link href="/account" className="text-sm text-ink-muted">
          ← Account
        </Link>
        <h1 className="mt-4 font-display text-5xl tracking-wide">
          Orders
        </h1>
      </FadeIn>

      {orders.length === 0 ? (
        <p className="mt-10 text-ink-muted">No orders yet.</p>
      ) : (
        <ul className="mt-10 space-y-6">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border border-line bg-surface p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-ink-muted">
                  {new Date(order.created_at).toLocaleDateString()} ·{" "}
                  <span className="uppercase">{order.status}</span>
                </p>
                <p className="font-semibold">{formatPrice(Number(order.total))}</p>
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {order.order_items.map((item) => (
                  <li key={item.id}>
                    {item.name} ({item.size}) × {item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
