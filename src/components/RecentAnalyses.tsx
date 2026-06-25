"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";

interface RecentAnalysis {
  id: string;
  address: string;
  estimatedValue: number;
  arv: number;
  potentialProfit: number;
  createdAt: string;
}

export function RecentAnalyses() {
  const [analyses, setAnalyses] = useState<RecentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analyses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAnalyses(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading recent analyses…</p>
      </div>
    );
  }

  if (analyses.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Recent Analyses</h2>
      <p className="mt-1 text-sm text-slate-600">Your last 10 property reports</p>

      <ul className="mt-4 divide-y divide-slate-100">
        {analyses.map((item) => (
          <li key={item.id}>
            <Link
              href={`/report/${item.id}`}
              className="flex flex-col gap-2 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-2"
            >
              <div>
                <p className="font-medium text-slate-900">{item.address}</p>
                <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-slate-600">
                  Value: <strong>{formatCurrency(item.estimatedValue)}</strong>
                </span>
                <span className="text-slate-600">
                  ARV: <strong>{formatCurrency(item.arv)}</strong>
                </span>
                <span
                  className={
                    item.potentialProfit >= 0 ? "text-emerald-700" : "text-red-700"
                  }
                >
                  Profit: <strong>{formatCurrency(item.potentialProfit)}</strong>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
