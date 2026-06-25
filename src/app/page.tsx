"use client";

import { AddressForm } from "@/components/AddressForm";
import { RecentAnalyses } from "@/components/RecentAnalyses";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Property Analysis Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Enter a property address to estimate value, recommended repairs, after-repair value,
          and potential profit — all in one report.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">Analyze a Property</h2>
            <p className="mt-1 text-sm text-slate-600">
              Full address including city, state, and ZIP for best results.
            </p>
            <div className="mt-6">
              <AddressForm />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-sky-50 p-6">
            <h3 className="font-semibold text-teal-900">What you&apos;ll get</h3>
            <ul className="mt-4 space-y-3 text-sm text-teal-900">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                Property summary from public records (RentCast when configured)
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                Current market value estimate
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                Prioritized repair recommendations
              </li>
              <li className="flex gap-2">
                <span className="font-bold">4.</span>
                ARV and profit analysis
              </li>
              <li className="flex gap-2">
                <span className="font-bold">5.</span>
                Printable investment report
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <RecentAnalyses />
      </div>
    </div>
  );
}
