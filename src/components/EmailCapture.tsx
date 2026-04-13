"use client";

import { useState } from "react";
import Link from "next/link";

interface EmailCaptureProps {
  variant?: "inline" | "banner";
  context?: string;
}

export default function EmailCapture({ variant = "inline", context }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: context || "general" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`rounded-xl border border-green-200 bg-green-50 p-5 text-center ${variant === "banner" ? "my-8" : "mt-8"}`}>
        <p className="text-sm font-semibold text-green-700">You&apos;re on the list. We&apos;ll send our next seasonal newsletter when it goes out.</p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="my-8 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Seasonal gardening newsletter
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Opt-in mailing list with occasional seasonal tips, new calculators, and notes on growing-zone updates.
              No sharing, unsubscribe in one click. See our <Link href="/privacy" className="underline hover:text-[var(--color-text)]">privacy policy</Link>.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full gap-2 sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/40 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 sm:w-56"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
        {status === "error" && (
          <p className="mt-2 text-center text-xs text-red-600">Something went wrong. Please try again.</p>
        )}
      </div>
    );
  }

  // Inline variant
  return (
    <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-center">
      <h3 className="text-sm font-bold text-[var(--color-text)]">
        Seasonal gardening newsletter
      </h3>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
        Opt-in email list with occasional seasonal tips and new calculators. No sharing, unsubscribe in one click.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex justify-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/40 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-600">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
