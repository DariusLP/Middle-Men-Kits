import { PageHeroHeading } from "@/components/motion/section-heading";
import { RequestForm } from "@/components/request/request-form";

export const metadata = {
  title: "Request a Kit",
};

export default function RequestPage() {
  return (
    <div>
      <div className="relative overflow-hidden bg-ink px-5 pb-14 pt-28 text-paper md:px-8 md:pb-16 md:pt-32">
        <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-accent" />
        <div className="relative mx-auto max-w-6xl">
          <PageHeroHeading
            eyebrow="Custom sourcing"
            title={
              <>
                Can&apos;t Find
                <br />
                Your Kit?
              </>
            }
            description="Tell us what you need. We'll check suppliers and confirm price, availability and delivery on WhatsApp — no account required."
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <RequestForm />
      </div>
    </div>
  );
}
