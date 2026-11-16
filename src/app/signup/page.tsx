"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MotionButton } from "@/components/motion/motion-button";
import { FadeIn } from "@/components/motion/primitives";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Add Supabase env vars to enable sign-up.");
      return;
    }

    setLoading(true);
    const form = new FormData(e.currentTarget);
    const fullName = String(form.get("fullName"));
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-20 pt-28 md:pt-32">
      <FadeIn>
        <h1 className="font-display text-5xl tracking-wide">
          Create account
        </h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            name="fullName"
            required
            placeholder="Full name"
            className="input-block"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="input-block"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Password"
            className="input-block"
          />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <MotionButton type="submit" disabled={loading} className="w-full">
            {loading ? "Creating…" : "Sign up"}
          </MotionButton>
        </form>
        <p className="mt-6 text-sm text-ink-muted">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </FadeIn>
    </div>
  );
}
