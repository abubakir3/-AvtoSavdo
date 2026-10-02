export type Language = 'uz' | 'ru' | 'en';
export type Currency = 'UZS' | 'USD';

export type BodyType = 
  | 'sedan' 
  | 'suv' 
  | 'crossover' 
  | 'hatchback' 
  | 'minivan' 
  | 'pickup' 
  | 'coupe' 
  | 'wagon';

export type FuelType = 
  | 'petrol' 
  | 'cng'       // Gaz (Metan)
  | 'lpg'       // Gaz (Propan)
  | 'electric' 
  | 'hybrid' 
  | 'diesel';

export type TransmissionType = 
  | 'automatic' 
  | 'manual' 
  | 'robot' 
  | 'variator';

export type DrivetrainType = 'front' | 'rear' | 'awd' | '4wd';

export type CarCondition = 'new' | 'ideal' | 'good' | 'needs_repair';

export type PaintCondition = 'clean' | 'spot' | 'partial_repainted' | 'fully_repainted';

export type SellerType = 'private' | 'dealer';

export type ListingStatus = 'pending' | 'active' | 'reserved' | 'sold' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  telegram?: string;
  avatar?: string;
  role: 'user' | 'dealer' | 'admin';
  isVerifiedDealer: boolean;
  dealerName?: string;
  dealerAddress?: string;
  region: string;
  city: string;
  createdAt: string;
}

export interface CarListing {
  id: string;
  userId: string;
  sellerName: string;
  sellerPhone: string;
  sellerTelegram?: string;
  sellerType: SellerType;
  isVerifiedSeller: boolean;
  dealerName?: string;
  
  // Basic info
  make: string;
  model: string;
  generation?: string;
  year: number;
  bodyType: BodyType;
  color: string;
  
  // Technical specs
  priceUZS: number;
  priceUSD: number;
  isNegotiable: boolean;
  mileage: number; // in km
  engineVolume: number; // e.g. 1.5, 2.0, 0 for EV
  fuelType: FuelType;
  hasCngGaz?: boolean; // Metan gaz bormi
  hasLpgGaz?: boolean; // Propan gaz bormi
  transmission: TransmissionType;
  drivetrain: DrivetrainType;
  condition: CarCondition;
  paintCondition: PaintCondition;
  vin?: string;
  
  // Location
  region: string;
  city: string;
  coordinates?: { lat: number; lng: number };
  
  // Content & Media
  title: string;
  description: string;
  images: string[];
  coverImage: string;
  features: string[]; // e.g., ["Konditsioner", "Magicar pult", "Lyuk", "Kruiz-kontrol", "Koja salon"]
  
  // Status & Metrics
  status: ListingStatus;
  viewsCount: number;
  favoritesCount: number;
  isFeatured?: boolean;
  isDiscounted?: boolean;
  originalPriceUZS?: number;
  rejectionReason?: string;
  
  // Price estimate metrics
  estimatedMarketPriceUZS?: number;
  priceTag?: 'below_market' | 'fair_market' | 'above_market';
  
  createdAt: string;
  updatedAt: string;
}

export interface FilterParams {
  userId?: string;
  search?: string;
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  bodyType?: BodyType | '';
  fuelType?: FuelType | '';
  transmission?: TransmissionType | '';
  drivetrain?: DrivetrainType | '';
  color?: string;
  condition?: CarCondition | '';
  paintCondition?: PaintCondition | '';
  region?: string;
  city?: string;
  sellerType?: SellerType | '';
  onlyWithPhotos?: boolean;
  onlyVerified?: boolean;
  isFeatured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc';
  page?: number;
  limit?: number;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPriceUZS: number;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCountForUser: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'listing_approved' | 'listing_rejected' | 'new_message' | 'price_drop' | 'saved_search' | 'info';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  params: FilterParams;
  createdAt: string;
}

export interface Report {
  id: string;
  listingId: string;
  listingTitle: string;
  reporterId: string;
  reporterEmail: string;
  reason: 'fraud_scam' | 'wrong_price' | 'already_sold' | 'inappropriate' | 'duplicate' | 'other';
  comment: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface PlatformStats {
  totalListings: number;
  activeListings: number;
  totalUsers: number;
  dealersCount: number;
  averagePriceUZS: number;
  topMakes: { make: string; count: number }[];
  soldCount: number;
}
