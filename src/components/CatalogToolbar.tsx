import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Play, 
  Pause, 
  Palette, 
  Bookmark, 
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { BackgroundTheme } from '../types';

interface CatalogToolbarProps {
  currentPage: number;
  totalPages: number;
  zoomLevel: number; // 1.0 = 100%
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  onGoToPage: (page: number) => void;
  currentTheme: BackgroundTheme;
  onChangeTheme: (theme: BackgroundTheme) => void;
  isAutoplay: boolean;
  onToggleAutoplay: () => void;
  autoplayInterval: number;
  onChangeAutoplayInterval: (seconds: number) => void;
  onAddBookmark: () => void;
  isBookmarked: boolean;
  onOpenHotspotModal: () => void;
  onOpenHelpModal: () => void;
}

export const CatalogToolbar: React.FC<CatalogToolbarProps> = ({
  currentPage,
  totalPages,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onPrevPage,
  onNextPage,
  onFirstPage,
  onLastPage,
  onGoToPage,
  currentTheme,
  onChangeTheme,
  isAutoplay,
  onToggleAutoplay,
  autoplayInterval,
  onChangeAutoplayInterval,
  onAddBookmark,
  isBookmarked,
  onOpenHotspotModal,
  onOpenHelpModal,
}) => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showAutoplaySettings, setShowAutoplaySettings] = useState(false);
  const [pageInput, setPageInput] = useState(currentPage.toString());

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseInt(pageInput, 10);
    if (!isNaN(targetNum) && targetNum >= 1 && targetNum <= totalPages) {
      onGoToPage(targetNum);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const themes: { id: BackgroundTheme; label: string; iconBg: string }[] = [
    { id: 'dark-wood', label: 'Ciemne Drewno', iconBg: 'bg-amber-950 border-amber-800' },
    { id: 'modern-studio', label: 'Nowoczesne Studio', iconBg: 'bg-slate-900 border-slate-700' },
    { id: 'lux-marble', label: 'Luksusowy Marmur', iconBg: 'bg-stone-800 border-stone-600' },
    { id: 'paper-texture', label: 'Ciepły Papier', iconBg: 'bg-amber-100 border-amber-300 text-amber-900' },
    { id: 'minimal-slate', label: 'Minimalistyczny Łupak', iconBg: 'bg-zinc-900 border-zinc-700' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 max-w-[95vw]">
      {/* Popovers for Theme & Autoplay */}
      {showThemePicker && (
        <div className="apple-glass rounded-3xl p-3 shadow-2xl flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-white/15">
          <div className="w-full text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 px-1">Tło czytnika:</div>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onChangeTheme(t.id);
                setShowThemePicker(false);
              }}
              className={`apple-press-effect flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold transition-all border ${
                currentTheme === t.id
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full border ${t.iconBg}`}></span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}

      {showAutoplaySettings && (
        <div className="apple-glass rounded-3xl p-3 shadow-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-white/15">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Prędkość przewracania:</div>
          <div className="flex gap-2">
            {[3, 5, 8, 12].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  onChangeAutoplayInterval(sec);
                  setShowAutoplaySettings(false);
                }}
                className={`apple-press-effect px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                  autoplayInterval === sec
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="apple-glass-pill rounded-full px-4 py-2.5 shadow-2xl flex items-center gap-2 sm:gap-3 text-slate-200">
        {/* First & Prev Page */}
        <div className="flex items-center gap-1">
          <button
            onClick={onFirstPage}
            disabled={currentPage <= 1}
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all border border-white/5"
            title="Pierwsza strona"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all border border-white/5"
            title="Poprzednia strona (Strzałka w lewo)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Page Counter Input */}
        <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border border-white/10">
          <input
            type="text"
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputSubmit}
            className="w-8 text-center bg-transparent font-bold text-xs text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded"
          />
          <span className="text-xs text-slate-500 font-medium">/</span>
          <span className="text-xs text-slate-400 font-semibold">{totalPages}</span>
        </form>

        {/* Next & Last Page */}
        <div className="flex items-center gap-1">
          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all border border-white/5"
            title="Następna strona (Strzałka w prawo)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onLastPage}
            disabled={currentPage >= totalPages}
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all border border-white/5"
            title="Ostatnia strona"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-5 bg-white/10 hidden sm:block"></div>

        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={onZoomOut}
            disabled={zoomLevel <= 0.7}
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white transition-all border border-white/5"
            title="Pomniejsz"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300 min-w-[2.8rem] text-center font-bold">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            disabled={zoomLevel >= 2.5}
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white transition-all border border-white/5"
            title="Powiększ"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {zoomLevel !== 1.0 && (
            <button
              onClick={onZoomReset}
              className="apple-press-effect p-2 rounded-full bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-all border border-amber-500/30"
              title="Resetuj powiększenie"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="w-px h-5 bg-white/10 hidden md:block"></div>

        {/* Autoplay Slideshow */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={onToggleAutoplay}
            className={`apple-press-effect p-2 rounded-full transition-all border ${
              isAutoplay
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/25 animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
            }`}
            title={isAutoplay ? 'Zatrzymaj prezentację' : 'Uruchom prezentację (Auto-flip)'}
          >
            {isAutoplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowAutoplaySettings(!showAutoplaySettings)}
            className="apple-press-effect text-[10px] font-bold text-slate-400 hover:text-white bg-white/5 px-2.5 py-1.5 rounded-full border border-white/5"
            title="Ustaw czas slajdu"
          >
            {autoplayInterval}s
          </button>
        </div>

        <div className="w-px h-5 bg-white/10"></div>

        {/* Actions: Theme, Bookmark, Hotspot, Help */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5"
            title="Zmiana motywu otoczenia"
          >
            <Palette className="w-4 h-4" />
          </button>

          <button
            onClick={onAddBookmark}
            className={`apple-press-effect p-2 rounded-full transition-all border ${
              isBookmarked
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/5'
            }`}
            title={isBookmarked ? 'Strona zakreślona w zakładkach' : 'Dodaj zakładkę do tej strony'}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHotspotModal}
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5 hidden sm:flex"
            title="Dodaj interaktywny punkt produktu na stronie"
          >
            <PlusCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHelpModal}
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5"
            title="Instrukcja obsługi & skróty klawiszowe"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
