import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders (legacy)" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-pitch-deep px-5 py-16 text-paper">
        <h1 className="font-display text-4xl tracking-wide">
          Admin
        </h1>
        <p className="mt-4 max-w-lg text-white/70">
          Configure Supabase env vars, run schema + seed SQL, then promote a user
          to admin to use this panel.
        </p>
        <Link href="/" className="mt-8 inline-block text-accent">
          ← Back to store
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-pitch-deep text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-8 md:flex-row md:px-8">
        <aside className="md:w-48 md:shrink-0">
          <Link
            href="/"
            className="font-display text-xl tracking-[0.08em] text-accent"
          >
            MIDDLE MEN
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/50">
            Admin
          </p>
          <nav className="mt-8 flex flex-row gap-4 md:flex-col md:gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/70 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/account" className="text-sm text-white/40 hover:text-white">
              Account
            </Link>
          </nav>
        </aside>
        <div className="min-w-0 flex-1 pb-16">{children}</div>
      </div>
    </div>
  );
}
