import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { doctorService, appointmentService } from '../../api/services.js';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import SearchInput from '../../components/ui/SearchInput.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Modal from '../../components/ui/Modal.jsx';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaClock, FaNotesMedical, FaCheck, FaTimes } from 'react-icons/fa';

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [saving, setSaving] = useState(false);

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
            fetchAppointments(linked._id);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Failed to find doctor profile:', error);
        setLoading(false);
      }
    };
    if (user) findDoctorProfile();
  }, [user]);

  const fetchAppointments = async (doctorId) => {
    setLoading(true);
    try {
      const res = await doctorService.getDoctorAppointments(doctorId);
      if (res?.success) {
        setAppointments(res.data || []);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // Filter & search
  useEffect(() => {
    let result = [...appointments];
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.patientName?.toLowerCase().includes(q) ||
          a.email?.toLowerCase().includes(q) ||
          a.healthConcern?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [appointments, statusFilter, searchTerm]);

  const handleStatusChange = async (appId, newStatus) => {
    setSaving(true);
    try {
      const res = await appointmentService.updateStatus(appId, { status: newStatus });
      if (res?.success) {
        toast.success(`Appointment ${newStatus}`);
        setAppointments((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
        );
        if (selectedApp?._id === appId) {
          setSelectedApp((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  if (!doctorProfile && !loading) {
    return (
      <div className="space-y-6 animate-fadeIn text-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">My Appointments</h1>
          <p className="text-slate-500 text-xs font-semibold">View and manage appointments assigned to you.</p>
        </div>
        <EmptyState
          icon={<FaCalendarAlt className="text-teal-500" />}
          title="Doctor Profile Not Linked"
          description="Your user account is not yet linked to a doctor profile. Please ask an admin to associate your account with your doctor profile to view appointments."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Appointments</h1>
          <p className="text-sm text-slate-500">Manage patient bookings assigned to you.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="pulse-dot pulse-dot-success" />
          <span className="text-slate-500 font-semibold">{appointments.length} total appointments</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by patient name, email, or concern..."
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap cursor-pointer ${
                statusFilter === s
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-teal-600 hover:bg-slate-100'
              }`}
            >
              {s} ({statusCounts[s]})
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20"><Loader size="lg" /></div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
          {filtered.map((app) => (
            <div
              key={app._id}
              onClick={() => { setSelectedApp(app); setNotesText(app.notes || ''); setIsDetailOpen(true); }}
              className="bg-white border border-slate-200/60 hover:border-teal-400/50 hover:shadow-md rounded-xl p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 hover-lift"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                      {app.patientName?.substring(0, 2).toUpperCase() || 'PT'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{app.patientName}</h3>
                      <p className="text-xs text-slate-400 font-semibold">{app.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <p>📅 <span className="font-semibold text-slate-700">{formatDate(app.preferredDate)}</span></p>
                  <p>⏰ <span className="font-semibold text-slate-700">Slot: {app.preferredTime}</span></p>
                </div>

                <div>
                  <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wide">Concern:</h4>
                  <p className="text-sm text-slate-600 mt-1 italic line-clamp-2">"{app.healthConcern}"</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <button className="text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer">
                  View Details
                </button>
                {app.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(app._id, 'confirmed'); }}
                      className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded cursor-pointer flex items-center gap-1"
                    >
                      <FaCheck className="text-[10px]" /> Confirm
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(app._id, 'cancelled'); }}
                      className="text-xs font-bold text-rose-500 hover:bg-rose-50 px-2 py-1 rounded cursor-pointer flex items-center gap-1"
                    >
                      <FaTimes className="text-[10px]" /> Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FaCalendarAlt className="text-teal-500" />}
          title="No appointments found"
          description={
            statusFilter === 'all'
              ? 'No patient appointments have been assigned to you yet.'
              : `No appointments matching status "${statusFilter}".`
          }
        />
      )}

      {/* Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Appointment Details">
        {selectedApp && (
          <div className="space-y-5 text-slate-800">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-sm font-black">
                  {selectedApp.patientName?.substring(0, 2).toUpperCase() || 'PT'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedApp.patientName}</h3>
                  <p className="text-sm text-slate-500">{selectedApp.email}</p>
                </div>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                <FaCalendarAlt className="text-teal-500 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold">Date</span>
                  <span className="text-slate-700 font-semibold text-sm">{formatDate(selectedApp.preferredDate)}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                <FaClock className="text-teal-500 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold">Time Slot</span>
                  <span className="text-slate-700 font-semibold text-sm">{selectedApp.preferredTime}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                <FaPhone className="text-teal-500 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold">Phone</span>
                  <span className="text-slate-700 font-semibold text-sm">{selectedApp.phone || 'Not provided'}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                <FaEnvelope className="text-teal-500 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold">Email</span>
                  <span className="text-slate-700 font-semibold text-sm truncate">{selectedApp.email}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 block uppercase font-bold mb-1">Health Concern</span>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-600 text-sm whitespace-pre-line italic">
                "{selectedApp.healthConcern}"
              </div>
            </div>

            {selectedApp.notes && (
              <div>
                <span className="text-xs text-teal-700 block uppercase font-bold mb-1">Doctor Notes</span>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 text-slate-700 text-sm whitespace-pre-line">
                  {selectedApp.notes}
                </div>
              </div>
            )}

            {/* Status actions */}
            {selectedApp.status !== 'completed' && selectedApp.status !== 'cancelled' && (
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                {selectedApp.status === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(selectedApp._id, 'confirmed')}
                    disabled={saving}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    <FaCheck /> Confirm Appointment
                  </button>
                )}
                {(selectedApp.status === 'pending' || selectedApp.status === 'confirmed') && (
                  <>
                    <button
                      onClick={() => handleStatusChange(selectedApp._id, 'completed')}
                      disabled={saving}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                    >
                      <FaNotesMedical /> Mark Completed
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedApp._id, 'cancelled')}
                      disabled={saving}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
