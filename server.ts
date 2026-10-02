import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import type { 
  CarListing, 
  User, 
  Conversation, 
  Message, 
  Notification, 
  SavedSearch, 
  Report, 
  PlatformStats,
  FilterParams 
} from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  users: User[];
  listings: CarListing[];
  favorites: { userId: string; listingId: string }[];
  conversations: Conversation[];
  messages: Message[];
  notifications: Notification[];
  savedSearches: SavedSearch[];
  reports: Report[];
  rates: { USD: number; lastUpdated: string };
}

// Initial high-quality seed data for Uzbekistan automotive market
const initialData: DatabaseSchema = {
  rates: {
    USD: 12850,
    lastUpdated: new Date().toISOString()
  },
  users: [
    {
      id: 'user_admin',
      name: 'AutoSavdo Admin',
      email: 'admin@autosavdo.uz',
      phone: '+998 71 200 00 00',
      telegram: '@autosavdo_admin',
      role: 'admin',
      isVerifiedDealer: false,
      region: 'Toshkent shahri',
      city: 'Mirobod tumani',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'user_dealer_1',
      name: 'Samarqand Premium Auto',
      email: 'dealer@samauto.uz',
      phone: '+998 93 333 44 55',
      telegram: '@sam_premium_auto',
      role: 'dealer',
      isVerifiedDealer: true,
      dealerName: 'Samarqand Premium Auto MCHJ',
      dealerAddress: 'Samarqand sh., Mirzo Ulug\'bek ko\'chasi, 42-uy',
      region: 'Samarqand',
      city: 'Samarqand shahri',
      createdAt: '2024-02-15T00:00:00.000Z'
    },
    {
      id: 'user_private_1',
      name: 'Alisher Qodirov',
      email: 'alisher@gmail.com',
      phone: '+998 90 123 45 67',
      telegram: '@alisher_uz',
      role: 'user',
      isVerifiedDealer: false,
      region: 'Toshkent shahri',
      city: 'Chilonzor tumani',
      createdAt: '2024-03-10T00:00:00.000Z'
    }
  ],
  listings: [
    {
      id: 'car-1',
      userId: 'user_private_1',
      sellerName: 'Alisher Qodirov',
      sellerPhone: '+998 90 123 45 67',
      sellerTelegram: '@alisher_uz',
      sellerType: 'private',
      isVerifiedSeller: true,
      make: 'Chevrolet',
      model: 'Cobalt',
      generation: '4-pozitsiya Elegant AT',
      year: 2023,
      bodyType: 'sedan',
      color: 'Oq (Gaz Oq)',
      priceUZS: 158000000,
      priceUSD: 12295,
      isNegotiable: true,
      mileage: 24500,
      engineVolume: 1.5,
      fuelType: 'cng',
      hasCngGaz: true,
      transmission: 'automatic',
      drivetrain: 'front',
      condition: 'ideal',
      paintCondition: 'clean',
      vin: 'XWB7F1968NA******',
      region: 'Toshkent shahri',
      city: 'Chilonzor tumani',
      coordinates: { lat: 41.2721, lng: 69.2044 },
      title: 'Chevrolet Cobalt 4-pozitsiya Elegant AT, Ideal holatda, Metan 4-avlod',
      description: 'Cobalt 4-pozitsiya avtomat. Yili 2023, probeg halol 24 500 km. Bir qo\'l haydalgan, salondan o\'zim olganman. 4-avlod italyan metan gaz uskunasi o\'rnatilgan, texposportda belgisi bor. Magicar 908 pult, yaxshi chexol va 7D poliklar qo\'yilgan. Kraskasi top-toza, har qanday ustada tekshirtirib olishingiz mumkin. Moyi o\'z vaqtida Castrol 5W-30 quyilgan. Narxini mashina ustida kelishamiz.',
      images: [
        'https://images.unsplash.com/photo-1590362891988-3069176378e9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1590362891988-3069176378e9?auto=format&fit=crop&w=1200&q=80',
      features: ['Konditsioner', 'Old o\'rindiqlar isitgichi', 'Elektr oynako\'targichlar', 'Magicar pult', 'Metan gaz 4-avlod', 'ABS tormoz tizimi', 'Bluetooth audio'],
      status: 'active',
      viewsCount: 420,
      favoritesCount: 38,
      isFeatured: true,
      estimatedMarketPriceUZS: 160000000,
      priceTag: 'fair_market',
      createdAt: '2024-09-18T10:30:00.000Z',
      updatedAt: '2024-09-18T10:30:00.000Z'
    },
    {
      id: 'car-2',
      userId: 'user_dealer_1',
      sellerName: 'Samarqand Premium Auto',
      sellerPhone: '+998 93 333 44 55',
      sellerTelegram: '@sam_premium_auto',
      sellerType: 'dealer',
      isVerifiedSeller: true,
      dealerName: 'Samarqand Premium Auto MCHJ',
      make: 'BYD',
      model: 'Song Plus DM-i',
      generation: 'Champion Edition Flagship',
      year: 2024,
      bodyType: 'crossover',
      color: 'Kulrang (Grey Metallic)',
      priceUZS: 365000000,
      priceUSD: 28400,
      isNegotiable: true,
      mileage: 6200,
      engineVolume: 1.5,
      fuelType: 'hybrid',
      transmission: 'automatic',
      drivetrain: 'front',
      condition: 'new',
      paintCondition: 'clean',
      region: 'Samarqand',
      city: 'Samarqand shahri',
      coordinates: { lat: 39.6542, lng: 66.9597 },
      title: 'BYD Song Plus DM-i Champion Edition 110km Flagship, Yangi holatda',
      description: 'Rasmiy avtosalondan sotiladi. BYD Song Plus Champion 2024. 110 km faqat elektrda yurish zaxirasi, gibrid rejimda 1200+ km. Panoramali tom, 360 daraja kamera, shamollatiladigan va isitiladigan charm o\'rindiqlar, adaptiv kruiz-kontrol (L2 avtopilot). To\'liq ruslashtirilgan, sim-karta va ilova ulangan. Kafolat mavjud. Lizing va avtokreditga beriladi.',
      images: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      features: ['Panoramali tom', '360° kamera', 'Adaptiv kruiz-kontrol', 'O\'rindiqlarni shamollatish', 'Simsiz quvvatlash', 'L2 haydovchi yordamchisi', 'Elektr yukxona'],
      status: 'active',
      viewsCount: 890,
      favoritesCount: 74,
      isFeatured: true,
      isDiscounted: true,
      originalPriceUZS: 375000000,
      estimatedMarketPriceUZS: 370000000,
      priceTag: 'below_market',
      createdAt: '2024-09-20T14:15:00.000Z',
      updatedAt: '2024-09-20T14:15:00.000Z'
    },
    {
      id: 'car-3',
      userId: 'user_private_1',
      sellerName: 'Alisher Qodirov',
      sellerPhone: '+998 90 123 45 67',
      sellerTelegram: '@alisher_uz',
      sellerType: 'private',
      isVerifiedSeller: true,
      make: 'Chevrolet',
      model: 'Tracker',
      generation: 'Premier 2.0 Redline',
      year: 2024,
      bodyType: 'crossover',
      color: 'Qora (Black Pearl)',
      priceUZS: 235000000,
      priceUSD: 18280,
      isNegotiable: true,
      mileage: 11000,
      engineVolume: 1.2,
      fuelType: 'petrol',
      transmission: 'automatic',
      drivetrain: 'front',
      condition: 'ideal',
      paintCondition: 'clean',
      region: 'Toshkent shahri',
      city: 'Yakkasaroy tumani',
      coordinates: { lat: 41.2847, lng: 69.2562 },
      title: 'Chevrolet Tracker Premier Redline 2024, Full pozitsiya, Holati a\'lo',
      description: 'Tracker 2 Premier to\'liq komplektatsiya. Qora rang, panorama lyuk, charm salon, o\'rindiqlar isitish, ko\'r zonalarni nazorat qilish, Apple CarPlay va Android Auto. Faqat 95 benzin quyilgan, moyi yangi almashtirildi. Zudlik bilan sotiladi, kelishiladi.',
      images: [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      features: ['Panorama lyuk', 'Charm salon', 'Kruiz-kontrol', 'Orqa kamera va parktroniklar', 'Ko\'r zonalar sensori', 'Klimat-kontrol'],
      status: 'active',
      viewsCount: 512,
      favoritesCount: 41,
      isFeatured: false,
      estimatedMarketPriceUZS: 238000000,
      priceTag: 'fair_market',
      createdAt: '2024-09-22T09:00:00.000Z',
      updatedAt: '2024-09-22T09:00:00.000Z'
    },
    {
      id: 'car-4',
      userId: 'user_dealer_1',
      sellerName: 'Samarqand Premium Auto',
      sellerPhone: '+998 93 333 44 55',
      sellerTelegram: '@sam_premium_auto',
      sellerType: 'dealer',
      isVerifiedSeller: true,
      dealerName: 'Samarqand Premium Auto MCHJ',
      make: 'Kia',
      model: 'K5',
      generation: 'GT-Line 2.5 GDI',
      year: 2023,
      bodyType: 'sedan',
      color: 'Oq dur (Snow White Pearl)',
      priceUZS: 410000000,
      priceUSD: 31900,
      isNegotiable: false,
      mileage: 18000,
      engineVolume: 2.5,
      fuelType: 'petrol',
      transmission: 'automatic',
      drivetrain: 'front',
      condition: 'ideal',
      paintCondition: 'clean',
      region: 'Samarqand',
      city: 'Samarqand shahri',
      coordinates: { lat: 39.6600, lng: 66.9700 },
      title: 'Kia K5 GT-Line 2.5L 2023, Qizil salon, Head-up display, To\'liq komplektatsiya',
      description: 'Rasmiy Kia Uzbekistan kafolatida turgan avtomobil. 2.5 litr 194 ot kuchi, 8 bosqichli avtomat. Sport qizil charm salon, panorama lyuk, proeksiya (HUD), Bose audio tizimi, 360 kamera. Hech qanday tirnalgan yoki bo\'yalgan joyi yo\'q.',
      images: [
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      features: ['Bose Premium Audio', 'Head-up display', 'Panorama tom', 'Qizil sport charm', 'Kruiz-kontrol', 'Ko\'p zonali iqlim nazorati'],
      status: 'active',
      viewsCount: 730,
      favoritesCount: 65,
      isFeatured: true,
      estimatedMarketPriceUZS: 420000000,
      priceTag: 'below_market',
      createdAt: '2024-09-24T12:00:00.000Z',
      updatedAt: '2024-09-24T12:00:00.000Z'
    },
    {
      id: 'car-5',
      userId: 'user_private_1',
      sellerName: 'Alisher Qodirov',
      sellerPhone: '+998 90 123 45 67',
      sellerTelegram: '@alisher_uz',
      sellerType: 'private',
      isVerifiedSeller: true,
      make: 'Chevrolet',
      model: 'Gentra (Lacetti)',
      generation: '3-pozitsiya CDX Elegant Plus',
      year: 2022,
      bodyType: 'sedan',
      color: 'Mokriy Asfalt (GAN)',
      priceUZS: 165000000,
      priceUSD: 12840,
      isNegotiable: true,
      mileage: 48000,
      engineVolume: 1.5,
      fuelType: 'cng',
      hasCngGaz: true,
      transmission: 'automatic',
      drivetrain: 'front',
      condition: 'good',
      paintCondition: 'spot',
      region: 'Farg\'ona',
      city: 'Farg\'ona shahri',
      coordinates: { lat: 40.3842, lng: 71.7843 },
      title: 'Chevrolet Gentra 3-pozitsiya Avtomat, Lyuk, ABS bor, 1 ta petno bor',
      description: 'Gentra 3-pozitsiya avtomat. Yili 2022 oxiri. Lyuk, ABS, diskalari zavod 15. 100 talik gaz balon o\'rnatilgan. O\'ng orqa kriloda mayda petnosi bor, qolgan joyi toza. Texnik jihatdan motor, karobka xodovoy a\'lo holatda. O\'zimiz uchun minilgan oilaviy moshina.',
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      features: ['Lyuk', 'ABS', 'Avtomat quti', 'Metan gaz 100L', 'Konditsioner', 'Oynalar isitish'],
      status: 'active',
      viewsCount: 610,
      favoritesCount: 29,
      isFeatured: false,
      estimatedMarketPriceUZS: 168000000,
      priceTag: 'fair_market',
      createdAt: '2024-09-25T16:20:00.000Z',
      updatedAt: '2024-09-25T16:20:00.000Z'
    },
    {
      id: 'car-6',
      userId: 'user_dealer_1',
      sellerName: 'Samarqand Premium Auto',
      sellerPhone: '+998 93 333 44 55',
      sellerTelegram: '@sam_premium_auto',
      sellerType: 'dealer',
      isVerifiedSeller: true,
      dealerName: 'Samarqand Premium Auto MCHJ',
      make: 'Toyota',
      model: 'Land Cruiser Prado',
      generation: '150 Restyling 2 TX-L',
      year: 2021,
      bodyType: 'suv',
      color: 'Oq marvarid',
      priceUZS: 790000000,
      priceUSD: 61470,
      isNegotiable: true,
      mileage: 52000,
      engineVolume: 4.0,
      fuelType: 'petrol',
      transmission: 'automatic',
      drivetrain: '4wd',
      condition: 'ideal',
      paintCondition: 'clean',
      region: 'Toshkent shahri',
      city: 'Mirzo Ulug\'bek tumani',
      coordinates: { lat: 41.3283, lng: 69.3243 },
      title: 'Toyota Land Cruiser Prado 4.0 V6 TX-L 2021, Yapon yig\'uvi, Ideal',
      description: 'Toyota Prado 4.0 litrlik afsonaviy ishonchli motor (1GR-FE). 7 o\'rindiqli, muzlatgich (cool box), pnevma podveska, 3 zonali klimat, to\'liq LED optika. Butun kuzovda bir tomchi ham bo\'yoq yo\'q. Dubay emas, Yaponiyada yig\'ilgan.',
      images: [
        'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
      features: ['4WD to\'liq privod', '7 o\'rindiqli salon', 'Muzlatgich (Cool box)', 'Kruiz-kontrol', 'Parktroniklar', 'Pnevma podveska'],
      status: 'active',
      viewsCount: 1120,
      favoritesCount: 92,
      isFeatured: true,
      estimatedMarketPriceUZS: 810000000,
      priceTag: 'fair_market',
      createdAt: '2024-09-26T11:40:00.000Z',
      updatedAt: '2024-09-26T11:40:00.000Z'
    },
    {
      id: 'car-7',
      userId: 'user_dealer_1',
      sellerName: 'Samarqand Premium Auto',
      sellerPhone: '+998 93 333 44 55',
      sellerTelegram: '@sam_premium_auto',
      sellerType: 'dealer',
      isVerifiedSeller: true,
      dealerName: 'Samarqand Premium Auto MCHJ',
      make: 'Tesla',
      model: 'Model Y',
      generation: 'Long Range Dual Motor AWD',
      year: 2023,
      bodyType: 'crossover',
      color: 'Ko\'k (Deep Blue Metallic)',
      priceUZS: 545000000,
      priceUSD: 42410,
      isNegotiable: true,
      mileage: 14000,
      engineVolume: 0,
      fuelType: 'electric',
      transmission: 'automatic',
      drivetrain: 'awd',
      condition: 'ideal',
      paintCondition: 'clean',
      region: 'Toshkent shahri',
      city: 'Yunusobod tumani',
      coordinates: { lat: 41.3654, lng: 69.2882 },
      title: 'Tesla Model Y Long Range AWD 2023, 530km zaxira, Yangi dasturiy ta\'minot',
      description: 'Germaniya (Berlin Gigafactory) zavodida ishlab chiqarilgan. Long Range to\'liq privod. Bir quvvatlanishda 530 km yuradi. Oq premium interyer, avtopilot yoqilgan, 20 dyuymli Induction diska. Uyda quvvatlash moslamasi (Wall connector 7kW) sovg\'a qilinadi.',
      images: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
      features: ['Elektr dvigatel (0-100km/soat 4.8s)', 'To\'liq shisha tom', 'Avtopilot', 'Oq charm salon', 'Premium audio', 'CCS2 tezkor quvvatlash'],
      status: 'active',
      viewsCount: 940,
      favoritesCount: 88,
      isFeatured: true,
      isDiscounted: true,
      originalPriceUZS: 565000000,
      estimatedMarketPriceUZS: 550000000,
      priceTag: 'below_market',
      createdAt: '2024-09-27T08:15:00.000Z',
      updatedAt: '2024-09-27T08:15:00.000Z'
    },
    {
      id: 'car-8',
      userId: 'user_private_1',
      sellerName: 'Alisher Qodirov',
      sellerPhone: '+998 90 123 45 67',
      sellerTelegram: '@alisher_uz',
      sellerType: 'private',
      isVerifiedSeller: true,
      make: 'Chevrolet',
      model: 'Onix',
      generation: 'Premier 2 Turbo',
      year: 2023,
      bodyType: 'sedan',
      color: 'To\'q kulrang (Dark Grey)',
      priceUZS: 185000000,
      priceUSD: 14390,
      isNegotiable: true,
      mileage: 19500,
      engineVolume: 1.2,
      fuelType: 'petrol',
      transmission: 'automatic',
      drivetrain: 'front',
      condition: 'ideal',
      paintCondition: 'clean',
      region: 'Buxoro',
      city: 'Buxoro shahri',
      coordinates: { lat: 39.7747, lng: 64.4286 },
      title: 'Chevrolet Onix Premier 2 Turbo AT 2023, Lyuk, Simsiz quvvatlagich, Toza',
      description: 'Onix Premier 2 - eng to\'liq versiya. Yarim avtomat parkovkaga ega (o\'zi parkovka qiladi), ko\'r nuqtalarni ogohlantirish, simsiz zaryadlash, lyuk, orqa va old o\'rindiqlar isitgichi. Holati yangidek, kraskasi toza. Buxoroda ko\'rishingiz mumkin.',
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      features: ['Avto-parkovka yordamchisi', 'Lyuk', 'Simsiz quvvatlash', '4 ta o\'rindiq isitgichi', 'Klimat-kontrol', 'Start/Stop tugmasi'],
      status: 'active',
      viewsCount: 380,
      favoritesCount: 31,
      isFeatured: false,
      estimatedMarketPriceUZS: 187000000,
      priceTag: 'fair_market',
      createdAt: '2024-09-28T13:40:00.000Z',
      updatedAt: '2024-09-28T13:40:00.000Z'
    },
    {
      id: 'car-9',
      userId: 'user_dealer_1',
      sellerName: 'Samarqand Premium Auto',
      sellerPhone: '+998 93 333 44 55',
      sellerTelegram: '@sam_premium_auto',
      sellerType: 'dealer',
      isVerifiedSeller: true,
      dealerName: 'Samarqand Premium Auto MCHJ',
      make: 'Chevrolet',
      model: 'Tahoe',
      generation: 'Premier 6.2L V8',
      year: 2022,
      bodyType: 'suv',
      color: 'Qora (Onyx Black)',
      priceUZS: 990000000,
      priceUSD: 77040,
      isNegotiable: true,
      mileage: 32000,
      engineVolume: 6.2,
      fuelType: 'petrol',
      transmission: 'automatic',
      drivetrain: '4wd',
      condition: 'ideal',
      paintCondition: 'clean',
      region: 'Toshkent shahri',
      city: 'Shayxontohur tumani',
      coordinates: { lat: 41.3200, lng: 69.2400 },
      title: 'Chevrolet Tahoe Premier 6.2 V8 4WD, Pnevma podveska, 7 o\'rindiq, VIP',
      description: 'Amerika afsonasi Tahoe Premier. 6.2 litrlik 426 ot kuchiga ega V8 EcoTec dvigatel, 10 bosqichli avtomat. Pnevmatik osma (Air Ride), panoramali tom, proeksiya, orqa yo\'lovchilar uchun ikkita monitor, elektr pogonojkalar.',
      images: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      features: ['Air Ride pnevma osma', 'Elektr podnojkalar', 'Bose 10 karnay', 'Orqa monitorlar', 'Panorama tom', 'V8 dvigatel 426 o.k.'],
      status: 'active',
      viewsCount: 1450,
      favoritesCount: 110,
      isFeatured: true,
      estimatedMarketPriceUZS: 1020000000,
      priceTag: 'below_market',
      createdAt: '2024-09-29T15:00:00.000Z',
      updatedAt: '2024-09-29T15:00:00.000Z'
    },
    {
      id: 'car-10',
      userId: 'user_private_1',
      sellerName: 'Alisher Qodirov',
      sellerPhone: '+998 90 123 45 67',
      sellerTelegram: '@alisher_uz',
      sellerType: 'private',
      isVerifiedSeller: true,
      make: 'Chevrolet',
      model: 'Damas',
      generation: 'D2 Van Deluxe',
      year: 2024,
      bodyType: 'minivan',
      color: 'Oq',
      priceUZS: 98000000,
      priceUSD: 7626,
      isNegotiable: true,
      mileage: 3800,
      engineVolume: 0.8,
      fuelType: 'cng',
      hasCngGaz: true,
      transmission: 'manual',
      drivetrain: 'rear',
      condition: 'new',
      paintCondition: 'clean',
      region: 'Andijon',
      city: 'Andijon shahri',
      coordinates: { lat: 40.7821, lng: 72.3442 },
      title: 'Chevrolet Damas D2 2024, Yangi salondan chiqqan, Metan gaz o\'rnatilgan',
      description: 'Damas 2024 yil. Salondan olingan, 3800 km yurgan, ishda ishlatilmagan, faqat oilada minilgan. 65 talik metan gaz balon yangi qo\'yilgan. Chexol, polik va salon qoraytirilgan (ruxsatnomasi bor).',
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      features: ['Metan gaz balon', 'Pult Magicar', 'Chexol va polik', 'Tonirovka ruxsatnomasi bilan'],
      status: 'active',
      viewsCount: 520,
      favoritesCount: 22,
      isFeatured: false,
      estimatedMarketPriceUZS: 99000000,
      priceTag: 'fair_market',
      createdAt: '2024-09-30T10:10:00.000Z',
      updatedAt: '2024-09-30T10:10:00.000Z'
    },
    {
      id: 'car-11',
      userId: 'user_dealer_1',
      sellerName: 'Samarqand Premium Auto',
      sellerPhone: '+998 93 333 44 55',
      sellerTelegram: '@sam_premium_auto',
      sellerType: 'dealer',
      isVerifiedSeller: true,
      dealerName: 'Samarqand Premium Auto MCHJ',
      make: 'BMW',
      model: '5 Series (530i/520i)',
      generation: 'G30 LCI M Sport Package',
      year: 2021,
      bodyType: 'sedan',
      color: 'Qora safir (Black Sapphire)',
      priceUZS: 620000000,
      priceUSD: 48250,
      isNegotiable: true,
      mileage: 38000,
      engineVolume: 2.0,
      fuelType: 'petrol',
      transmission: 'automatic',
      drivetrain: 'rear',
      condition: 'ideal',
      paintCondition: 'clean',
      region: 'Toshkent shahri',
      city: 'Mirobod tumani',
      coordinates: { lat: 41.2995, lng: 69.2778 },
      title: 'BMW 530i G30 LCI M Sport 2021, Restyling, M-paket, Harman Kardon',
      description: 'Restayling BMW 530i M Sport. Zavodskoy M aerodinamik paket, 19 M diskalar, Harman/Kardon audiotizimi, BMW Laserlight faralar, lyuk, to\'liq raqamli panel (Live Cockpit Professional). Avtomobil rasmiy servisda tekshirilgan, ideal.',
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      features: ['BMW Laserlight', 'M Sport paket', 'Harman/Kardon audio', 'Live Cockpit Professional', 'Kruiz-kontrol', 'Sport o\'rindiqlar'],
      status: 'active',
      viewsCount: 880,
      favoritesCount: 79,
      isFeatured: true,
      estimatedMarketPriceUZS: 630000000,
      priceTag: 'fair_market',
      createdAt: '2024-10-01T07:20:00.000Z',
      updatedAt: '2024-10-01T07:20:00.000Z'
    },
    {
      id: 'car-12',
      userId: 'user_dealer_1',
      sellerName: 'Samarqand Premium Auto',
      sellerPhone: '+998 93 333 44 55',
      sellerTelegram: '@sam_premium_auto',
      sellerType: 'dealer',
      isVerifiedSeller: true,
      dealerName: 'Samarqand Premium Auto MCHJ',
      make: 'BYD',
      model: 'Chazor (Destroyer 05)',
      generation: '120km Deluxe',
      year: 2023,
      bodyType: 'sedan',
      color: 'Oq (Snow White)',
      priceUZS: 245000000,
      priceUSD: 19060,
      isNegotiable: true,
      mileage: 16500,
      engineVolume: 1.5,
      fuelType: 'hybrid',
      transmission: 'automatic',
      drivetrain: 'front',
      condition: 'ideal',
      paintCondition: 'clean',
      region: 'Namangan',
      city: 'Namangan shahri',
      coordinates: { lat: 40.9983, lng: 71.6726 },
      title: 'BYD Chazor DM-i 120km Deluxe 2023, Ekonomik gibrid, 100km ga 3.8L',
      description: 'Juda tejamkor va qulay gibrid sedan. 100 km masofaga o\'rtacha 3.8 - 4.2 litr benzin sarflaydi. 120 km faqat akkumulyatorda yura oladi. Konditsioner, aylanuvchi sensorli ekran, 360 kamera, shinam salon. Mashina a\'lo holatda.',
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      features: ['DM-i super gibrid tizimi', 'Aylanuvchi multimedia', '360° kamera', 'Kruiz-kontrol', 'Elektr boshqaruv', 'Start/Stop'],
      status: 'active',
      viewsCount: 470,
      favoritesCount: 36,
      isFeatured: false,
      estimatedMarketPriceUZS: 250000000,
      priceTag: 'fair_market',
      createdAt: '2024-10-01T14:30:00.000Z',
      updatedAt: '2024-10-01T14:30:00.000Z'
    }
  ],
  favorites: [
    { userId: 'user_private_1', listingId: 'car-2' },
    { userId: 'user_private_1', listingId: 'car-7' }
  ],
  conversations: [
    {
      id: 'conv-1',
      listingId: 'car-1',
      listingTitle: 'Chevrolet Cobalt 4-pozitsiya Elegant AT, Ideal holatda',
      listingPriceUZS: 158000000,
      listingImage: 'https://images.unsplash.com/photo-1590362891988-3069176378e9?auto=format&fit=crop&w=600&q=80',
      buyerId: 'user_dealer_1',
      buyerName: 'Samarqand Premium Auto',
      sellerId: 'user_private_1',
      sellerName: 'Alisher Qodirov',
      lastMessage: 'Assalomu alaykum, Cobalt bo\'yicha 154 mln ga kelishamizmi?',
      lastMessageTime: '2024-10-01T18:30:00.000Z',
      unreadCountForUser: 1,
      updatedAt: '2024-10-01T18:30:00.000Z'
    }
  ],
  messages: [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'user_dealer_1',
      senderName: 'Samarqand Premium Auto',
      text: 'Assalomu alaykum, Cobalt bo\'yicha 154 mln ga kelishamizmi?',
      createdAt: '2024-10-01T18:30:00.000Z',
      isRead: false
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      userId: 'user_private_1',
      title: 'E\'loningiz muvaffaqiyatli tasdiqlandi',
      message: 'Chevrolet Cobalt avtomobilingiz saytda faol ko\'rinishda!',
      type: 'listing_approved',
      link: '/cars/car-1',
      isRead: false,
      createdAt: '2024-09-18T10:35:00.000Z'
    },
    {
      id: 'notif-2',
      userId: 'user_private_1',
      title: 'Yangi xabar keldi',
      message: 'Cobalt avtomobilingiz bo\'yicha yangi taklif bor.',
      type: 'new_message',
      link: '/chat',
      isRead: false,
      createdAt: '2024-10-01T18:30:00.000Z'
    }
  ],
  savedSearches: [
    {
      id: 'search-1',
      userId: 'user_private_1',
      name: 'Cobalt va Gentra Toshkent',
      params: {
        make: 'Chevrolet',
        region: 'Toshkent shahri',
        priceMax: 170000000
      },
      createdAt: '2024-09-20T12:00:00.000Z'
    }
  ],
  reports: []
};

// Database helper functions
function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json, returning initialData:', err);
    return initialData;
  }
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

// REST API Endpoints

// 1. Health check & currency rates
app.get('/api/rates', (_req, res) => {
  const db = loadDatabase();
  res.json(db.rates);
});

// 2. Real database-backed platform statistics
app.get('/api/stats', (_req, res) => {
  const db = loadDatabase();
  const activeListings = db.listings.filter(l => l.status === 'active');
  const soldCount = db.listings.filter(l => l.status === 'sold').length;
  
  const totalPrice = activeListings.reduce((sum, item) => sum + (item.priceUZS || 0), 0);
  const avgPrice = activeListings.length > 0 ? Math.round(totalPrice / activeListings.length) : 0;
  
  // Make counts
  const makeCounts: Record<string, number> = {};
  activeListings.forEach(l => {
    makeCounts[l.make] = (makeCounts[l.make] || 0) + 1;
  });
  const topMakes = Object.entries(makeCounts)
    .map(([make, count]) => ({ make, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const stats: PlatformStats = {
    totalListings: db.listings.length,
    activeListings: activeListings.length,
    totalUsers: db.users.length,
    dealersCount: db.users.filter(u => u.role === 'dealer' || u.isVerifiedDealer).length,
    averagePriceUZS: avgPrice,
    topMakes,
    soldCount
  };

  res.json(stats);
});

// 3. Listings - Advanced Search, Filtering, Sorting & Pagination
app.get('/api/listings', (req, res) => {
  const db = loadDatabase();
  const query = req.query as Record<string, string>;

  let results = db.listings.filter(l => {
    // Hide rejected or draft listings for public, unless requested specifically
    if (query.status) {
      if (l.status !== query.status) return false;
    } else {
      if (l.status === 'rejected') return false;
    }

    if (query.userId && l.userId !== query.userId) {
      return false;
    }

    // Text search (search in title, make, model, description, city)
    if (query.search) {
      const q = query.search.toLowerCase().trim();
      const match = 
        l.title.toLowerCase().includes(q) ||
        l.make.toLowerCase().includes(q) ||
        l.model.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Filters
    if (query.make && l.make.toLowerCase() !== query.make.toLowerCase()) return false;
    if (query.model && l.model.toLowerCase() !== query.model.toLowerCase()) return false;
    
    if (query.yearMin && l.year < parseInt(query.yearMin)) return false;
    if (query.yearMax && l.year > parseInt(query.yearMax)) return false;
    
    if (query.priceMin && l.priceUZS < parseInt(query.priceMin)) return false;
    if (query.priceMax && l.priceUZS > parseInt(query.priceMax)) return false;
    
    if (query.mileageMin && l.mileage < parseInt(query.mileageMin)) return false;
    if (query.mileageMax && l.mileage > parseInt(query.mileageMax)) return false;
    
    if (query.bodyType && l.bodyType !== query.bodyType) return false;
    if (query.fuelType && l.fuelType !== query.fuelType) return false;
    if (query.transmission && l.transmission !== query.transmission) return false;
    if (query.drivetrain && l.drivetrain !== query.drivetrain) return false;
    if (query.condition && l.condition !== query.condition) return false;
    if (query.paintCondition && l.paintCondition !== query.paintCondition) return false;
    if (query.region && l.region !== query.region) return false;
    if (query.city && l.city !== query.city) return false;
    if (query.sellerType && l.sellerType !== query.sellerType) return false;

    if (query.isFeatured === 'true' && !l.isFeatured) return false;
    if (query.isDiscounted === 'true' && !l.isDiscounted) return false;
    if (query.onlyVerified === 'true' && !l.isVerifiedSeller) return false;
    if (query.onlyWithPhotos === 'true' && (!l.images || l.images.length === 0)) return false;

    return true;
  });

  // Sorting
  const sort = query.sort || 'newest';
  results.sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return a.priceUZS - b.priceUZS;
      case 'price_desc':
        return b.priceUZS - a.priceUZS;
      case 'year_desc':
        return b.year - a.year;
      case 'mileage_asc':
        return a.mileage - b.mileage;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const total = results.length;
  const page = parseInt(query.page || '1') || 1;
  const limit = parseInt(query.limit || '20') || 20;
  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + limit);

  res.json({
    listings: paginatedResults,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  });
});

// 4. Single listing by ID
app.get('/api/listings/:id', (req, res) => {
  const db = loadDatabase();
  const listing = db.listings.find(l => l.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  // Increment view counter
  listing.viewsCount = (listing.viewsCount || 0) + 1;
  saveDatabase(db);

  // Compute market valuation range based on average of same make/model/year in db
  const similarCars = db.listings.filter(
    l => l.id !== listing.id && l.make === listing.make && l.model === listing.model
  );
  let marketAvg = listing.priceUZS;
  if (similarCars.length > 0) {
    const total = similarCars.reduce((acc, c) => acc + c.priceUZS, 0);
    marketAvg = Math.round(total / similarCars.length);
  }

  res.json({
    ...listing,
    marketValuation: {
      averagePriceUZS: marketAvg,
      sampleSize: similarCars.length + 1,
      minPriceUZS: Math.min(...similarCars.map(c => c.priceUZS), listing.priceUZS),
      maxPriceUZS: Math.max(...similarCars.map(c => c.priceUZS), listing.priceUZS),
    },
    similarCars: similarCars.slice(0, 4)
  });
});

// 5. Create new listing
app.post('/api/listings', (req, res) => {
  const db = loadDatabase();
  const payload = req.body;

  if (!payload.make || !payload.model || !payload.year || !payload.priceUZS || !payload.sellerPhone) {
    return res.status(400).json({ error: 'Missing required listing fields' });
  }

  const rate = db.rates.USD || 12850;
  const priceUSD = payload.priceUSD || Math.round(payload.priceUZS / rate);

  const newListing: CarListing = {
    id: 'car-' + Date.now(),
    userId: payload.userId || 'user_guest',
    sellerName: payload.sellerName || 'Foydalanuvchi',
    sellerPhone: payload.sellerPhone,
    sellerTelegram: payload.sellerTelegram,
    sellerType: payload.sellerType || 'private',
    isVerifiedSeller: payload.isVerifiedSeller || false,
    dealerName: payload.dealerName,
    
    make: payload.make,
    model: payload.model,
    generation: payload.generation || '',
    year: parseInt(payload.year),
    bodyType: payload.bodyType || 'sedan',
    color: payload.color || 'Oq',
    
    priceUZS: parseInt(payload.priceUZS),
    priceUSD,
    isNegotiable: payload.isNegotiable !== undefined ? payload.isNegotiable : true,
    mileage: parseInt(payload.mileage || 0),
    engineVolume: parseFloat(payload.engineVolume || 1.5),
    fuelType: payload.fuelType || 'petrol',
    hasCngGaz: payload.hasCngGaz || false,
    hasLpgGaz: payload.hasLpgGaz || false,
    transmission: payload.transmission || 'automatic',
    drivetrain: payload.drivetrain || 'front',
    condition: payload.condition || 'ideal',
    paintCondition: payload.paintCondition || 'clean',
    vin: payload.vin || '',
    
    region: payload.region || 'Toshkent shahri',
    city: payload.city || 'Toshkent',
    coordinates: payload.coordinates || { lat: 41.2995, lng: 69.2401 },
    
    title: payload.title || `${payload.make} ${payload.model} ${payload.year}`,
    description: payload.description || '',
    images: payload.images && payload.images.length > 0 ? payload.images : [
      'https://images.unsplash.com/photo-1590362891988-3069176378e9?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage: payload.coverImage || (payload.images && payload.images[0]) || 'https://images.unsplash.com/photo-1590362891988-3069176378e9?auto=format&fit=crop&w=1200&q=80',
    features: payload.features || ['Konditsioner', 'ABS'],
    
    // Auto-approve or set pending based on role
    status: 'active',
    viewsCount: 1,
    favoritesCount: 0,
    estimatedMarketPriceUZS: parseInt(payload.priceUZS),
    priceTag: 'fair_market',
    
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.listings.unshift(newListing);

  // Add notification to user
  db.notifications.unshift({
    id: 'notif-' + Date.now(),
    userId: newListing.userId,
    title: 'E\'lon joylashtirildi',
    message: `${newListing.title} muvaffaqiyatli chop etildi!`,
    type: 'listing_approved',
    link: `/cars/${newListing.id}`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  saveDatabase(db);
  res.status(201).json(newListing);
});

// 6. Update listing
app.put('/api/listings/:id', (req, res) => {
  const db = loadDatabase();
  const index = db.listings.findIndex(l => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const existing = db.listings[index];
  const payload = req.body;

  // Simple permission check
  if (payload.requesterId && payload.requesterRole !== 'admin' && existing.userId !== payload.requesterId) {
    return res.status(403).json({ error: 'Unauthorized to edit this listing' });
  }

  const updated: CarListing = {
    ...existing,
    ...payload,
    id: existing.id,
    userId: existing.userId,
    updatedAt: new Date().toISOString()
  };

  db.listings[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

// 7. Update listing status (sold / reserved / active)
app.post('/api/listings/:id/status', (req, res) => {
  const db = loadDatabase();
  const listing = db.listings.find(l => l.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const { status } = req.body;
  if (!['active', 'reserved', 'sold', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  listing.status = status;
  listing.updatedAt = new Date().toISOString();
  saveDatabase(db);
  res.json(listing);
});

// 8. Delete listing
app.delete('/api/listings/:id', (req, res) => {
  const db = loadDatabase();
  const index = db.listings.findIndex(l => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  db.listings.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true, message: 'Listing deleted' });
});

// 9. Favorites management
app.post('/api/favorites/toggle', (req, res) => {
  const db = loadDatabase();
  const { userId, listingId } = req.body;
  if (!userId || !listingId) {
    return res.status(400).json({ error: 'Missing userId or listingId' });
  }

  const favIndex = db.favorites.findIndex(f => f.userId === userId && f.listingId === listingId);
  const listing = db.listings.find(l => l.id === listingId);

  let isFavorite = false;
  if (favIndex >= 0) {
    db.favorites.splice(favIndex, 1);
    if (listing && listing.favoritesCount > 0) listing.favoritesCount--;
    isFavorite = false;
  } else {
    db.favorites.push({ userId, listingId });
    if (listing) listing.favoritesCount = (listing.favoritesCount || 0) + 1;
    isFavorite = true;
  }

  saveDatabase(db);
  res.json({ isFavorite, favoritesCount: listing?.favoritesCount || 0 });
});

app.get('/api/favorites/:userId', (req, res) => {
  const db = loadDatabase();
  const userFavIds = db.favorites
    .filter(f => f.userId === req.params.userId)
    .map(f => f.listingId);
  const favoriteListings = db.listings.filter(l => userFavIds.includes(l.id));
  res.json(favoriteListings);
});

// 10. Saved searches
app.get('/api/saved-searches/:userId', (req, res) => {
  const db = loadDatabase();
  const searches = db.savedSearches.filter(s => s.userId === req.params.userId);
  res.json(searches);
});

app.post('/api/saved-searches', (req, res) => {
  const db = loadDatabase();
  const { userId, name, params } = req.body;
  if (!userId || !name) {
    return res.status(400).json({ error: 'Missing userId or name' });
  }

  const newSearch: SavedSearch = {
    id: 'search-' + Date.now(),
    userId,
    name,
    params: params || {},
    createdAt: new Date().toISOString()
  };

  db.savedSearches.unshift(newSearch);
  saveDatabase(db);
  res.status(201).json(newSearch);
});

app.delete('/api/saved-searches/:id', (req, res) => {
  const db = loadDatabase();
  const index = db.savedSearches.findIndex(s => s.id === req.params.id);
  if (index >= 0) {
    db.savedSearches.splice(index, 1);
    saveDatabase(db);
  }
  res.json({ success: true });
});

// 11. Messaging / Conversations
app.get('/api/conversations/:userId', (req, res) => {
  const db = loadDatabase();
  const { userId } = req.params;
  const userConvs = db.conversations.filter(
    c => c.buyerId === userId || c.sellerId === userId
  );
  res.json(userConvs);
});

app.get('/api/conversations/:id/messages', (req, res) => {
  const db = loadDatabase();
  const msgs = db.messages.filter(m => m.conversationId === req.params.id);
  res.json(msgs);
});

app.post('/api/conversations/send', (req, res) => {
  const db = loadDatabase();
  const { conversationId, listingId, senderId, senderName, text } = req.body;

  if (!senderId || !text) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  let conv = db.conversations.find(c => c.id === conversationId);
  const listing = db.listings.find(l => l.id === listingId);

  if (!conv && listing) {
    // Create new conversation
    conv = {
      id: 'conv-' + Date.now(),
      listingId: listing.id,
      listingTitle: listing.title,
      listingPriceUZS: listing.priceUZS,
      listingImage: listing.coverImage,
      buyerId: senderId,
      buyerName: senderName || 'Xaridor',
      sellerId: listing.userId,
      sellerName: listing.sellerName,
      lastMessage: text,
      lastMessageTime: new Date().toISOString(),
      unreadCountForUser: 1,
      updatedAt: new Date().toISOString()
    };
    db.conversations.unshift(conv);

    // Notify seller
    db.notifications.unshift({
      id: 'notif-' + Date.now(),
      userId: listing.userId,
      title: 'Yangi xabar!',
      message: `${senderName}: ${text.slice(0, 50)}...`,
      type: 'new_message',
      link: '/chat',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  } else if (conv) {
    conv.lastMessage = text;
    conv.lastMessageTime = new Date().toISOString();
    conv.updatedAt = new Date().toISOString();
  }

  const message: Message = {
    id: 'msg-' + Date.now(),
    conversationId: conv ? conv.id : conversationId,
    senderId,
    senderName: senderName || 'Foydalanuvchi',
    text,
    createdAt: new Date().toISOString(),
    isRead: false
  };

  db.messages.push(message);
  saveDatabase(db);
  res.json({ conversation: conv, message });
});

// 12. User Auth (Mock persistent auth for session)
app.post('/api/auth/register', (req, res) => {
  const db = loadDatabase();
  const { name, email, phone, telegram, role, region, city } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Email allaqachon ro\'yxatdan o\'tgan' });
  }

  const newUser: User = {
    id: 'user_' + Date.now(),
    name,
    email: email.toLowerCase(),
    phone,
    telegram: telegram || '',
    role: role === 'dealer' ? 'dealer' : 'user',
    isVerifiedDealer: false,
    region: region || 'Toshkent shahri',
    city: city || 'Toshkent',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDatabase(db);
  res.status(201).json(newUser);
});

app.post('/api/auth/login', (req, res) => {
  const db = loadDatabase();
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email kiritilishi shart' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi. Iltimos ro\'yxatdan o\'ting.' });
  }

  res.json(user);
});

app.put('/api/auth/profile/:id', (req, res) => {
  const db = loadDatabase();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
  }

  Object.assign(user, req.body);
  saveDatabase(db);
  res.json(user);
});

// 13. Reports
app.post('/api/reports', (req, res) => {
  const db = loadDatabase();
  const { listingId, listingTitle, reporterId, reporterEmail, reason, comment } = req.body;

  const newReport: Report = {
    id: 'rep-' + Date.now(),
    listingId,
    listingTitle: listingTitle || 'E\'lon',
    reporterId: reporterId || 'anon',
    reporterEmail: reporterEmail || 'anon@example.com',
    reason: reason || 'wrong_price',
    comment: comment || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.reports.unshift(newReport);
  saveDatabase(db);
  res.status(201).json({ success: true, report: newReport });
});

// 14. Admin routes
app.get('/api/admin/reports', (_req, res) => {
  const db = loadDatabase();
  res.json(db.reports);
});

app.post('/api/admin/reports/:id/resolve', (req, res) => {
  const db = loadDatabase();
  const report = db.reports.find(r => r.id === req.params.id);
  if (report) {
    report.status = req.body.action === 'dismiss' ? 'dismissed' : 'resolved';
    saveDatabase(db);
  }
  res.json({ success: true });
});

app.get('/api/admin/users', (_req, res) => {
  const db = loadDatabase();
  res.json(db.users);
});

app.post('/api/admin/users/:id/toggle-dealer', (req, res) => {
  const db = loadDatabase();
  const user = db.users.find(u => u.id === req.params.id);
  if (user) {
    user.isVerifiedDealer = !user.isVerifiedDealer;
    if (user.isVerifiedDealer) {
      user.role = 'dealer';
    }
    saveDatabase(db);
  }
  res.json(user);
});

// 15. In-app notifications
app.get('/api/notifications/:userId', (req, res) => {
  const db = loadDatabase();
  const list = db.notifications.filter(n => n.userId === req.params.userId);
  res.json(list);
});

app.post('/api/notifications/mark-read', (req, res) => {
  const db = loadDatabase();
  const { userId } = req.body;
  db.notifications.forEach(n => {
    if (n.userId === userId) n.isRead = true;
  });
  saveDatabase(db);
  res.json({ success: true });
});

// Vite middleware in dev or static files in production
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AutoSavdo Pro server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
