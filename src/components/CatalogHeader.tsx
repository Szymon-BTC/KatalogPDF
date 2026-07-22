import React from 'react';
import { motion } from 'motion/react';
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
          <div className="p-2.5 rounded-2xl bg-white text-black font-bold shadow-md flex-shrink-0">
            <BookOpen className="w-5 h-5 font-bold" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
              {catalog ? catalog.title : 'Interaktywny Katalog PDF'}
            </h1>
            <p className="text-xs text-neutral-400 truncate flex items-center gap-2">
              <span>{catalog ? `${catalog.totalPages} stron` : 'Brak wczytanego katalogu'}</span>
              {catalog && catalog.totalPages > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
                  <span className="text-neutral-200 font-semibold">Strona {currentPage} z {catalog.totalPages}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
                  <span className="text-white font-bold px-2 py-0.5 rounded-full bg-white/10 text-[11px] border border-white/10">
                    Postęp: {Math.round((currentPage / catalog.totalPages) * 100)}%
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="hidden md:flex items-center bg-neutral-900/90 p-1 rounded-2xl border border-white/10 shadow-inner">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChangeViewMode('double')}
            aria-label="Przełącz na widok dwustronicowy (Magazyn)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              viewMode === 'double' 
                ? 'bg-white text-black font-bold shadow-md' 
                : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
            title="Widok dwustronicowy (Magazyn)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Magazyn 2-Strony</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChangeViewMode('single')}
            aria-label="Przełącz na widok pojedynczej strony"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              viewMode === 'single' 
                ? 'bg-white text-black font-bold shadow-md' 
                : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
            title="Widok pojedynczej strony"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>1 Strona</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChangeViewMode('grid')}
            aria-label="Przełącz na siatkę wszystkich stron"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white text-black font-bold shadow-md' 
                : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
            title="Siatka miniatur stron"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Siatka Stron</span>
          </motion.button>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {/* AI Assistant */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenAiAssistant}
            aria-label="Otwórz Asystenta AI Gemini"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold border border-neutral-700 shadow-md transition-colors"
            title="Zapytaj Asystenta AI Gemini o produkty w katalogu"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">AI Asystent</span>
          </motion.button>

          {/* Search */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onOpenSearch}
            aria-label="Szukaj w katalogu"
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors border border-white/10"
            title="Szukaj w katalogu"
          >
            <Search className="w-4 h-4" />
          </motion.button>

          {/* Thumbnails */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onOpenThumbnails}
            aria-label="Otwórz miniatury stron i zakładki"
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors border border-white/10"
            title="Miniatury stron & Zakładki"
          >
            <Grid className="w-4 h-4" />
          </motion.button>

          {/* Sound Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Wyłącz dźwięk kartkowania' : 'Włącz dźwięk kartkowania'}
            className={`p-2.5 rounded-2xl transition-colors border ${
              soundEnabled 
                ? 'bg-white/20 border-white/40 text-white shadow-inner' 
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Efekt dźwiękowy kartkowania włączony' : 'Włącz dźwięk kartkowania'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>

          {/* Fullscreen Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'Opuść tryb pełnoekranowy' : 'Włącz tryb pełnoekranowy'}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors border border-white/10 hidden sm:flex"
            title="Tryb pełnoekranowy"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </motion.button>


          {/* Upload PDF */}
          <button
            onClick={onOpenUploadModal}
            className="apple-press-effect flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md border border-white ml-1 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden md:inline">Wczytaj PDF</span>
          </button>
        </div>
      </div>

      {/* Reading Progress Line */}
      {catalog && catalog.totalPages > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            initial={false}
            animate={{ width: `${Math.min(100, Math.max(0, (currentPage / catalog.totalPages) * 100))}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      )}
    </header>
  );
};
