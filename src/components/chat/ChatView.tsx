import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageSquare, 
  Phone, 
  ExternalLink, 
  Check, 
  User as UserIcon,
  Car
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { api } from '../../services/api.ts';
import type { Conversation, Message, CarListing } from '../../types/index.ts';

interface ChatViewProps {
  initialListing?: CarListing | null;
  onSelectCar: (carId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ initialListing, onSelectCar }) => {
  const { user } = useAuth();
  const { formatPrice, t } = useLanguage();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Load conversations
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.getConversations(user.id)
      .then(res => {
        setConversations(res);
        if (res.length > 0 && !activeConv) {
          setActiveConv(res[0]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  // If initialListing was passed, start or find conversation for it
  useEffect(() => {
    if (initialListing && user) {
      const existing = conversations.find(c => c.listingId === initialListing.id);
      if (existing) {
        setActiveConv(existing);
      } else {
        // Pre-create virtual conversation
        const tempConv: Conversation = {
          id: 'temp-' + Date.now(),
          listingId: initialListing.id,
          listingTitle: initialListing.title,
          listingPriceUZS: initialListing.priceUZS,
          listingImage: initialListing.coverImage,
          buyerId: user.id,
          buyerName: user.name,
          sellerId: initialListing.userId,
          sellerName: initialListing.sellerName,
          lastMessage: '',
          lastMessageTime: new Date().toISOString(),
          unreadCountForUser: 0,
          updatedAt: new Date().toISOString()
        };
        setActiveConv(tempConv);
      }
    }
  }, [initialListing, user]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConv || activeConv.id.startsWith('temp-')) {
      setMessages([]);
      return;
    }

    const fetchMsgs = () => {
      api.getMessages(activeConv.id)
        .then(res => setMessages(res))
        .catch(() => {});
    };

    fetchMsgs();
    const timer = setInterval(fetchMsgs, 4000);
    return () => clearInterval(timer);
  }, [activeConv]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeConv) return;

    const text = newMessage.trim();
    setNewMessage('');

    try {
      const result = await api.sendMessage({
        conversationId: activeConv.id.startsWith('temp-') ? undefined : activeConv.id,
        listingId: activeConv.listingId,
        senderId: user.id,
        senderName: user.name,
        text
      });

      if (result.conversation) {
        setActiveConv(result.conversation);
        setConversations(prev => {
          const filtered = prev.filter(c => c.id !== result.conversation!.id);
          return [result.conversation!, ...filtered];
        });
      }

      setMessages(prev => [...prev, result.message]);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold">Xabarlarni ko'rish uchun tizimga kiring</h2>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-[#161a22] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden h-[75vh] flex flex-col md:flex-row">
        {/* Left List of Conversations */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-[#13161c]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              {t('chatTitle')}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {t('noConversations')}
              </div>
            ) : (
              conversations.map(conv => {
                const isActive = activeConv?.id === conv.id;
                const otherParty = conv.buyerId === user.id ? conv.sellerName : conv.buyerName;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConv(conv)}
                    className={`p-4 cursor-pointer transition flex items-center gap-3 ${
                      isActive ? 'bg-red-50/80 dark:bg-red-950/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <img
                      src={conv.listingImage}
                      alt="car"
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {otherParty}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-red-600 dark:text-red-400 font-medium truncate">
                        {conv.listingTitle}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat Window */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#161a22]">
          {activeConv ? (
            <>
              {/* Header with Listing Preview Card */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#13161c]">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConv.listingImage}
                    alt="car"
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {activeConv.buyerId === user.id ? activeConv.sellerName : activeConv.buyerName}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {activeConv.listingTitle} • <span className="font-bold text-red-600">{formatPrice(activeConv.listingPriceUZS)}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCar(activeConv.listingId)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1 transition"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>E'lonni ko'rish</span>
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-xs text-slate-400 mt-10">
                    Suhbatni boshlash uchun quyida xabar yozing.
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.senderId === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
                            isMe
                              ? 'bg-red-600 text-white rounded-br-xs shadow-md shadow-red-600/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className={`text-[9px] block text-right mt-1 font-mono ${isMe ? 'text-red-200' : 'text-slate-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder={t('typeMessage')}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('send')}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              {t('selectChat')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
