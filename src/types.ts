export interface CatalogPage {
  pageIndex: number; // 0-indexed
  pageNumber: number; // 1-indexed
  dataUrl: string; // High-res rendered canvas data URL
  text: string; // Extracted raw text for search & AI
  width: number;
  height: number;
}

export interface Hotspot {
  id: string;
  pageNumber: number;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  title: string;
  description?: string;
  price?: string;
  url?: string;
  tag?: 'NOWOŚĆ' | 'PROMOCJA' | 'HIT' | 'INFO';
}

export interface Bookmark {
  pageNumber: number;
  label: string;
  color: string;
  createdAt: string;
}

export interface SearchResult {
  pageNumber: number;
  textSnippet: string;
}

export type ViewMode = 'double' | 'single' | 'grid';

export type BackgroundTheme = 
  | 'dark-wood'
  | 'modern-studio'
  | 'lux-marble'
  | 'paper-texture'
  | 'minimal-slate';

export interface CatalogMetadata {
  id: string;
  title: string;
  subtitle?: string;
  author?: string;
  totalPages: number;
  pages: CatalogPage[];
  hotspots: Hotspot[];
  bookmarks: Bookmark[];
  fileName?: string;
  fileSizeMb?: number;
  loadedAt: string;
}
