import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPhoneAlt, FaSearch } from 'react-icons/fa';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20 flex items-center justify-center p-6 pt-24">
      <div className="text-center max-w-md relative">
        {/* Background glow */}
        <div className="absolute inset-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px] mx-auto pointer-events-none" />

        <div className="relative z-10">
          {/* Big 404 */}
          <div className="mb-6">
            <span className="text-8xl md:text-9xl font-black text-gradient tracking-tighter">404</span>
          </div>

          {/* Icon */}
          <div className="w-16 h-16 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl text-teal-600 animate-float">
            <FaSearch />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Page Not Found</h1>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">
            The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-bold py-2.5 px-5 rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98] flex items-center gap-2 shadow btn-shimmer"
            >
              <FaHome /> Go Home
            </Link>
            <Link
              to="/contact"
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 font-bold py-2.5 px-5 rounded-lg text-sm transition flex items-center gap-2 hover-lift"
            >
              <FaPhoneAlt /> Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
