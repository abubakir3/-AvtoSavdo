import React, { useState } from 'react';
import { X, Flag, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { CarListing } from '../../types/index.ts';

interface ReportModalProps {
  listing: CarListing;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ listing, onClose }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [reason, setReason] = useState<'wrong_price' | 'fraud_scam' | 'already_sold' | 'duplicate' | 'other'>('wrong_price');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitReport({
        listingId: listing.id,
        listingTitle: listing.title,
        reporterId: user?.id || 'anon',
        reporterEmail: user?.email || 'anon@mail.uz',
        reason,
        comment
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative bg-white dark:bg-[#161a22] rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {t('reportTitle')}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1">{listing.title}</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-center space-y-2">
            <Check className="w-8 h-8 mx-auto" />
            <p className="font-bold text-sm">{t('reportSuccess')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t('reportReason')}
              </label>
              <div className="space-y-2">
                {[
                  { id: 'wrong_price', label: t('reportWrongPrice') },
                  { id: 'fraud_scam', label: t('reportScam') },
                  { id: 'already_sold', label: t('reportSold') },
                  { id: 'duplicate', label: t('reportDuplicate') },
                  { id: 'other', label: t('reportOther') },
                ].map(r => (
                  <label
                    key={r.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                      reason === r.id
                        ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={() => setReason(r.id as any)}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('reportComment')}
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Qo'shimcha tafsilotlarni yozing..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              {submitting ? 'Yuborilmoqda...' : t('submitReport')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
