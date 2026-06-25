import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "PropAnalyze — Real Estate Property Analysis",
  description:
    "Analyze property values, repair costs, ARV, and profit potential for real estate investments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <div className="min-h-screen">
          <header className="no-print border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
              <a href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-sm font-bold text-white">
                  PA
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">PropAnalyze</p>
                  <p className="text-xs text-slate-500">Property Investment Analysis</p>
                </div>
              </a>
            </div>
          </header>
          <main>{children}</main>
          <footer className="no-print border-t border-slate-200 bg-white py-6">
            <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500 sm:px-6">
              MVP prototype — add a RentCast API key for real customer home data.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
