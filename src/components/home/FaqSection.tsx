import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "AutoSavdo Pro orqali e'lon berish bepulmi?",
      a: "Ha, jismoniy shaxslar uchun e'lon berish mutlaqo bepul! Avtomobilingizni tezroq sotish uchun VIP yoki tavsiya etilgan e'lonlar qatoriga kiritish xizmatidan ham foydalanishingiz mumkin."
    },
    {
      q: "Avtomobilning 'Bozor narxi' qanday hisoblanadi?",
      a: "Bizning algoritm O'zbekiston bo'ylab xuddi shu marka, model, ishlab chiqarilgan yili va yurgan masofasidagi haqiqiy e'lonlar bazasini solishtirib, real o'rtacha narxlar oralig'ini ko'rsatadi. Bu sizga arzon yoki qimmat narxlanayotganini aniqlashga yordam beradi."
    },
    {
      q: "Avtokredit kalkulyatori foizlari qaysi banklarga asoslangan?",
      a: "Kalkulyator O'zbekistondagi yetakchi tijorat banklarining (O'zsanoatqurilishbank, Ipoteka-bank, Asakabank, Kapitalbank va h.k.) amaldagi birlamchi va ikkilamchi avtokredit stavkalari asosida hisob-kitob qiladi."
    },
    {
      q: "Qanday qilib tasdiqlangan (Verified) sotuvchi yoki diler bo'lish mumkin?",
      a: "Profil sozlamalarida yoki admin orqali shaxsingizni yoki avtosalon hujjatingizni tasdiqlash uchun so'rov yuborishingiz mumkin. Tekshiruvdan o'tgan sotuvchilarga ishonch nishoni (Verified) beriladi."
    },
    {
      q: "Xaridor sotuvchi bilan qanday bog'lanadi?",
      a: "Siz telefon raqamini ko'rish, Telegram orqali to'g'ridan-to'g'ri yozish yoki AutoSavdo Pro saytidagi ichki xabarlar (chat) orqali sotuvchi bilan xavfsiz muloqot qilishingiz mumkin."
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ko'p beriladigan savollar (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            AutoSavdo Pro platformasidan foydalanish bo'yicha eng muhim ma'lumotlar
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#161a22] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-500' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
