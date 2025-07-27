export interface HistoryFilters {
  searchTerm: string;
  tags: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
  enhancementType: string;
  mediaType?: string;
  collections: string[];
  favorites: boolean;
  qualityRange: [number, number];
  sortBy: 'date' | 'quality' | 'usage' | 'alphabetical' | 'xp';
  sortOrder: 'asc' | 'desc';
}