import React from 'react';
import { 
  BookOpen, 
  Upload, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Sparkles,
  Search,
  Grid,
  BookMarked
} from 'lucide-react';
import { CatalogMetadata, ViewMode } from '../types';

interface CatalogHeaderProps {
  catalog: CatalogMetadata | null;
  currentPage: number; // 1-based
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenUploadModal: () => void;
  onOpenAiAssistant: () => void;
  onOpenSearch: () => void;
  onOpenThumbnails: () => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
}

export const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  catalog,
  currentPage,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  onOpenUploadModal,
  onOpenAiAssistant,
  onOpenSearch,
  onOpenThumbnails,
  viewMode,
  onChangeViewMode,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full apple-glass border-b border-white/10 text-slate-100 px-4 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Catalog Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 text-slate-950 shadow-lg shadow-amber-500/20 flex-shrink-0">
            <BookOpen className="w-5 h-5 font-bold" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
              {catalog ? catalog.title : 'Interaktywny Katalog PDF'}
            </h1>
            <p className="text-xs text-slate-400 truncate flex items-center gap-2">
              <span>{catalog ? `${catalog.totalPages} stron` : 'Brak wczytanego katalogu'}</span>
              {catalog && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                  <span className="text-amber-400 font-semibold">Strona {currentPage} z {catalog.totalPages}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="hidden md:flex items-center bg-slate-900/80 p-1 rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => onChangeViewMode('double')}
            className={`apple-press-effect flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'double' 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Widok dwustronicowy (Magazyn)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Magazyn 2-Strony</span>
          </button>
          <button
            onClick={() => onChangeViewMode('single')}
            className={`apple-press-effect flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'single' 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Widok pojedynczej strony"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>1 Strona</span>
          </button>
          <button
            onClick={() => onChangeViewMode('grid')}
            className={`apple-press-effect flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'grid' 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Siatka miniatur stron"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Siatka Stron</span>
          </button>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {/* AI Assistant */}
          <button
            onClick={onOpenAiAssistant}
            className="apple-press-effect flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 border border-indigo-400/30"
            title="Zapytaj Asystenta AI Gemini o produkty w katalogu"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">AI Asystent</span>
          </button>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className="apple-press-effect p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10"
            title="Szukaj w katalogu"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Thumbnails */}
          <button
            onClick={onOpenThumbnails}
            className="apple-press-effect p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10"
            title="Miniatury stron & Zakładki"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`apple-press-effect p-2.5 rounded-2xl transition-all border ${
              soundEnabled 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-inner' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Efekt dźwiękowy kartkowania włączony' : 'Włącz dźwięk kartkowania'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="apple-press-effect p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10 hidden sm:flex"
            title="Tryb pełnoekranowy"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Upload PDF */}
          <button
            onClick={onOpenUploadModal}
            className="apple-press-effect flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 ml-1"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden md:inline">Wczytaj PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
