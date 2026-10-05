import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaCheck, FaUserMd, FaStar, FaShieldAlt, FaTrophy, FaLeaf, FaHeartbeat, FaAward } from 'react-icons/fa';

const lines = [
  '100% Safe & Natural Treatment',
  'No Side Effects · No Steroids',
  'Cures the Root Cause — Permanently',
];

export default function Hero() {
  const boxRef = useRef(null);

  // Subtle 3D tilt that follows the cursor.
  const onMove = (e) => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    el.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
    el.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
  };

  const reset = () => {
    const el = boxRef.current;
    if (el) el.style.transform = '';
  };

  return (
    <section className="relative bg-gradient-to-br from-teal-50/30 via-white to-blue-50/30 pt-32 pb-24 overflow-hidden section-divider" id="home">
      {/* Animated background elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-teal-500/5 to-blue-500/5 blur-[130px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-blue-500/5 to-teal-500/5 blur-[120px] pointer-events-none animate-float" />
      
      {/* Decorative dots */}
      <div className="absolute top-40 right-16 w-2 h-2 rounded-full bg-teal-400/40 animate-float" />
      <div className="absolute top-60 right-32 w-1.5 h-1.5 rounded-full bg-blue-400/40 animate-float-slow" />
      <div className="absolute bottom-32 left-20 w-2 h-2 rounded-full bg-amber-400/40 animate-float" />

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Copy section */}
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-teal-50 to-amber-50 text-teal-700 border border-teal-200 py-1.5 px-3.5 rounded-full font-bold animate-fadeIn shadow-sm">
            <FaTrophy className="text-amber-500" />
            <span><strong>200,000+</strong> Happy patients treated across India &amp; abroad</span>
          </span>

          {/* Interactive hero box */}
          <div
            className="relative bg-white/80 border border-slate-100/90 rounded-3xl p-6 md:p-8 shadow-xl transition-transform duration-250 ease-out select-none group gradient-border-card"
            ref={boxRef}
            onMouseMove={onMove}
            onMouseLeave={reset}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Custom interactive glowing card highlight */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
              style={{
                background: 'radial-gradient(400px circle at var(--gx, 50%) var(--gy, 50%), rgba(20, 184, 166, 0.06), transparent 80%)',
              }}
            />

            <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-5">
              <span className="w-11 h-11 bg-gradient-to-br from-teal-500 to-teal-700 text-white font-black flex items-center justify-center rounded-2xl text-lg shadow-lg shadow-teal-500/25">
                H
              </span>
              <div>
                <strong className="text-slate-800 text-md block font-extrabold">HomeHub Homeopathy</strong>
                <small className="text-slate-400 text-xs block font-bold">Safe • Natural • Root-Cause Cure</small>
              </div>
            </div>

            <ul className="space-y-3.5 mb-8">
              {lines.map((l, i) => (
                <li
                  key={l}
                  className="flex items-center gap-3 text-slate-600 text-sm md:text-md font-medium animate-fadeIn"
                  style={{ animationDelay: `${0.1 + i * 0.15}s` }}
                >
                  <span className="w-5 h-5 bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 text-teal-600 rounded-full flex items-center justify-center text-xs font-bold" aria-hidden>
                    <FaCheck className="text-[9px]" />
                  </span>{' '}
                  {l}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <a
                href="tel:+919829593852"
                className="flex-1 bg-slate-50 border border-slate-200/60 hover:border-teal-300 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-all group/call"
              >
                <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center relative flex-shrink-0">
                  <span className="absolute inset-0 rounded-full bg-teal-550/10 animate-ping opacity-75" />
                  <FaPhoneAlt className="text-xs" />
                </div>
                <div className="text-left leading-tight">
                  <small className="text-slate-400 text-[10px] block uppercase font-bold">Call us now</small>
                  <span className="text-slate-700 font-mono font-bold text-sm group-hover/call:text-teal-600 transition-colors">
                    +91 98295 93852
                  </span>
                </div>
              </a>
              <Link
                to="/free-consultation"
                className="flex-1 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-bold px-6 py-4 rounded-2xl flex items-center justify-center transition-all hover:shadow-lg hover:shadow-teal-500/25 text-sm active:scale-[0.98] text-center shadow-md btn-shimmer"
              >
                Avail Free Consultation →
              </Link>
            </div>
          </div>
        </div>

        {/* Media / Authority Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm">
            {/* Main doctor card */}
            <div className="bg-white border border-slate-100/80 rounded-3xl p-8 hover:border-slate-200 transition-all duration-300 shadow-lg relative overflow-hidden">
              {/* Ambient behind glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-teal-500/5 via-transparent to-blue-500/5 opacity-60 pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-teal-500/5 blur-[40px] pointer-events-none" />

              <div className="space-y-5 relative z-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 text-teal-600 text-3xl rounded-2xl flex items-center justify-center mx-auto shadow-inner animate-float-slow" aria-hidden>
                  <FaUserMd />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800">Dr. Abhishek Khandelwal</h3>
                  <span className="text-xs text-slate-400 font-bold block">Founder &amp; Chief Homeopath</span>
                  <span className="text-xs text-teal-655 font-bold block">BHMS, MD (Homeopathy)</span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                  <div className="text-center">
                    <span className="text-lg font-black text-teal-600 block">12+</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Years</span>
                  </div>
                  <div className="text-center border-x border-slate-100">
                    <span className="text-lg font-black text-teal-600 block">2L+</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Patients</span>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-black text-teal-600 block">4.9</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Rating</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <span className="text-xs bg-slate-50 border border-slate-200/60 text-slate-650 font-bold py-1 px-3 rounded-lg">
                    CCH Certified
                  </span>
                  <span className="text-xs bg-slate-50 border border-slate-200/60 text-slate-650 font-bold py-1 px-3 rounded-lg">
                    Govt. Registered
                  </span>
                </div>
              </div>
            </div>

            {/* Float Badge 1 - Rating */}
            <div className="absolute -top-4 -right-4 bg-white border border-slate-100 text-slate-700 text-xs py-2 px-3.5 rounded-xl shadow-lg flex items-center gap-1.5 font-bold hover:scale-105 transition-transform animate-float">
              <FaStar className="text-amber-500" /> <span className="text-teal-650">4.9 Rating</span>
            </div>

            {/* Float Badge 2 - Shield */}
            <div className="absolute -bottom-4 -left-4 bg-white border border-slate-100 text-slate-700 text-xs py-2 px-3.5 rounded-xl shadow-lg flex items-center gap-1.5 font-bold hover:scale-105 transition-transform animate-float-slow">
              <FaShieldAlt className="text-blue-500" /> <span className="text-teal-650">Govt. Registered</span>
            </div>

            {/* Float Badge 3 - Natural */}
            <div className="absolute top-1/2 -left-6 bg-white border border-slate-100 text-slate-700 text-xs py-2 px-3 rounded-xl shadow-lg flex items-center gap-1.5 font-bold hover:scale-105 transition-transform animate-float" style={{ animationDelay: '1s' }}>
              <FaLeaf className="text-emerald-500" /> <span className="text-emerald-700">100% Natural</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
