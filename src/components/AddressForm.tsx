"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SAMPLE_ADDRESS } from "@/lib/constants";

export function AddressForm() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Analysis failed");
      }

      router.push(`/report/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  function useSampleAddress() {
    setAddress(SAMPLE_ADDRESS);
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="address"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Property address
        </label>
        <input
          id="address"
          type="text"
          required
          minLength={5}
          placeholder={SAMPLE_ADDRESS}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="text-xs text-slate-500">
            Use full format: street, city, state, ZIP for real property records.
          </p>
          <button
            type="button"
            onClick={useSampleAddress}
            className="text-xs font-medium text-teal-700 hover:text-teal-600"
          >
            Try sample: 207 Midway Island, Clearwater
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || address.trim().length < 5}
        className="inline-flex w-full items-center justify-center rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Analyzing property…
          </>
        ) : (
          "Analyze Property"
        )}
      </button>
    </form>
  );
}
