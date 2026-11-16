import { redirect } from "next/navigation";
import { MotionLink } from "@/components/motion/motion-button";
import { FadeIn } from "@/components/motion/primitives";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-xl px-5 pb-20 pt-28 md:pt-32">
        <h1 className="font-display text-5xl tracking-wide">
          Account
        </h1>
        <p className="mt-4 text-ink-muted">
          Connect Supabase to enable accounts. Until then, browsing and
          WhatsApp enquiries still work.
        </p>
        <MotionLink href="/login" className="mt-6">
          Sign in
        </MotionLink>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-xl px-5 pb-20 pt-28 md:pt-32">
      <FadeIn>
        <h1 className="font-display text-5xl tracking-wide">
          Account
        </h1>
        <div className="mt-8 space-y-3 text-sm">
          <p>
            <span className="text-ink-muted">Name</span>
            <br />
            {profile?.full_name || "—"}
          </p>
          <p>
            <span className="text-ink-muted">Email</span>
            <br />
            {user.email}
          </p>
          <p>
            <span className="text-ink-muted">Role</span>
            <br />
            {profile?.role ?? "customer"}
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <MotionLink href="/account/orders">Order history</MotionLink>
          {profile?.role === "admin" ? (
            <MotionLink href="/admin" variant="accent">
              Admin
            </MotionLink>
          ) : null}
          <SignOutButton />
        </div>
      </FadeIn>
    </div>
  );
}
