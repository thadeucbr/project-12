import type { Achievement } from '../types';

export const checkAchievements = (
  totalPrompts: number,
  currentAchievements: Achievement[],
  unlockAchievement: (achievement: Achievement) => void
) => {
  const achievements = [
    {
      id: 'first-prompt',
      name: 'Primeiro Passo',
      description: 'Criou seu primeiro prompt',
      icon: '🎯',
      rarity: 'common' as const,
      threshold: 1
    },
    {
      id: 'prompt-master',
      name: 'Mestre dos Prompts',
      description: 'Criou 10 prompts',
      icon: '🏆',
      rarity: 'rare' as const,
      threshold: 10
    },
    {
      id: 'prompt-legend',
      name: 'Lenda dos Prompts',
      description: 'Criou 50 prompts',
      icon: '👑',
      rarity: 'epic' as const,
      threshold: 50
    },
    {
      id: 'prompt-god',
      name: 'Deus dos Prompts',
      description: 'Criou 100 prompts',
      icon: '⚡',
      rarity: 'legendary' as const,
      threshold: 100
    }
  ];

  achievements.forEach(achievement => {
    if (totalPrompts >= achievement.threshold && 
        !currentAchievements.find(a => a.id === achievement.id)) {
      unlockAchievement({
        ...achievement,
        unlockedAt: new Date().toISOString()
      });
    }
  });
};