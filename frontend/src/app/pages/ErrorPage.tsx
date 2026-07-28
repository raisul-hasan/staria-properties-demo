import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const message = status === 404 ? "The page you requested could not be found." : "Something unexpected happened while loading this page.";
  return (
    <main className="min-h-screen bg-[#F5F6F3] flex items-center justify-center px-5">
      <div className="max-w-lg text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-5"><AlertTriangle size={28} /></div>
        <p className="text-xs tracking-[.24em] uppercase font-semibold text-[#0B5E3C] mb-3">Error {status}</p>
        <h1 className="text-4xl text-[#1B1B1B]" style={{ fontFamily: "'Gilda Display', Georgia, serif" }}>We couldn’t open that page</h1>
        <p className="text-[#666] mt-4">{message}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button onClick={() => window.location.reload()} className="rounded-xl bg-[#0B5E3C] text-white px-5 py-3 font-semibold inline-flex items-center gap-2"><RefreshCw size={16} /> Try again</button>
          <Link to="/" className="rounded-xl border border-black/10 bg-white px-5 py-3 font-semibold inline-flex items-center gap-2"><ArrowLeft size={16} /> Go home</Link>
        </div>
      </div>
    </main>
  );
}
