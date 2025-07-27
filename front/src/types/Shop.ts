export interface Shop {
  categories: ShopCategory[];
  featuredItems: ShopItem[];
  dailyDeals: ShopItem[];
  limitedOffers: ShopItem[];
}

export interface ShopCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: ShopItem[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'powerup' | 'theme' | 'avatar' | 'title' | 'badge' | 'energy' | 'coins' | 'gems' | 'bundle';
  price: number;
  currency: 'coins' | 'gems' | 'real_money';
  originalPrice?: number; // Para mostrar desconto
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isLimited: boolean;
  limitedQuantity?: number;
  soldQuantity?: number;
  expiresAt?: string;
  requirements?: ShopRequirement[];
  preview?: string; // URL para preview
  bundle?: ShopItem[]; // Para bundles
  discount?: number; // Porcentagem de desconto
}

export interface ShopRequirement {
  type: 'level' | 'achievement' | 'title' | 'streak' | 'special';
  value: string | number;
  description: string;
}