import type { 
  CarListing, 
  FilterParams, 
  PlatformStats, 
  User, 
  Conversation, 
  Message, 
  Notification, 
  SavedSearch,
  Report 
} from '../types/index.ts';

const API_BASE = '/api';

export const api = {
  // Stats & Rates
  async getStats(): Promise<PlatformStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch platform stats');
    return res.json();
  },

  async getRates(): Promise<{ USD: number; lastUpdated: string }> {
    const res = await fetch(`${API_BASE}/rates`);
    if (!res.ok) throw new Error('Failed to fetch rates');
    return res.json();
  },

  // Listings
  async getListings(params: FilterParams = {}): Promise<{
    listings: CarListing[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '' && val !== null) {
        query.set(key, String(val));
      }
    });

    const res = await fetch(`${API_BASE}/listings?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch listings');
    return res.json();
  },

  async getListingById(id: string): Promise<CarListing & {
    marketValuation?: {
      averagePriceUZS: number;
      sampleSize: number;
      minPriceUZS: number;
      maxPriceUZS: number;
    };
    similarCars?: CarListing[];
  }> {
    const res = await fetch(`${API_BASE}/listings/${id}`);
    if (!res.ok) throw new Error('Failed to fetch listing details');
    return res.json();
  },

  async createListing(listingData: Partial<CarListing>): Promise<CarListing> {
    const res = await fetch(`${API_BASE}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create listing');
    }
    return res.json();
  },

  async updateListing(id: string, listingData: Partial<CarListing>, requesterId?: string, requesterRole?: string): Promise<CarListing> {
    const res = await fetch(`${API_BASE}/listings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...listingData, requesterId, requesterRole }),
    });
    if (!res.ok) throw new Error('Failed to update listing');
    return res.json();
  },

  async updateListingStatus(id: string, status: 'active' | 'reserved' | 'sold' | 'rejected'): Promise<CarListing> {
    const res = await fetch(`${API_BASE}/listings/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update listing status');
    return res.json();
  },

  async deleteListing(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/listings/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete listing');
    return true;
  },

  // Favorites
  async toggleFavorite(userId: string, listingId: string): Promise<{ isFavorite: boolean; favoritesCount: number }> {
    const res = await fetch(`${API_BASE}/favorites/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, listingId }),
    });
    if (!res.ok) throw new Error('Failed to toggle favorite');
    return res.json();
  },

  async getFavorites(userId: string): Promise<CarListing[]> {
    const res = await fetch(`${API_BASE}/favorites/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch favorites');
    return res.json();
  },

  // Saved searches
  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    const res = await fetch(`${API_BASE}/saved-searches/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch saved searches');
    return res.json();
  },

  async saveSearch(userId: string, name: string, params: FilterParams): Promise<SavedSearch> {
    const res = await fetch(`${API_BASE}/saved-searches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, params }),
    });
    if (!res.ok) throw new Error('Failed to save search');
    return res.json();
  },

  async deleteSavedSearch(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/saved-searches/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Auth
  async login(email: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(userData: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async updateProfile(id: string, data: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/profile/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Messages & Conversations
  async getConversations(userId: string): Promise<Conversation[]> {
    const res = await fetch(`${API_BASE}/conversations/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async sendMessage(params: {
    conversationId?: string;
    listingId?: string;
    senderId: string;
    senderName: string;
    text: string;
  }): Promise<{ conversation?: Conversation; message: Message }> {
    const res = await fetch(`${API_BASE}/conversations/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // Reports
  async submitReport(report: Partial<Report>): Promise<void> {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    if (!res.ok) throw new Error('Failed to submit report');
  },

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    const res = await fetch(`${API_BASE}/notifications/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationsRead(userId: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/mark-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  },

  // Admin
  async getAdminReports(): Promise<Report[]> {
    const res = await fetch(`${API_BASE}/admin/reports`);
    if (!res.ok) throw new Error('Failed to fetch admin reports');
    return res.json();
  },

  async resolveReport(id: string, action: 'resolve' | 'dismiss'): Promise<void> {
    await fetch(`${API_BASE}/admin/reports/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async toggleDealerStatus(userId: string): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/toggle-dealer`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to update dealer status');
    return res.json();
  },
};
