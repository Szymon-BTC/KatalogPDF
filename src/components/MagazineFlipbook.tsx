import React, { useState, useEffect, useRef } from 'react';
import { PageFlip } from 'page-flip';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  ShoppingBag, 
  Sparkles,
  Maximize2,
  BookOpen
} from 'lucide-react';
import { CatalogMetadata, Hotspot, ViewMode, BackgroundTheme } from '../types';
import { playPageTurnSound } from '../utils/sound';

interface MagazineFlipbookProps {
  catalog: CatalogMetadata;
  currentPage: number; // 1-indexed
  onPageChange: (newPage: number) => void;
  viewMode: ViewMode;
  theme: BackgroundTheme;
  zoomLevel: number;
  soundEnabled: boolean;
  onOpenHotspotModal: () => void;
}

export const MagazineFlipbook: React.FC<MagazineFlipbookProps> = ({
  catalog,
  currentPage,
  onPageChange,
  viewMode,
  theme,
  zoomLevel,
  soundEnabled,
  onOpenHotspotModal,
}) => {
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const isInternalFlip = useRef<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const totalPages = catalog.totalPages;

  // Detect devicePixelRatio for HiDPI / Retina displays
  const dpr = typeof window !== 'undefined' ? Math.max(1, window.devicePixelRatio || 1) : 1;

  // Initialize PageFlip instance with realistic 3D paper fold/curl physics
  useEffect(() => {
    if (!bookRef.current || catalog.pages.length === 0) return;

    let isDestroyed = false;

    // Timeout ensures DOM elements are rendered
    const timer = setTimeout(() => {
      if (isDestroyed || !bookRef.current) return;

      try {
        // Clean up any existing instance first
        if (pageFlipRef.current) {
          try {
            pageFlipRef.current.destroy();
          } catch (_) {}
          pageFlipRef.current = null;
        }

        const pageFlip = new PageFlip(bookRef.current, {
          width: 480, // base page width
          height: 680, // base page height
          size: 'stretch',
          minWidth: 260,
          maxWidth: Math.round(900 * (dpr > 1.5 ? 1.25 : 1)),
          minHeight: 380,
          maxHeight: Math.round(1200 * (dpr > 1.5 ? 1.25 : 1)),
          drawShadow: true,
          maxShadowOpacity: 0.6,
          showCover: true,
          mobileScrollSupport: false,
          usePortrait: viewMode === 'single',
          startPage: Math.max(0, currentPage - 1),
          clickEventForward: true,
          useMouseEvents: true,
          swipeDistance: 20,
          showPageCorners: true,
        });

        const pageElements = bookRef.current.querySelectorAll('.flip-page');
        if (pageElements && pageElements.length > 0) {
          pageFlip.loadFromHTML(pageElements as unknown as NodeListOf<HTMLElement>);
        }

        pageFlip.on('flip', (e: any) => {
          isInternalFlip.current = true;
          const newPage = (e.data as number) + 1;
          onPageChange(newPage);
          playPageTurnSound(soundEnabled);
        });

        pageFlipRef.current = pageFlip;
      } catch (err) {
        console.error('Failed to initialize PageFlip:', err);
      }
    }, 100);

    return () => {
      isDestroyed = true;
      clearTimeout(timer);
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch (e) {
          // ignore cleanup error
        }
        pageFlipRef.current = null;
      }
    };
  }, [catalog.id, catalog.pages.length, viewMode, dpr]);

  // Sync external page changes (e.g., jump from thumbnails or table of contents)
  useEffect(() => {
    if (isInternalFlip.current) {
      isInternalFlip.current = false;
      return;
    }
    if (!pageFlipRef.current) return;
    try {
      const currentFlipIndex = pageFlipRef.current.getCurrentPageIndex();
      const targetIndex = currentPage - 1;
      if (currentFlipIndex !== targetIndex && targetIndex >= 0 && targetIndex < totalPages) {
        pageFlipRef.current.turnToPage(targetIndex);
      }
    } catch (e) {
      console.warn('PageFlip turnToPage error:', e);
    }
  }, [currentPage, totalPages]);

  const handleNext = () => {
    if (pageFlipRef.current) {
      try {
        pageFlipRef.current.flipNext('bottom');
      } catch (e) {
        console.warn('flipNext failed:', e);
      }
    }
  };

  const handlePrev = () => {
    if (pageFlipRef.current) {
      try {
        pageFlipRef.current.flipPrev('bottom');
      } catch (e) {
        console.warn('flipPrev failed:', e);
      }
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Background Theme Styles
  const getThemeClass = (t: BackgroundTheme) => {
    switch (t) {
      case 'dark-wood':
        return 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950 via-slate-950 to-black';
      case 'modern-studio':
        return 'bg-gradient-to-b from-slate-900 via-slate-950 to-zinc-950';
      case 'lux-marble':
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900 via-zinc-950 to-black';
      case 'paper-texture':
        return 'bg-amber-50/20 bg-gradient-to-br from-amber-100/10 via-slate-900 to-slate-950';
      case 'minimal-slate':
      default:
        return 'bg-zinc-950';
    }
  };

  // Render Hotspots overlay for a given page number
  const renderHotspots = (pageNum: number) => {
    const pageHotspots = catalog.hotspots.filter((h) => h.pageNumber === pageNum);
    return pageHotspots.map((h) => (
      <div
        key={h.id}
        style={{ left: `${h.xPercent}%`, top: `${h.yPercent}%` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedHotspot(h);
          }}
          className="relative flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold shadow-lg border-2 border-white hover:scale-125 transition-transform duration-200 animate-bounce"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span className="absolute -inset-1 rounded-full bg-amber-400/40 animate-ping -z-10" />
        </button>

        {/* Hover Tooltip Preview */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 w-48 p-2.5 rounded-xl bg-slate-900/95 border border-amber-500/40 text-slate-100 shadow-2xl backdrop-blur-md text-xs pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-0.5">
            {h.tag && <span className="px-1 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px]">{h.tag}</span>}
            <span className="truncate">{h.title}</span>
          </div>
          {h.price && <div className="text-emerald-400 font-bold text-[11px] mb-1">{h.price}</div>}
          {h.description && <p className="text-[10px] text-slate-300 line-clamp-2">{h.description}</p>}
        </div>
      </div>
    ));
  };

  return (
    <div className={`relative w-full min-h-[82vh] flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden select-none transition-colors duration-500 ${getThemeClass(theme)}`}>
      {/* Hotspot Modal Popover */}
      {selectedHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 max-w-sm w-full text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setSelectedHotspot(null)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              &times;
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <div>
                {selectedHotspot.tag && (
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                    {selectedHotspot.tag}
                  </span>
                )}
                <h3 className="text-base font-bold text-white">{selectedHotspot.title}</h3>
              </div>
            </div>
            {selectedHotspot.price && (
              <div className="text-lg font-bold text-emerald-400 my-2">{selectedHotspot.price}</div>
            )}
            {selectedHotspot.description && (
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{selectedHotspot.description}</p>
            )}
            {selectedHotspot.url && (
              <a
                href={selectedHotspot.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition-all"
              >
                <span>Przejdź do oferty produktu</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Main Flipbook Stage */}
      <div 
        style={{ transform: `scale(${zoomLevel})` }}
        className="relative transition-transform duration-300 w-full max-w-6xl flex items-center justify-center py-4 my-auto"
      >
        {/* Navigation Arrow Left */}
        {currentPage > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-40 p-3.5 rounded-full bg-slate-900/85 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700/80 hover:border-amber-400 shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            title="Poprzednia strona (Przekręć kartkę w lewo)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Realistic PageFlip Container Container */}
        <div className="relative flex items-center justify-center p-2 sm:p-4 rounded-3xl bg-slate-950/30 border border-slate-800/40 backdrop-blur-md shadow-[0_35px_80px_-15px_rgba(0,0,0,0.8)]">
          <div 
            ref={bookRef}
            className="relative overflow-hidden cursor-grab active:cursor-grabbing rounded-xl shadow-2xl transition-all"
          >
            {catalog.pages.map((page) => {
              const isCover = page.pageNumber === 1 || page.pageNumber === totalPages;
              const isEven = page.pageNumber % 2 === 0;

              return (
                <div
                  key={page.pageNumber}
                  className="flip-page relative w-full h-full bg-white overflow-hidden shadow-md select-none"
                  data-density={isCover ? 'hard' : 'soft'}
                >
                  {/* Page Image */}
                  <img
                    src={page.dataUrl}
                    alt={`Strona ${page.pageNumber}`}
                    className="w-full h-full object-cover pointer-events-none select-none"
                    style={{
                      imageRendering: dpr > 1.2 ? '-webkit-optimize-contrast' : 'auto',
                    }}
                    draggable={false}
                  />

                  {/* Interactive Hotspots Overlay */}
                  {renderHotspots(page.pageNumber)}

                  {/* Realistic Spine Gradient Shadow */}
                  <div 
                    className={`absolute top-0 bottom-0 w-10 pointer-events-none ${
                      isEven 
                        ? 'right-0 bg-gradient-to-l from-black/25 via-black/5 to-transparent' 
                        : 'left-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent'
                    }`} 
                  />

                  {/* Soft Paper Gloss & Lighting Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                  {/* Page Corner Drag Hint / Visual Curl Accent */}
                  <div className={`absolute bottom-0 ${isEven ? 'left-0' : 'right-0'} w-8 h-8 pointer-events-none bg-gradient-to-tl from-amber-400/20 to-transparent opacity-60`} />

                  {/* Page Number Badge */}
                  <div 
                    className={`absolute bottom-2 ${isEven ? 'left-3' : 'right-3'} text-[10px] font-semibold text-slate-500 bg-white/80 px-2 py-0.5 rounded shadow-sm border border-slate-200/60 pointer-events-none`}
                  >
                    {page.pageNumber}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrow Right */}
        {currentPage < totalPages && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-40 p-3.5 rounded-full bg-slate-900/85 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700/80 hover:border-amber-400 shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            title="Następna strona (Przekręć kartkę w prawo)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Helper hint for drag gestures & HiDPI indicator */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-400/80 bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Przeciągnij narożnik strony lub kliknij, aby przekładać papierowe strony</span>
        </div>
        {dpr > 1 && (
          <span className="text-[10px] font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            HiDPI {dpr}x
          </span>
        )}
      </div>
    </div>
  );
};

