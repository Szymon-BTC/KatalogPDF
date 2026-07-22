import React, { useState, useEffect } from 'react';
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

  // Keep pageInput synced whenever currentPage changes externally (e.g. page flips)
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

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
    { id: 'dark-wood', label: 'Obsydian Czarny', iconBg: 'bg-black border-neutral-700' },
    { id: 'modern-studio', label: 'Grafitowe Studio', iconBg: 'bg-neutral-900 border-neutral-700' },
    { id: 'lux-marble', label: 'Monochrom Slate', iconBg: 'bg-zinc-900 border-zinc-700' },
    { id: 'paper-texture', label: 'Ciemny Onyks', iconBg: 'bg-neutral-950 border-neutral-800' },
    { id: 'minimal-slate', label: 'Minimalistyczny Cień', iconBg: 'bg-neutral-800 border-neutral-600' },
  ];

  const progressPercent = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 max-w-[95vw]">
      {/* Interactive Progress Bar & Page Scrubber */}
      {totalPages > 1 && (
        <div className="apple-glass-pill rounded-full px-4 py-1.5 shadow-xl flex items-center gap-3 text-xs text-neutral-300 w-full max-w-md border border-white/10">
          <span className="text-[11px] font-mono font-bold text-white min-w-[2.5rem]">
            {progressPercent}%
          </span>
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => onGoToPage(Number(e.target.value))}
            className="w-full accent-white cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            title={`Postęp czytania: Strona ${currentPage} z ${totalPages}`}
          />
          <span className="text-[10px] text-neutral-400 font-mono flex-shrink-0">
            {currentPage}/{totalPages}
          </span>
        </div>
      )}
      {/* Popovers for Theme & Autoplay */}
      {showThemePicker && (
        <div className="apple-glass rounded-3xl p-3 shadow-2xl flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-white/15">
          <div className="w-full text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1 px-1">Tło czytnika:</div>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onChangeTheme(t.id);
                setShowThemePicker(false);
              }}
              className={`apple-press-effect flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold transition-all border ${
                currentTheme === t.id
                  ? 'bg-white text-black font-bold border-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-200 border-white/10'
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
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-1">Prędkość przewracania:</div>
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
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="apple-glass-pill rounded-full px-4 py-2.5 shadow-2xl flex items-center gap-2 sm:gap-3 text-neutral-200">
        {/* First & Prev Page */}
        <div className="flex items-center gap-1">
          <button
            onClick={onFirstPage}
            disabled={currentPage <= 1}
            aria-label="Skocz do pierwszej strony"
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-300 hover:text-white transition-all border border-white/5"
            title="Pierwsza strona"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            aria-label="Poprzednia strona"
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-300 hover:text-white transition-all border border-white/5"
            title="Poprzednia strona (Strzałka w lewo)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Page Counter Input */}
        <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-full border border-white/10">
          <input
            type="text"
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputSubmit}
            className="w-8 text-center bg-transparent font-bold text-xs text-white focus:outline-none focus:ring-1 focus:ring-white rounded"
          />
          <span className="text-xs text-neutral-500 font-medium">/</span>
          <span className="text-xs text-neutral-400 font-semibold">{totalPages}</span>
        </form>

        {/* Next & Last Page */}
        <div className="flex items-center gap-1">
          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            aria-label="Następna strona"
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-300 hover:text-white transition-all border border-white/5"
            title="Następna strona (Strzałka w prawo)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onLastPage}
            disabled={currentPage >= totalPages}
            aria-label="Skocz do ostatniej strony"
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-300 hover:text-white transition-all border border-white/5"
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
            aria-label="Pomniejsz widok"
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 text-neutral-300 hover:text-white transition-all border border-white/5"
            title="Pomniejsz"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-neutral-300 min-w-[2.8rem] text-center font-bold">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            disabled={zoomLevel >= 2.5}
            aria-label="Powiększ widok"
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 text-neutral-300 hover:text-white transition-all border border-white/5"
            title="Powiększ"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {zoomLevel !== 1.0 && (
            <button
              onClick={onZoomReset}
              aria-label="Resetuj powiększenie do 100%"
              className="apple-press-effect p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all border border-white/30"
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
            aria-label={isAutoplay ? 'Zatrzymaj prezentację' : 'Uruchom prezentację slajdów'}
            className={`apple-press-effect p-2 rounded-full transition-all border ${
              isAutoplay
                ? 'bg-white text-black border-white font-bold shadow-md animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5'
            }`}
            title={isAutoplay ? 'Zatrzymaj prezentację' : 'Uruchom prezentację (Auto-flip)'}
          >
            {isAutoplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowAutoplaySettings(!showAutoplaySettings)}
            aria-label="Ustawienia czasu prezentacji slajdów"
            className="apple-press-effect text-[10px] font-bold text-neutral-400 hover:text-white bg-white/5 px-2.5 py-1.5 rounded-full border border-white/5"
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
            aria-label="Zmień motyw otoczenia tła"
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all border border-white/5"
            title="Zmiana motywu otoczenia"
          >
            <Palette className="w-4 h-4" />
          </button>

          <button
            onClick={onAddBookmark}
            aria-label={isBookmarked ? 'Usuń zakładkę tej strony' : 'Dodaj zakładkę do tej strony'}
            className={`apple-press-effect p-2 rounded-full transition-all border ${
              isBookmarked
                ? 'bg-white text-black font-bold border-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border-white/5'
            }`}
            title={isBookmarked ? 'Strona zakreślona w zakładkach' : 'Dodaj zakładkę do tej strony'}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHotspotModal}
            aria-label="Dodaj interaktywny punkt produktu na stronie"
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5 hidden sm:flex"
            title="Dodaj interaktywny punkt produktu na stronie"
          >
            <PlusCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHelpModal}
            aria-label="Otwórz instrukcję obsługi i skróty klawiszowe"
            className="apple-press-effect p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5"
            title="Instrukcja obsługi & skróty klawiszowe"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

