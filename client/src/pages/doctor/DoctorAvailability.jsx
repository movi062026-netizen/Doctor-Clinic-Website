import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { doctorService } from '../../api/services.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import toast from 'react-hot-toast';
import { FaClock, FaCheck, FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM',
];

export default function DoctorAvailability() {
  const { user } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slots, setSlots] = useState([]);

  // Find the doctor profile linked to this user
  useEffect(() => {
    const findDoctorProfile = async () => {
      try {
        const res = await doctorService.getDoctors({ limit: 100 });
        if (res?.success) {
          const linked = res.data?.find(
            (d) => d.user === user?._id || d.email === user?.email
          );
          if (linked) {
            setDoctorProfile(linked);
            setSlots(linked.availableSlots || []);
          }
        }
      } catch (error) {
        console.error('Failed to find doctor profile:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) findDoctorProfile();
  }, [user]);

  const addSlot = (day) => {
    setSlots((prev) => [...prev, { day, startTime: '09:00 AM', endTime: '05:00 PM', isAvailable: true }]);
  };

  const removeSlot = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSlot = (index, field, value) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleSave = async () => {
    if (!doctorProfile) return;
    setSaving(true);
    try {
      const res = await doctorService.updateAvailability(doctorProfile._id, { availableSlots: slots });
      if (res?.success) {
        toast.success('Availability schedule saved successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20"><Loader size="lg" /></div>;
  }

  if (!doctorProfile) {
    return (
      <div className="space-y-6 animate-fadeIn text-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">Availability Schedule</h1>
          <p className="text-slate-500 text-xs font-semibold">Manage your weekly consultation schedule.</p>
        </div>
        <EmptyState
          icon={<FaClock className="text-teal-500" />}
          title="Doctor Profile Not Linked"
          description="Your user account is not yet linked to a doctor profile. Ask an admin to associate your account to manage your availability schedule."
        />
      </div>
    );
  }

  const slotsByDay = DAYS.map((day) => ({
    day,
    daySlots: slots
      .map((s, i) => ({ ...s, _index: i }))
      .filter((s) => s.day === day),
  }));

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Availability Schedule</h1>
          <p className="text-sm text-slate-500">Set your available days and time slots for patient appointments.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-5 rounded-lg text-sm transition disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm btn-shimmer"
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Schedule'}
        </button>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="space-y-4 stagger-children">
        {slotsByDay.map(({ day, daySlots }) => (
          <div
            key={day}
            className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm hover-lift"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${daySlots.some((s) => s.isAvailable) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <h3 className="font-bold text-slate-800 text-sm">{day}</h3>
                <span className="text-xs text-slate-400 font-semibold">
                  {daySlots.filter((s) => s.isAvailable).length} slot(s) active
                </span>
              </div>
              <button
                onClick={() => addSlot(day)}
                className="text-xs font-bold text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 border border-teal-100 transition"
              >
                <FaPlus className="text-[10px]" /> Add Slot
              </button>
            </div>

            {daySlots.length > 0 ? (
              <div className="space-y-3">
                {daySlots.map((slot) => (
                  <div
                    key={slot._index}
                    className={`flex flex-wrap items-center gap-3 p-3 rounded-lg border transition-all ${
                      slot.isAvailable
                        ? 'bg-emerald-50/50 border-emerald-100'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-500 font-bold">From:</label>
                      <select
                        value={slot.startTime}
                        onChange={(e) => updateSlot(slot._index, 'startTime', e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-teal-500 cursor-pointer"
                      >
                        {TIME_SLOTS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-500 font-bold">To:</label>
                      <select
                        value={slot.endTime}
                        onChange={(e) => updateSlot(slot._index, 'endTime', e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-teal-500 cursor-pointer"
                      >
                        {TIME_SLOTS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer ml-auto">
                      <input
                        type="checkbox"
                        checked={slot.isAvailable}
                        onChange={(e) => updateSlot(slot._index, 'isAvailable', e.target.checked)}
                        className="accent-teal-600 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-600">
                        {slot.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </label>

                    <button
                      onClick={() => removeSlot(slot._index)}
                      className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition cursor-pointer"
                      aria-label="Remove slot"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-semibold italic pl-6">No slots configured — click "Add Slot" to set availability.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
