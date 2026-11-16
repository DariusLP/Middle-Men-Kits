import Link from "next/link";
import { WeeklyCollectionPanel } from "@/components/admin/weekly-collection-panel";
import { createClient } from "@/lib/supabase/server";
import { WEEKLY_COLLECTION_UPDATED_AT } from "@/lib/demo-data";

export const metadata = { title: "Admin" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: weeklyCount },
    { count: productCount },
    { data: setting },
    { data: checkRequired },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_weekly", true)
      .eq("active", true),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "weekly_collection_updated_at")
      .maybeSingle(),
    supabase
      .from("products")
      .select("id, name, availability_status")
      .eq("availability_status", "check_required")
      .eq("active", true)
      .limit(8),
  ]);

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-white/55">
        Manage weekly kits and enquiries. Stripe checkout is no longer part of
        the customer flow.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <WeeklyCollectionPanel
          updatedAt={setting?.value || WEEKLY_COLLECTION_UPDATED_AT}
          weeklyCount={weeklyCount ?? 0}
        />
        <div className="border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-white/50">
            Active products
          </p>
          <p className="mt-2 text-3xl font-semibold">{productCount ?? 0}</p>
          <Link
            href="/admin/products"
            className="mt-3 inline-block text-sm text-accent"
          >
            Manage products
          </Link>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-sm uppercase tracking-[0.14em] text-white/50">
          Needs availability check
        </h2>
        {!checkRequired?.length ? (
          <p className="mt-3 text-white/60">Nothing flagged right now.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {checkRequired.map((row) => (
              <li
                key={row.id}
                className="flex justify-between border-b border-white/10 py-2 text-sm"
              >
                <span>{row.name}</span>
                <Link
                  href={`/admin/products/${row.id}`}
                  className="text-accent"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-10 text-xs text-white/35">
        Legacy Stripe orders remain under{" "}
        <Link href="/admin/orders" className="underline">
          Orders
        </Link>{" "}
        if you need history.
      </p>
    </div>
  );
}
