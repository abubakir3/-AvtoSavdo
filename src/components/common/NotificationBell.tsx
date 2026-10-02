import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { api } from '../../services/api.ts';
import type { Notification } from '../../types/index.ts';

export const NotificationBell: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = () => {
    if (!user) return;
    api.getNotifications(user.id)
      .then(res => setNotifications(res))
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    if (!user) return;
    await api.markNotificationsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClickItem = (n: Notification) => {
    setIsOpen(false);
    if (n.link && onNavigate) {
      onNavigate(n.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        title={t('notifications')}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#1a1d24] shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#14171d]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">{t('notifications')}</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-full">
                  {unreadCount} yangi
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition"
              >
                <Check className="w-3.5 h-3.5" />
                O'qilgan deb belgilash
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                Xabarnomalar mavjud emas
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleClickItem(n)}
                  className={`p-4 transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    !n.isRead ? 'bg-red-50/30 dark:bg-red-950/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!n.isRead ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-750 dark:text-slate-300'}`}>
                      {n.title}
                    </p>
                    {n.link && <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                    {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
