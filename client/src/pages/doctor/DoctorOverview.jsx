import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { doctorService } from '../../api/services.js';
import { FaCalendarAlt, FaUsers, FaClock, FaUser, FaStar, FaArrowRight, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

export default function DoctorOverview() {
  const { user } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await doctorService.getDoctors({ limit: 100 });
        if (res?.success) {
          const linked = res.data?.find(
            (d) => d.user === user?._id || d.email === user?.email
          );
          if (linked) {
            setDoctorProfile(linked);
            const apptRes = await doctorService.getDoctorAppointments(linked._id, { limit: 500 });
            if (apptRes?.success) {
              const data = apptRes.data || [];
              setStats({
                total: data.length,
                pending: data.filter((a) => a.status === 'pending').length,
                confirmed: data.filter((a) => a.status === 'confirmed').length,
                completed: data.filter((a) => a.status === 'completed').length,
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading doctor data:', error);
      }
    };
    if (user) loadData();
  }, [user]);

  const quickLinks = [
    { to: '/doctor/appointments', icon: <FaCalendarAlt />, label: 'View Appointments', desc: 'Manage your patient bookings', color: 'border-teal-100 bg-gradient-to-br from-teal-50 to-teal-50/50 text-teal-700 shadow-sm shadow-teal-500/5' },
    { to: '/doctor/patients', icon: <FaUsers />, label: 'Patient Records', desc: 'View patient information', color: 'border-blue-100 bg-gradient-to-br from-blue-50 to-blue-50/50 text-blue-700 shadow-sm shadow-blue-500/5' },
    { to: '/doctor/availability', icon: <FaClock />, label: 'Set Availability', desc: 'Update your schedule', color: 'border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-50/50 text-indigo-750 shadow-sm shadow-indigo-500/5' },
    { to: '/doctor/profile', icon: <FaUser />, label: 'Edit Profile', desc: 'Update your information', color: 'border-amber-100 bg-gradient-to-br from-amber-50 to-amber-50/50 text-amber-700 shadow-sm shadow-amber-500/5' },
    { to: '/doctor/reviews', icon: <FaStar />, label: 'Patient Reviews', desc: 'View feedback from patients', color: 'border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-50/50 text-emerald-700 shadow-sm shadow-emerald-500/5' },
  ];

  const statCards = [
    { label: 'Total Appointments', value: stats.total, icon: <FaCalendarAlt />, color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { label: 'Pending', value: stats.pending, icon: <FaHourglassHalf />, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Confirmed', value: stats.confirmed, icon: <FaCheckCircle />, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Completed', value: stats.completed, icon: <FaCheckCircle />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-850">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-50 via-blue-50/50 to-teal-50/30 border border-teal-100/80 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-teal-500/5 blur-[60px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="pulse-dot pulse-dot-success" />
            <span className="text-xs text-teal-600 font-bold uppercase tracking-wider">Online</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">Welcome back, Dr. {user?.name?.split(' ')[0]}</h1>
          <p className="text-slate-500 text-sm mt-2 font-semibold leading-relaxed max-w-xl">Your clinical dashboard is ready. Manage your appointments, patients, and schedule from here.</p>
        </div>
      </div>

      {/* Stat Cards */}
      {doctorProfile && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm hover-lift">
              <div className={`w-9 h-9 rounded-lg ${card.color} border flex items-center justify-center mb-3`}>
                {card.icon}
              </div>
              <span className="text-2xl font-black text-slate-800 block">{card.value}</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">{card.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to}
            className={`${link.color} border rounded-2xl p-6 hover:scale-[1.01] hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/20 blur-[30px] pointer-events-none" />
            <div className="relative z-10">
              <span className="text-2xl block mb-3 group-hover:scale-110 transition-transform">{link.icon}</span>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                {link.label}
                <FaArrowRight className="text-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-slate-500 text-xs mt-1.5 font-semibold leading-relaxed">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
