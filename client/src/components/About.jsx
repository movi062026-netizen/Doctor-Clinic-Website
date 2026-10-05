import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaLeaf, FaHeart, FaHandHoldingMedical, FaUserMd } from 'react-icons/fa';

const features = [
  { icon: <FaLeaf />, text: 'Personalised treatment plans', detail: 'every dilution is matched to your unique history.' },
  { icon: <FaHeart />, text: 'Safe & side-effect free', detail: 'clean, natural remedies safe for infants to seniors.' },
  { icon: <FaHandHoldingMedical />, text: 'Holistic integration', detail: 'combining homeopathy, nutrition, and stress management.' },
  { icon: <FaUserMd />, text: 'Patient-first consults', detail: 'deep consultation sessions to truly hear your concern.' },
];

export default function About() {
  return (
    <section className="py-20 bg-white section-divider" id="about">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Doctor Info Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm bg-gradient-to-br from-slate-50 to-teal-50/30 border border-slate-200/60 rounded-3xl p-8 shadow-lg relative overflow-hidden gradient-border-card">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-teal-500/5 blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-500/5 blur-[40px] pointer-events-none" />
            <div className="space-y-5 text-center relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 text-teal-600 text-3xl font-black rounded-2xl flex items-center justify-center mx-auto shadow-inner" aria-hidden>
                AK
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Dr. Abhishek Khandelwal</h3>
                <p className="text-xs text-teal-600 font-bold mt-1.5">Founder &amp; Chief Homeopath</p>
                <p className="text-xs text-slate-400 font-semibold mt-1">BHMS • Diploma in Naturopathy &amp; Yoga</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <span className="text-xs bg-white border border-slate-200/60 text-slate-600 font-semibold py-1 px-3 rounded-lg shadow-sm hover-lift">
                  12+ Yrs Experience
                </span>
                <span className="text-xs bg-white border border-slate-200/60 text-slate-600 font-semibold py-1 px-3 rounded-lg shadow-sm hover-lift">
                  Homeopathy
                </span>
                <span className="text-xs bg-white border border-slate-200/60 text-slate-600 font-semibold py-1 px-3 rounded-lg shadow-sm hover-lift">
                  Naturopathy
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-teal-50 to-teal-100 px-3 py-1 rounded-full border border-teal-200 inline-flex items-center gap-1.5">
              <FaUserMd className="text-[10px]" />
              Lead Practitioner
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-3 text-slate-900 leading-tight">
              Meet the Doctor Behind <span className="text-gradient">200,000+</span> Healing Journeys
            </h2>
          </div>
          <p className="text-slate-500 text-sm md:text-md leading-relaxed">
            Dr. Abhishek Khandelwal leads HomeHub Homeopathy with a simple, compassionate philosophy — treat the patient, not just the disease. Combining classical homeopathy with naturopathy and lifestyle counseling, he helps patients break free from chronic ailments that conventional medications only suppress. Every recovery protocol is tailored around <em>your</em> constitution.
          </p>
          
          <ul className="space-y-4 text-xs md:text-sm text-slate-600 font-medium">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 text-teal-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-sm">
                  {f.icon}
                </span>
                <span><strong>{f.text}</strong> — {f.detail}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/free-consultation"
              className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-bold py-2.5 px-5 rounded-lg text-xs md:text-sm transition-all hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98] shadow btn-shimmer"
            >
              Book a Consultation
            </Link>
            <Link
              to="/treatments"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold py-2.5 px-5 rounded-lg text-xs md:text-sm transition hover-lift"
            >
              View All Treatments
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
