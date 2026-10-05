import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { doctorService } from '../../api/services.js';
import SearchInput from '../../components/ui/SearchInput.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Modal from '../../components/ui/Modal.jsx';
import toast from 'react-hot-toast';
import { FaUsers, FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaNotesMedical } from 'react-icons/fa';

export default function DoctorPatients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const findDoctorAndPatients = async () => {
      try {
        const res = await doctorService.getDoctors({ limit: 100 });
        if (res?.success) {
          const linked = res.data?.find(
            (d) => d.user === user?._id || d.email === user?.email
          );
          if (linked) {
            setDoctorProfile(linked);
            // Fetch all appointments for this doctor to extract unique patients
            const apptRes = await doctorService.getDoctorAppointments(linked._id, { limit: 500 });
            if (apptRes?.success) {
              // Extract unique patients from appointments
              const patientMap = new Map();
              (apptRes.data || []).forEach((appt) => {
                const key = appt.email || appt.patientName;
                if (!patientMap.has(key)) {
                  patientMap.set(key, {
                    name: appt.patientName,
                    email: appt.email,
                    phone: appt.phone,
                    user: appt.user,
                    appointments: [],
                  });
                }
                patientMap.get(key).appointments.push(appt);
              });
              setPatients(Array.from(patientMap.values()));
            }
          }
        }
      } catch (error) {
        toast.error('Failed to load patient records');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) findDoctorAndPatients();
  }, [user]);

  // Search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(patients);
    } else {
      const q = searchTerm.toLowerCase();
      setFiltered(
        patients.filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            p.email?.toLowerCase().includes(q) ||
            p.phone?.includes(q)
        )
      );
    }
  }, [patients, searchTerm]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-emerald-500',
      confirmed: 'bg-blue-500',
      pending: 'bg-amber-500',
      cancelled: 'bg-rose-400',
    };
    return colors[status] || 'bg-slate-400';
  };

  if (loading) {
    return <div className="py-20"><Loader size="lg" /></div>;
  }

  if (!doctorProfile) {
    return (
      <div className="space-y-6 animate-fadeIn text-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">My Patients</h1>
        </div>
        <EmptyState
          icon={<FaUsers className="text-teal-500" />}
          title="Doctor Profile Not Linked"
          description="Your user account is not yet linked to a doctor profile. Patient records will appear here once your account is linked and appointments are assigned."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Patients</h1>
          <p className="text-sm text-slate-500">View patients who have consulted with you.</p>
        </div>
        <span className="text-xs text-slate-500 font-semibold bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
          {patients.length} unique patient(s)
        </span>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm">
        <div className="max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by patient name, email, or phone..."
          />
        </div>
      </div>

      {/* Patient List */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {filtered.map((patient, idx) => {
            const totalVisits = patient.appointments.length;
            const completedVisits = patient.appointments.filter((a) => a.status === 'completed').length;
            const lastVisit = patient.appointments.sort((a, b) => new Date(b.preferredDate) - new Date(a.preferredDate))[0];

            return (
              <div
                key={idx}
                onClick={() => { setSelectedPatient(patient); setIsDetailOpen(true); }}
                className="bg-white border border-slate-200/60 hover:border-teal-400/50 hover:shadow-md rounded-xl p-5 transition-all duration-200 cursor-pointer hover-lift"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100 text-teal-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                    {patient.name?.substring(0, 2).toUpperCase() || 'PT'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{patient.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold truncate">{patient.email}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Total Visits</span>
                    <span className="font-bold text-slate-700">{totalVisits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Completed</span>
                    <span className="font-bold text-emerald-600">{completedVisits}</span>
                  </div>
                  {lastVisit && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Last Visit</span>
                      <span className="font-bold text-slate-700">{formatDate(lastVisit.preferredDate)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <button className="text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer">
                    View History →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<FaUsers className="text-teal-500" />}
          title="No patients found"
          description={searchTerm ? 'No patients match your search.' : 'No patient records available yet.'}
        />
      )}

      {/* Patient Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Patient History">
        {selectedPatient && (
          <div className="space-y-5 text-slate-800">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100 text-teal-600 flex items-center justify-center text-lg font-black">
                {selectedPatient.name?.substring(0, 2).toUpperCase() || 'PT'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{selectedPatient.name}</h3>
                <p className="text-sm text-slate-500">{selectedPatient.email}</p>
                {selectedPatient.phone && (
                  <p className="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                    <FaPhone className="text-teal-500" /> {selectedPatient.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">
                Appointment History ({selectedPatient.appointments.length})
              </h4>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {selectedPatient.appointments
                  .sort((a, b) => new Date(b.preferredDate) - new Date(a.preferredDate))
                  .map((appt, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(appt.status)}`} />
                          <span className="text-xs font-bold text-slate-600 uppercase">{appt.status}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-semibold">{formatDate(appt.preferredDate)} • {appt.preferredTime}</span>
                      </div>
                      <p className="text-xs text-slate-600 italic">"{appt.healthConcern}"</p>
                      {appt.notes && (
                        <p className="text-xs text-teal-700 bg-teal-50 p-2 rounded border border-teal-100">
                          <strong>Notes:</strong> {appt.notes}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

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
