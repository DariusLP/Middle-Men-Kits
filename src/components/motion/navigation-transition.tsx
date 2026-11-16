"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";

const WIPE_ID = "mm-route-wipe";
const BAR_ID = "mm-route-bar";

function ensureWipe() {
  let wipe = document.getElementById(WIPE_ID);
  if (!wipe) {
    wipe = document.createElement("div");
    wipe.id = WIPE_ID;
    wipe.setAttribute("aria-hidden", "true");
    wipe.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:2147483000",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "background:#071224",
      "pointer-events:none",
      "opacity:0",
      "transition:opacity 180ms ease",
    ].join(";");
    wipe.innerHTML = `
      <div style="text-align:center">
        <p style="margin:0;color:#f7f2ec;font-family:var(--font-display),sans-serif;font-size:clamp(3rem,10vw,5rem);letter-spacing:0.14em">MIDDLE MEN</p>
        <div style="width:96px;height:6px;margin:20px auto 0;background:#e11d2e"></div>
      </div>
    `;
    document.body.appendChild(wipe);
  }

  let barWrap = document.getElementById(BAR_ID);
  if (!barWrap) {
    barWrap = document.createElement("div");
    barWrap.id = BAR_ID;
    barWrap.setAttribute("aria-hidden", "true");
    barWrap.style.cssText = [
      "position:fixed",
      "top:0",
      "left:0",
      "right:0",
      "height:6px",
      "z-index:2147483001",
      "background:rgba(0,0,0,0.2)",
      "pointer-events:none",
    ].join(";");
    barWrap.innerHTML = `<div data-fill="1" style="height:100%;width:0%;background:#e11d2e;transition:width 200ms ease"></div>`;
    document.body.appendChild(barWrap);
  }

  return {
    wipe,
    fill: barWrap.querySelector("[data-fill]") as HTMLDivElement,
  };
}

function showWipe(progress = 35) {
  const { wipe, fill } = ensureWipe();
  wipe.style.zIndex = "2147483000";
  wipe.style.opacity = "1";
  fill.style.width = `${progress}%`;
  const bar = document.getElementById(BAR_ID);
  if (bar) bar.style.zIndex = "2147483001";
}

function setProgress(progress: number) {
  const fill = document.querySelector(`#${BAR_ID} [data-fill]`) as HTMLDivElement | null;
  if (fill) fill.style.width = `${progress}%`;
}

function hideWipe() {
  const wipe = document.getElementById(WIPE_ID);
  const fill = document.querySelector(`#${BAR_ID} [data-fill]`) as HTMLDivElement | null;
  if (wipe) wipe.style.opacity = "0";
  if (fill) fill.style.width = "0%";
}

export function NavigationTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const busy = useRef(false);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    setProgress(100);
    const t = window.setTimeout(() => {
      hideWipe();
      busy.current = false;
    }, 260);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (reduce) return;

    function onClick(event: MouseEvent) {
      if (busy.current) {
        event.preventDefault();
        return;
      }
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash === window.location.hash
      ) {
        return;
      }

      // Same page, query/hash only (e.g. shop tabs/filters) — no wipe
      if (url.pathname === window.location.pathname) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      busy.current = true;

      showWipe(28);
      window.setTimeout(() => setProgress(65), 80);
      window.setTimeout(() => {
        router.push(`${url.pathname}${url.search}${url.hash}`);
      }, 300);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reduce, router]);

  return null;
}
