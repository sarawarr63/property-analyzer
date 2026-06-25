import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Report not found</h1>
      <p className="mt-2 text-slate-600">
        This analysis may have been deleted or the link is invalid.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-600"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
