import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Stats from './components/Stats.jsx'
import About from './components/About.jsx'
import Specializations from './components/Specializations.jsx'
import SuccessStories from './components/SuccessStories.jsx'
import ClaimsBooking from './components/ClaimsBooking.jsx'
import Doctors from './components/Doctors.jsx'
import Services from './components/Services.jsx'
import Reviews from './components/Reviews.jsx'
import FreeConsultation from './components/FreeConsultation.jsx'
import FAQ from './components/FAQ.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFloat from './components/WhatsAppFloat.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import InteractiveBackground from './components/InteractiveBackground.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Treatments from './pages/Treatments.jsx'
import TreatmentDetailPage from './pages/TreatmentDetailPage.jsx'
import DoctorsPage from './pages/DoctorsPage.jsx'
import DoctorDetailPage from './pages/DoctorDetailPage.jsx'
import BookAppointmentPage from './pages/BookAppointmentPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import BlogDetailPage from './pages/BlogDetailPage.jsx'
import SuccessStoriesPage from './pages/SuccessStoriesPage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import FreeConsultationPage from './pages/FreeConsultationPage.jsx'

// Patient Dashboard
import PatientLayout from './pages/patient/PatientLayout.jsx'
import PatientOverview from './pages/patient/PatientOverview.jsx'
import PatientAppointments from './pages/patient/PatientAppointments.jsx'
import PatientProfile from './pages/patient/PatientProfile.jsx'
import PatientReviews from './pages/patient/PatientReviews.jsx'
import PatientNotifications from './pages/patient/PatientNotifications.jsx'

// Doctor Dashboard
import DoctorLayout from './pages/doctor/DoctorLayout.jsx'
import DoctorOverview from './pages/doctor/DoctorOverview.jsx'
import DoctorAppointments from './pages/doctor/DoctorAppointments.jsx'
import DoctorProfile from './pages/doctor/DoctorProfile.jsx'
import DoctorAvailability from './pages/doctor/DoctorAvailability.jsx'
import DoctorPatients from './pages/doctor/DoctorPatients.jsx'
import DoctorReviews from './pages/doctor/DoctorReviews.jsx'

// Admin Dashboard
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminOverview from './pages/admin/AdminOverview.jsx'
import AdminAppointments from './pages/admin/AdminAppointments.jsx'
import AdminDoctors from './pages/admin/AdminDoctors.jsx'
import AdminPatients from './pages/admin/AdminPatients.jsx'
import AdminReviews from './pages/admin/AdminReviews.jsx'
import AdminConsultations from './pages/admin/AdminConsultations.jsx'
import AdminContacts from './pages/admin/AdminContacts.jsx'
import AdminBlogs from './pages/admin/AdminBlogs.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'

import NotFoundPage from './pages/NotFoundPage.jsx'
import { PrivacyPage, TermsPage } from './pages/PrivacyPage.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { useEffect } from 'react'

function Home() {
  // Reveal sections as they scroll into view.
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <main>
      <Hero />
      <Stats />
      <div className="reveal"><About /></div>
      <div className="reveal"><Specializations /></div>
      <div className="reveal"><SuccessStories /></div>
      <div className="reveal"><ClaimsBooking /></div>
      <div className="reveal"><Doctors /></div>
      <div className="reveal"><Services /></div>
      <div className="reveal"><Reviews /></div>
      <div className="reveal"><FreeConsultation /></div>
      <div className="reveal"><FAQ /></div>
    </main>
  )
}

// Component that conditionally renders Footer based on route
function ConditionalFooter() {
  const location = useLocation()
  const dashboardPaths = ['/dashboard', '/doctor', '/admin']
  const isDashboard = dashboardPaths.some((p) => location.pathname.startsWith(p))
  
  if (isDashboard) return null
  return <Footer />
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <InteractiveBackground />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/treatments/:slug" element={<TreatmentDetailPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
          <Route path="/booking" element={<BookAppointmentPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:slug" element={<BlogDetailPage />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/free-consultation" element={<FreeConsultationPage />} />

          {/* Patient Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<PatientOverview />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="reviews" element={<PatientReviews />} />
            <Route path="notifications" element={<PatientNotifications />} />
          </Route>

          {/* Doctor Dashboard */}
          <Route 
            path="/doctor" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<DoctorOverview />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="availability" element={<DoctorAvailability />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="reviews" element={<DoctorReviews />} />
          </Route>

          {/* Admin Dashboard */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<AdminOverview />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="consultations" element={<AdminConsultations />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ConditionalFooter />
        <WhatsAppFloat />
        <ScrollToTop />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
