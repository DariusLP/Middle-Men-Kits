"use client";

import { useRouter } from "next/navigation";
import { MotionButton } from "@/components/motion/motion-button";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <MotionButton type="button" variant="outline" onClick={signOut}>
      Sign out
    </MotionButton>
  );
}
