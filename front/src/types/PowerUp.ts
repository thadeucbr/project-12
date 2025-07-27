export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'xp_boost' | 'quality_boost' | 'speed_boost' | 'streak_protection' | 'double_rewards' | 'energy_boost' | 'coin_boost';
  duration: number; // em minutos
  multiplier: number;
  cost: number; // em moedas ou gemas
  currency: 'coins' | 'gems';
  isActive: boolean;
  activatedAt?: string;
  expiresAt?: string;
  cooldown?: number; // tempo de recarga em horas
  maxUses?: number; // usos máximos por dia
  usesToday?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}