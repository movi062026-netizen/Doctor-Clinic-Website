import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { doctorService, reviewService } from '../../api/services.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import toast from 'react-hot-toast';
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft } from 'react-icons/fa';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-amber-500" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-amber-500" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-amber-500/30" />);
    }
  }
  return <div className="flex items-center gap-0.5 text-sm">{stars}</div>;
}

export default function DoctorReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState(null);

  useEffect(() => {
    const findDoctorAndReviews = async () => {
      try {
        // Find the doctor profile for this user
        const res = await doctorService.getDoctors({ limit: 100 });
        if (res?.success) {
          const linked = res.data?.find(
            (d) => d.user === user?._id || d.email === user?.email
          );
          if (linked) {
            setDoctorProfile(linked);
            // Get approved reviews — filter by doctor on client side
            const reviewRes = await reviewService.getReviews();
            if (reviewRes?.success) {
              const doctorReviews = (reviewRes.data || []).filter(
                (r) => r.doctor === linked._id || r.doctor?._id === linked._id
              );
              setReviews(doctorReviews);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    if (user) findDoctorAndReviews();
  }, [user]);

  if (loading) {
    return <div className="py-20"><Loader size="lg" /></div>;
  }

  if (!doctorProfile) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <h1 className="text-2xl font-extrabold text-slate-900">My Reviews</h1>
        <EmptyState
          icon={<FaStar className="text-amber-500" />}
          title="Doctor Profile Not Linked"
          description="Reviews from patients about your consultations will appear here once your profile is linked."
        />
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">My Reviews</h1>
        <p className="text-sm text-slate-500">Patient feedback and ratings for your consultations.</p>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Score */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="text-5xl font-black text-slate-800 block">{avgRating}</span>
                <StarRating rating={parseFloat(avgRating)} />
                <span className="text-xs text-slate-400 font-semibold mt-1 block">{reviews.length} review(s)</span>
              </div>
            </div>

            {/* Distribution Bars */}
            <div className="space-y-2">
              {ratingDistribution.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-bold w-4 text-right">{star}</span>
                  <FaStar className="text-amber-500 text-xs" />
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-semibold w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4 stagger-children">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm hover-lift transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center text-xs font-black flex-shrink-0">
                    {review.initials || review.patientName?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{review.patientName}</h4>
                    <p className="text-xs text-slate-400 font-semibold">{review.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StarRating rating={review.rating} />
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="relative pl-4 border-l-2 border-teal-100">
                <FaQuoteLeft className="absolute -left-2.5 -top-0.5 text-teal-200 text-xs bg-white p-0.5" />
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  {review.text}
                </p>
              </div>

              {review.response && (
                <div className="mt-3 bg-teal-50 border border-teal-100 rounded-lg p-3">
                  <span className="text-[10px] text-teal-600 font-bold uppercase">Your Response:</span>
                  <p className="text-xs text-slate-700 mt-0.5">{review.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FaStar className="text-amber-500" />}
          title="No reviews yet"
          description="Patient reviews for your consultations will appear here once patients leave feedback."
        />
      )}
    </div>
  );
}
