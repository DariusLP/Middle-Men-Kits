import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { OrderWithItems } from "@/lib/types";

export const metadata = { title: "Orders · Admin" };

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as OrderWithItems[];

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">
        Orders
      </h1>
      <ul className="mt-8 space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm uppercase tracking-[0.12em] text-accent">
                  {order.status}
                </p>
                <p className="text-sm text-white/50">
                  {new Date(order.created_at).toLocaleString()} · {order.id.slice(0, 8)}
                </p>
              </div>
              <p className="text-lg font-semibold">
                {formatPrice(Number(order.total))}
              </p>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-white/80">
              {order.order_items.map((item) => (
                <li key={item.id}>
                  {item.name} ({item.size}) × {item.quantity}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-white/40">
              Ship to {order.shipping_address?.fullName},{" "}
              {order.shipping_address?.city}
            </p>
          </li>
        ))}
        {orders.length === 0 ? (
          <li className="text-white/60">No orders yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
