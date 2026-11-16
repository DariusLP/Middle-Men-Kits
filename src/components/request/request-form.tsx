"use client";

import { useMemo, useRef, useState } from "react";
import { EnquiryActions } from "@/components/enquiry/enquiry-actions";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { buildCustomRequestMessage } from "@/lib/enquiry";
import { formatPrice } from "@/lib/format";
import {
  BADGE_COST,
  PRICE_DISCLAIMER,
  PRINTING_COST,
  calculateEstimate,
} from "@/lib/pricing";
import { DEFAULT_BADGES, SIZES, type CustomKitRequest } from "@/lib/types";

const initial: CustomKitRequest = {
  club: "",
  country: "",
  season: "",
  kitType: "home",
  size: "M",
  sleeve: "short",
  printing: false,
  playerName: "",
  shirtNumber: "",
  badges: [],
  notes: "",
  hasReferenceImage: false,
};

const kitTypeOptions = [
  { value: "home", label: "Home" },
  { value: "away", label: "Away" },
  { value: "third", label: "Third" },
  { value: "goalkeeper", label: "Goalkeeper" },
  { value: "retro", label: "Retro" },
  { value: "special", label: "Special" },
];

const sizeOptions = SIZES.map((size) => ({
  value: size,
  label: `Size ${size}`,
}));

const sleeveOptions = [
  { value: "short", label: "Short sleeve" },
  { value: "long", label: "Long sleeve" },
];

function FieldLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
      {children}
    </p>
  );
}

function BrowseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.1c.4 0 .8.2 1 .5l1 1.3c.2.3.6.5 1 .5H18.5A2.5 2.5 0 0 1 21 9.8v6.7a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 11v5M9.5 13.5 12 11l2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RequestForm() {
  const [form, setForm] = useState<CustomKitRequest>(initial);
  const [imageName, setImageName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const estimate = useMemo(
    () =>
      calculateEstimate({
        kitPrice: 0,
        printing: form.printing,
        badgeCount: form.badges.length,
        priceOnRequest: true,
      }),
    [form.badges.length, form.printing],
  );

  const message = useMemo(
    () =>
      buildCustomRequestMessage({
        ...form,
        hasReferenceImage: Boolean(imageName) || form.hasReferenceImage,
        notes: imageName
          ? `${form.notes}${form.notes ? "\n" : ""}Reference image prepared: ${imageName}`
          : form.notes,
      }),
    [form, imageName],
  );

  function toggleBadge(badge: string) {
    setForm((prev) => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter((b) => b !== badge)
        : [...prev.badges, badge],
    }));
  }

  function applyFile(file: File | undefined) {
    if (!file) {
      setImageName(null);
      setForm((p) => ({ ...p, hasReferenceImage: false }));
      return;
    }
    setImageName(file.name);
    setForm((p) => ({ ...p, hasReferenceImage: true }));
  }

  function clearFile() {
    setImageName(null);
    setForm((p) => ({ ...p, hasReferenceImage: false }));
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
      <form
        className="space-y-6 rounded-3xl border border-line bg-paper/80 p-5 shadow-sm md:p-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Kit details
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-wide md:text-4xl">
            Tell us what to source
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Club / team</FieldLabel>
            <input
              className="input-block rounded-xl"
              placeholder="e.g. Arsenal"
              value={form.club}
              onChange={(e) => setForm((p) => ({ ...p, club: e.target.value }))}
            />
          </div>
          <div>
            <FieldLabel>Country</FieldLabel>
            <input
              className="input-block rounded-xl"
              placeholder="e.g. England"
              value={form.country}
              onChange={(e) =>
                setForm((p) => ({ ...p, country: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Season</FieldLabel>
            <input
              className="input-block rounded-xl"
              placeholder="e.g. 24/25"
              value={form.season}
              onChange={(e) =>
                setForm((p) => ({ ...p, season: e.target.value }))
              }
            />
          </div>
          <SelectDropdown
            label="Kit type"
            value={form.kitType}
            onChange={(kitType) => setForm((p) => ({ ...p, kitType }))}
            options={kitTypeOptions}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectDropdown
            label="Size"
            value={form.size}
            onChange={(size) => setForm((p) => ({ ...p, size }))}
            options={sizeOptions}
          />
          <SelectDropdown
            label="Sleeve"
            value={form.sleeve}
            onChange={(sleeve) => setForm((p) => ({ ...p, sleeve }))}
            options={sleeveOptions}
          />
        </div>

        <div className="rounded-2xl border border-line bg-surface/40 p-4">
          <label className="flex cursor-pointer items-center justify-between gap-4 text-sm">
            <span>
              <span className="font-medium text-ink">
                Name & number printing
              </span>
              <span className="ml-2 text-ink-muted">
                +{formatPrice(PRINTING_COST)}
              </span>
            </span>
            <span
              className={`relative h-7 w-12 rounded-full transition-colors ${
                form.printing ? "bg-accent" : "bg-line"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  form.printing ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
              <input
                type="checkbox"
                checked={form.printing}
                onChange={(e) =>
                  setForm((p) => ({ ...p, printing: e.target.checked }))
                }
                className="sr-only"
              />
            </span>
          </label>
          {form.printing ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                className="input-block rounded-xl"
                placeholder="Name on shirt"
                value={form.playerName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, playerName: e.target.value }))
                }
              />
              <input
                className="input-block rounded-xl"
                placeholder="Number"
                value={form.shirtNumber}
                onChange={(e) =>
                  setForm((p) => ({ ...p, shirtNumber: e.target.value }))
                }
              />
            </div>
          ) : null}
        </div>

        <div>
          <FieldLabel>{`Badges (${formatPrice(BADGE_COST)} each)`}</FieldLabel>
          <div className="mt-1 flex flex-wrap gap-2">
            {DEFAULT_BADGES.map((badge) => {
              const active = form.badges.includes(badge);
              return (
                <button
                  key={badge}
                  type="button"
                  onClick={() => toggleBadge(badge)}
                  className={`rounded-full border px-3.5 py-2 text-sm transition-all duration-300 ${
                    active
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-line text-ink hover:border-ink"
                  }`}
                >
                  {badge}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <FieldLabel>Reference image (optional)</FieldLabel>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => applyFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              applyFile(e.dataTransfer.files?.[0]);
            }}
            className={`group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-5 py-8 text-center transition-all duration-300 ${
              dragging
                ? "border-accent bg-accent/5"
                : imageName
                  ? "border-ink bg-surface/50"
                  : "border-line bg-surface/30 hover:border-ink hover:bg-surface/60"
            }`}
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
                imageName
                  ? "bg-ink text-paper"
                  : "bg-paper text-accent group-hover:bg-ink group-hover:text-paper"
              }`}
            >
              <BrowseIcon />
            </span>
            {imageName ? (
              <>
                <span className="text-sm font-medium text-ink">
                  {imageName}
                </span>
                <span className="text-xs text-ink-muted">
                  Click to choose a different image
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-ink">
                  Browse for a reference image
                </span>
                <span className="text-xs text-ink-muted">
                  Or drag and drop a photo here
                </span>
              </>
            )}
          </button>
          {imageName ? (
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-ink-muted">
              <p>
                Attached locally — also send this image in the WhatsApp chat.
              </p>
              <button
                type="button"
                onClick={clearFile}
                className="shrink-0 font-semibold uppercase tracking-[0.14em] text-accent hover:underline"
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>

        <div>
          <FieldLabel>Notes</FieldLabel>
          <textarea
            rows={4}
            className="input-block rounded-xl"
            placeholder="Colours, player, deadline…"
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          />
        </div>
      </form>

      <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-paper via-surface to-surface-2 p-6 md:p-7">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-accent" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/10 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Estimated add-ons
          </p>
          <p className="mt-3 font-display text-4xl tracking-wide md:text-5xl">
            Price on request
          </p>
          <ul className="mt-5 space-y-2 text-sm text-ink-muted">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              Kit base — confirmed after sourcing
            </li>
            {estimate.printingCost ? (
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Printing {formatPrice(estimate.printingCost)}
              </li>
            ) : null}
            {estimate.badgeCost ? (
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Badges ({form.badges.length}) {formatPrice(estimate.badgeCost)}
              </li>
            ) : null}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-ink-muted">
            {PRICE_DISCLAIMER}
          </p>
        </div>
        <EnquiryActions
          message={message}
          disabled={!form.club && !form.country}
          primaryLabel="Send request on WhatsApp"
        />
      </aside>
    </div>
  );
}
