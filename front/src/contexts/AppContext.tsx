import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import type { 
  Prompt, 
  Collection, 
  UserStats, 
  AppSettings, 
  Achievement,
  Recommendation,
  Workflow,
  CustomTheme,
  APIIntegration
} from '../types';

interface AppState {
  prompts: Prompt[];
  collections: Collection[];
  favorites: string[];
  userStats: UserStats;
  settings: AppSettings;
  achievements: Achievement[];
  recommendations: Recommendation[];
  workflows: Workflow[];
  customThemes: CustomTheme[];
  apiIntegrations: APIIntegration[];
  isOnline: boolean;
  lastSync: string | null;
  pendingSync: boolean;
}

type AppAction = 
  | { type: 'ADD_PROMPT'; payload: Prompt }
  | { type: 'UPDATE_PROMPT'; payload: { id: string; updates: Partial<Prompt> } }
  | { type: 'DELETE_PROMPT'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'ADD_COLLECTION'; payload: Collection }
  | { type: 'UPDATE_COLLECTION'; payload: { id: string; updates: Partial<Collection> } }
  | { type: 'DELETE_COLLECTION'; payload: string }
  | { type: 'ADD_TO_COLLECTION'; payload: { collectionId: string; promptId: string } }
  | { type: 'REMOVE_FROM_COLLECTION'; payload: { collectionId: string; promptId: string } }
  | { type: 'UPDATE_STATS'; payload: Partial<UserStats> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'ADD_RECOMMENDATION'; payload: Recommendation }
  | { type: 'DISMISS_RECOMMENDATION'; payload: string }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_SYNC_STATUS'; payload: { lastSync: string | null; pending: boolean } }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'RESET_DATA' };

const initialState: AppState = {
  prompts: [],
  collections: [],
  favorites: [],
  userStats: {
    totalPrompts: 0,
    favoritePrompts: 0,
    collectionsCount: 0,
    dailyStreak: 0,
    longestStreak: 0,
    totalCharacters: 0,
    averageQuality: 0,
    mostUsedType: 'detailed',
    achievements: [],
    level: 1,
    experience: 0
  },
  settings: {
    theme: 'auto',
    autoSave: true,
    showCharacterCount: true,
    enableHapticFeedback: true,
    notifications: {
      achievements: true,
      dailyReminders: true,
      weeklyReports: true,
      newFeatures: true,
      communityUpdates: false,
      sound: true,
      desktop: true
    },
    privacy: {
      shareUsageData: false,
      allowPublicPrompts: false,
      showInCommunity: false
    },
    editor: {
      fontSize: 14,
      lineHeight: 1.5,
      wordWrap: true,
      showLineNumbers: false,
      autoComplete: true
    },
    shortcuts: {
      'save': 'Ctrl+S',
      'clear': 'Ctrl+K',
      'history': 'Ctrl+Shift+H',
      'theme': 'Ctrl+Shift+T',
      'surprise': 'Ctrl+Shift+R'
    },
    layout: 'default',
    language: 'pt-BR'
  },
  achievements: [],
  recommendations: [],
  workflows: [],
  customThemes: [],
  apiIntegrations: [],
  isOnline: navigator.onLine,
  lastSync: null,
  pendingSync: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_PROMPT':
      return {
        ...state,
        prompts: [action.payload, ...state.prompts],
        userStats: {
          ...state.userStats,
          totalPrompts: state.userStats.totalPrompts + 1,
          totalCharacters: state.userStats.totalCharacters + action.payload.characterCount,
          experience: state.userStats.experience + 10
        }
      };

    case 'UPDATE_PROMPT':
      return {
        ...state,
        prompts: state.prompts.map(p => 
          p.id === action.payload.id 
            ? { ...p, ...action.payload.updates }
            : p
        )
      };

    case 'DELETE_PROMPT':
      const deletedPrompt = state.prompts.find(p => p.id === action.payload);
      return {
        ...state,
        prompts: state.prompts.filter(p => p.id !== action.payload),
        favorites: state.favorites.filter(id => id !== action.payload),
        userStats: {
          ...state.userStats,
          totalPrompts: Math.max(0, state.userStats.totalPrompts - 1),
          totalCharacters: Math.max(0, state.userStats.totalCharacters - (deletedPrompt?.characterCount || 0))
        }
      };

    case 'TOGGLE_FAVORITE':
      const isFavorite = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFavorite 
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload],
        userStats: {
          ...state.userStats,
          favoritePrompts: isFavorite 
            ? state.userStats.favoritePrompts - 1
            : state.userStats.favoritePrompts + 1
        }
      };

    case 'ADD_COLLECTION':
      return {
        ...state,
        collections: [...state.collections, action.payload],
        userStats: {
          ...state.userStats,
          collectionsCount: state.userStats.collectionsCount + 1
        }
      };

    case 'UPDATE_COLLECTION':
      return {
        ...state,
        collections: state.collections.map(c => 
          c.id === action.payload.id 
            ? { ...c, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : c
        )
      };

    case 'DELETE_COLLECTION':
      return {
        ...state,
        collections: state.collections.filter(c => c.id !== action.payload),
        prompts: state.prompts.map(p => 
          p.collectionId === action.payload 
            ? { ...p, collectionId: undefined }
            : p
        ),
        userStats: {
          ...state.userStats,
          collectionsCount: Math.max(0, state.userStats.collectionsCount - 1)
        }
      };

    case 'ADD_TO_COLLECTION':
      return {
        ...state,
        collections: state.collections.map(c => 
          c.id === action.payload.collectionId
            ? { 
                ...c, 
                promptIds: [...c.promptIds, action.payload.promptId],
                updatedAt: new Date().toISOString()
              }
            : c
        ),
        prompts: state.prompts.map(p => 
          p.id === action.payload.promptId
            ? { ...p, collectionId: action.payload.collectionId }
            : p
        )
      };

    case 'REMOVE_FROM_COLLECTION':
      return {
        ...state,
        collections: state.collections.map(c => 
          c.id === action.payload.collectionId
            ? { 
                ...c, 
                promptIds: c.promptIds.filter(id => id !== action.payload.promptId),
                updatedAt: new Date().toISOString()
              }
            : c
        ),
        prompts: state.prompts.map(p => 
          p.id === action.payload.promptId
            ? { ...p, collectionId: undefined }
            : p
        )
      };

    case 'UPDATE_STATS':
      return {
        ...state,
        userStats: { ...state.userStats, ...action.payload }
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
        userStats: {
          ...state.userStats,
          achievements: [...state.userStats.achievements, action.payload],
          experience: state.userStats.experience + 50
        }
      };

    case 'ADD_RECOMMENDATION':
      return {
        ...state,
        recommendations: [action.payload, ...state.recommendations.slice(0, 9)] // Keep only 10 recommendations
      };

    case 'DISMISS_RECOMMENDATION':
      return {
        ...state,
        recommendations: state.recommendations.filter(r => r.id !== action.payload)
      };

    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload
      };

    case 'SET_SYNC_STATUS':
      return {
        ...state,
        lastSync: action.payload.lastSync,
        pendingSync: action.payload.pending
      };

    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload
      };

    case 'RESET_DATA':
      return initialState;

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addPrompt: (prompt: Prompt) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addToCollection: (collectionId: string, promptId: string) => void;
  removeFromCollection: (collectionId: string, promptId: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  unlockAchievement: (achievement: Achievement) => void;
  addRecommendation: (recommendation: Recommendation) => void;
  dismissRecommendation: (id: string) => void;
  exportData: () => string;
  importData: (data: string) => void;
  syncData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const isInitialMount = useRef(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('promptcraft-data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: data });
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const dataToSave = {
      prompts: state.prompts,
      collections: state.collections,
      favorites: state.favorites,
      userStats: state.userStats,
      settings: state.settings,
      achievements: state.achievements
    };
    localStorage.setItem('promptcraft-data', JSON.stringify(dataToSave));
  }, [state.prompts, state.collections, state.favorites, state.userStats, state.settings, state.achievements]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper functions
  const addPrompt = (prompt: Prompt) => {
    dispatch({ type: 'ADD_PROMPT', payload: prompt });
    checkAchievements(state.userStats.totalPrompts + 1);
  };

  const updatePrompt = (id: string, updates: Partial<Prompt>) => {
    dispatch({ type: 'UPDATE_PROMPT', payload: { id, updates } });
  };

  const deletePrompt = (id: string) => {
    dispatch({ type: 'DELETE_PROMPT', payload: id });
  };

  const toggleFavorite = (id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  };

  const addCollection = (collection: Collection) => {
    dispatch({ type: 'ADD_COLLECTION', payload: collection });
  };

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    dispatch({ type: 'UPDATE_COLLECTION', payload: { id, updates } });
  };

  const deleteCollection = (id: string) => {
    dispatch({ type: 'DELETE_COLLECTION', payload: id });
  };

  const addToCollection = (collectionId: string, promptId: string) => {
    dispatch({ type: 'ADD_TO_COLLECTION', payload: { collectionId, promptId } });
  };

  const removeFromCollection = (collectionId: string, promptId: string) => {
    dispatch({ type: 'REMOVE_FROM_COLLECTION', payload: { collectionId, promptId } });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const unlockAchievement = (achievement: Achievement) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement });
  };

  const addRecommendation = (recommendation: Recommendation) => {
    dispatch({ type: 'ADD_RECOMMENDATION', payload: recommendation });
  };

  const dismissRecommendation = (id: string) => {
    dispatch({ type: 'DISMISS_RECOMMENDATION', payload: id });
  };

  const exportData = () => {
    const exportData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      prompts: state.prompts,
      collections: state.collections,
      settings: state.settings,
      stats: state.userStats
    };
    return JSON.stringify(exportData, null, 2);
  };

  const importData = (data: string) => {
    try {
      const importedData = JSON.parse(data);
      dispatch({ type: 'LOAD_DATA', payload: importedData });
    } catch (error) {
      throw new Error('Dados de importação inválidos');
    }
  };

  const syncData = async () => {
    // Implementar sincronização com servidor
    dispatch({ type: 'SET_SYNC_STATUS', payload: { lastSync: null, pending: true } });
    
    try {
      // Simular sincronização
      await new Promise(resolve => setTimeout(resolve, 2000));
      dispatch({ 
        type: 'SET_SYNC_STATUS', 
        payload: { 
          lastSync: new Date().toISOString(), 
          pending: false 
        } 
      });
    } catch (error) {
      dispatch({ type: 'SET_SYNC_STATUS', payload: { lastSync: null, pending: false } });
      throw error;
    }
  };

  const checkAchievements = (totalPrompts: number) => {
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
          !state.achievements.find(a => a.id === achievement.id)) {
        unlockAchievement({
          ...achievement,
          unlockedAt: new Date().toISOString()
        });
      }
    });
  };

  const value: AppContextType = {
    state,
    dispatch,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    addCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    updateSettings,
    unlockAchievement,
    addRecommendation,
    dismissRecommendation,
    exportData,
    importData,
    syncData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};