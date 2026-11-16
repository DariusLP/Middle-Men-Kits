"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MotionButton } from "@/components/motion/motion-button";
import { FadeIn } from "@/components/motion/primitives";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Add Supabase env vars to enable sign-in.");
      return;
    }

    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-20 pt-28 md:pt-32">
      <FadeIn>
        <h1 className="font-display text-5xl tracking-wide">
          Sign in
        </h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
            placeholder="Password"
            className="input-block"
          />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <MotionButton type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </MotionButton>
        </form>
        <p className="mt-6 text-sm text-ink-muted">
          No account?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Create one
          </Link>
        </p>
      </FadeIn>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="px-5 py-28">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
