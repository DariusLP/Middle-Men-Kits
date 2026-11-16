"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatWeekUpdated } from "@/lib/format";

export function WeeklyCollectionPanel({
  updatedAt,
  weeklyCount,
}: {
  updatedAt: string;
  weeklyCount: number;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function markUpdated() {
    setSaving(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const now = new Date().toISOString();
      const { error } = await supabase.from("site_settings").upsert({
        key: "weekly_collection_updated_at",
        value: now,
        updated_at: now,
      });
      if (error) throw error;
      setMessage("Weekly collection date updated.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-white/50">
        Weekly collection
      </p>
      <p className="mt-2 text-3xl font-semibold">{weeklyCount} kits</p>
      <p className="mt-2 text-sm text-white/55">
        Last marked updated: {formatWeekUpdated(updatedAt)}
      </p>
      <button
        type="button"
        onClick={markUpdated}
        disabled={saving}
        className="mt-4 border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] hover:border-accent hover:text-accent disabled:opacity-50"
      >
        {saving ? "Saving…" : "Mark collection updated"}
      </button>
      {message ? <p className="mt-3 text-xs text-white/60">{message}</p> : null}
    </div>
  );
}
