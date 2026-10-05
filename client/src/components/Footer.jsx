import React from 'react';
import { Link } from 'react-router-dom';
import { FaYoutube, FaLinkedin, FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-sm text-white/80 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Socials */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-black flex items-center justify-center text-md shadow-lg shadow-teal-500/20">
                H
              </span>
              <span className="leading-tight">
                <span className="font-bold text-white text-sm block">
                  HomeHub <span className="font-light text-white/70">Homeopathy</span>
                </span>
                <span className="text-[9px] text-white/50 block uppercase tracking-wider font-bold">
                  Safe • Natural • Root Cure
                </span>
              </span>
            </div>
            <p className="text-white/50 leading-relaxed text-xs">
              A trusted family homeopathy clinic in Jaipur, Rajasthan, dedicated to compassionate, safe care and constitutional root-cause healing.
            </p>
            <div className="flex gap-2 pt-2" aria-label="Social media links">
              {[
                { href: 'https://www.youtube.com/@homehubhomeopathy', icon: <FaYoutube size={14} />, label: 'YouTube' },
                { href: 'https://www.linkedin.com/company/homehubhomeopathy', icon: <FaLinkedin size={14} />, label: 'LinkedIn' },
                { href: 'https://www.instagram.com/homehubhomeopathy', icon: <FaInstagram size={14} />, label: 'Instagram' },
                { href: 'https://wa.me/919829593852', icon: <FaWhatsapp size={14} />, label: 'WhatsApp' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white/50 hover:text-teal-400 hover:border-teal-500/30 hover:bg-slate-800 flex items-center justify-center transition-all hover:scale-105"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold tracking-wider uppercase text-xs flex items-center gap-2">
              <span className="w-5 h-0.5 bg-teal-500 rounded-full" />
              Explore Site
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { to: '/success-stories', label: 'Success Stories' },
                { to: '/doctors', label: 'Our Doctors' },
                { to: '/treatments', label: 'Clinic Treatments' },
                { to: '/reviews', label: 'Patient Reviews' },
                { to: '/booking', label: 'Book Appointment' },
                { to: '/blogs', label: 'Health Blog' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-teal-400 font-semibold transition-colors hover:translate-x-1 inline-block transform">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Treatments */}
          <div className="space-y-4">
            <h4 className="text-white font-bold tracking-wider uppercase text-xs flex items-center gap-2">
              <span className="w-5 h-0.5 bg-teal-500 rounded-full" />
              Homeo Treatments
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { to: '/treatments/diabetic-management', label: 'Diabetes Care' },
                { to: '/treatments/respiratory-care', label: 'Respiratory Care' },
                { to: '/treatments/skin-and-psoriasis', label: 'Psoriasis & Eczema' },
                { to: '/treatments/hair-and-scalp', label: 'Hairfall & Alopecia' },
                { to: '/treatments/mind-and-stress', label: 'Mind & Stress' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-teal-400 font-semibold transition-colors hover:translate-x-1 inline-block transform">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinic details */}
          <div className="space-y-4">
            <h4 className="text-white font-bold tracking-wider uppercase text-xs flex items-center gap-2">
              <span className="w-5 h-0.5 bg-teal-500 rounded-full" />
              Contact Desk
            </h4>
            <ul className="space-y-3 text-xs text-white/50">
              <li className="leading-relaxed font-semibold flex items-start gap-2">
                <FaMapMarkerAlt className="text-teal-500 mt-0.5 flex-shrink-0" />
                102, Apex Mall, Lalkothi, Jaipur, Rajasthan 302015
              </li>
              <li>
                <a href="tel:+919829593852" className="hover:text-teal-400 font-mono font-bold tracking-wide transition-colors flex items-center gap-2">
                  <FaPhoneAlt className="text-teal-500" /> +91 98295 93852
                </a>
              </li>
              <li>
                <a href="mailto:care@homehubhomeopathy.com" className="hover:text-teal-400 font-bold transition-colors flex items-center gap-2">
                  <FaEnvelope className="text-teal-500" /> care@homehubhomeopathy.com
                </a>
              </li>
              <li className="font-semibold text-white/30 pt-1">
                Mon – Sat • 9:00 AM – 8:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/30 font-semibold">
          <p className="flex items-center gap-1">
            © {year} HomeHub Homeopathy Clinic. Made with <FaHeart className="text-rose-400 text-[10px]" /> for natural healing.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
