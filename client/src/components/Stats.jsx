import React, { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView.js';
import { FaUsers, FaUserMd, FaShieldAlt, FaStar } from 'react-icons/fa';

const stats = [
  { num: 200000, suffix: '+', label: 'Happy Patients', icon: <FaUsers />, color: 'from-teal-500 to-teal-600', glow: 'shadow-teal-500/10' },
  { num: 36, suffix: '+', label: 'Certified Doctors', icon: <FaUserMd />, color: 'from-blue-500 to-blue-600', glow: 'shadow-blue-500/10' },
  { num: 100, suffix: '%', label: 'Safe & Natural', icon: <FaShieldAlt />, color: 'from-emerald-500 to-emerald-600', glow: 'shadow-emerald-500/10' },
  { num: 4.9, suffix: '/5', label: 'Patient Rating', decimals: 1, icon: <FaStar />, color: 'from-amber-500 to-amber-600', glow: 'shadow-amber-500/10' },
];

function useCountUp(target, start, { duration = 1400, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    let startedAt;
    const step = (ts) => {
      if (startedAt === undefined) startedAt = ts;
      const progress = Math.min((ts - startedAt) / duration, 1);
      // easeOutCubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString('en-IN');
}

function Stat({ stat, start, index }) {
  const display = useCountUp(stat.num, start, { decimals: stat.decimals || 0 });
  return (
    <div
      className="text-center p-5 md:p-6 rounded-2xl bg-white border border-slate-100/80 shadow-sm hover-lift transition-all group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg ${stat.glow} text-lg group-hover:scale-110 transition-transform`}>
        {stat.icon}
      </div>
      <span className="block text-3xl md:text-4xl font-black text-slate-800 tracking-tight">{display}<span className="text-teal-600">{stat.suffix}</span></span>
      <span className="block text-xs uppercase tracking-wider text-slate-450 font-bold mt-2">{stat.label}</span>
    </div>
  );
}

export default function Stats() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-12 -mt-2 relative z-10" ref={ref}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-stretch">
          {stats.map((s, i) => (
            <Stat key={s.label} stat={s} start={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
