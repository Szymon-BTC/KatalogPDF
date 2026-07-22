import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { PageFlip } from 'page-flip';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  ShoppingBag, 
  Sparkles,
  Maximize2,
  BookOpen,
  X
} from 'lucide-react';
import { CatalogMetadata, Hotspot, ViewMode, BackgroundTheme } from '../types';
import { playPageTurnSound } from '../utils/sound';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

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
  const popoverRef = useRef<HTMLDivElement>(null);
  const isInternalFlip = useRef<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const totalPages = catalog.totalPages;
  const shouldReduceMotion = useReducedMotion();

  // Modal accessibility for hotspot popover
  useModalAccessibility({
    isOpen: Boolean(selectedHotspot),
    onClose: () => setSelectedHotspot(null),
    containerRef: popoverRef,
  });

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
          width: 840, // enlarged page width (+75%)
          height: 1190, // enlarged page height (+75%)
          size: 'stretch',
          minWidth: 420,
          maxWidth: Math.round(1575 * (dpr > 1.5 ? 1.25 : 1)),
          minHeight: 600,
          maxHeight: Math.round(2100 * (dpr > 1.5 ? 1.25 : 1)),
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
        return 'bg-black';
      case 'modern-studio':
        return 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black';
      case 'lux-marble':
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black';
      case 'paper-texture':
        return 'bg-gradient-to-b from-neutral-900 to-black';
      case 'minimal-slate':
      default:
        return 'bg-black';
    }
  };

  // Render Hotspots overlay for a given page number (Single entrance bounce, no continuous pinging)
  const renderHotspots = (pageNum: number) => {
    const pageHotspots = catalog.hotspots.filter((h) => h.pageNumber === pageNum);
    return pageHotspots.map((h) => (
      <div
        key={h.id}
        style={{ left: `${h.xPercent}%`, top: `${h.yPercent}%` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
      >
        <motion.button
          initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 380, damping: 20 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedHotspot(h);
          }}
          aria-label={`Punkt produktu: ${h.title}`}
          className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white text-black font-bold shadow-lg border-2 border-neutral-900 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
        </motion.button>

        {/* Hover Tooltip Preview */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 w-48 p-2.5 rounded-xl bg-neutral-900/95 border border-white/20 text-white shadow-2xl backdrop-blur-md text-xs pointer-events-none">
          <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
            {h.tag && <span className="px-1 py-0.2 rounded bg-neutral-800 text-white text-[9px] border border-neutral-700">{h.tag}</span>}
            <span className="truncate">{h.title}</span>
          </div>
          {h.price && <div className="text-white font-bold text-[11px] mb-1">{h.price}</div>}
          {h.description && <p className="text-[10px] text-neutral-300 line-clamp-2">{h.description}</p>}
        </div>
      </div>
    ));
  };

  return (
    <div className={`relative w-full min-h-[86vh] flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none transition-colors duration-500 ${getThemeClass(theme)}`}>
      {/* Hotspot Modal Popover */}
      <AnimatePresence>
        {selectedHotspot && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedHotspot(null);
            }}
          >
            <motion.div
              ref={popoverRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="hotspot-popover-title"
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="bg-neutral-950 border border-white/20 rounded-2xl p-6 max-w-sm w-full text-white shadow-2xl relative"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedHotspot(null)}
                aria-label="Zamknij podgląd punktu produktu"
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-xl bg-white text-black font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </span>
                <div>
                  {selectedHotspot.tag && (
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                      {selectedHotspot.tag}
                    </span>
                  )}
                  <h3 id="hotspot-popover-title" className="text-base font-bold text-white">
                    {selectedHotspot.title}
                  </h3>
                </div>
              </div>
              {selectedHotspot.price && (
                <div className="text-lg font-bold text-white my-2">{selectedHotspot.price}</div>
              )}
              {selectedHotspot.description && (
                <p className="text-xs text-neutral-300 leading-relaxed mb-4">{selectedHotspot.description}</p>
              )}
              {selectedHotspot.url && (
                <a
                  href={selectedHotspot.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition-all border border-white"
                >
                  <span>Przejdź do oferty produktu</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Flipbook Stage with Spring Scaling for Zoom */}
      <motion.div 
        animate={{ scale: zoomLevel }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="relative w-full max-w-[110rem] flex items-center justify-center py-2 my-auto"
      >
        {/* Navigation Arrow Left */}
        {currentPage > 1 && (
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={handlePrev}
            aria-label="Poprzednia strona katalogu"
            className="absolute left-2 sm:left-4 z-40 p-3.5 rounded-full bg-neutral-900/90 hover:bg-white text-white hover:text-black border border-neutral-700 hover:border-white shadow-2xl backdrop-blur-md transition-colors"
            title="Poprzednia strona"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        )}

        {/* Realistic PageFlip Container */}
        <div className="relative flex items-center justify-center p-2 sm:p-4 rounded-3xl bg-black/40 border border-neutral-800/80 backdrop-blur-md shadow-[0_35px_80px_-15px_rgba(0,0,0,0.9)]">
          <div 
            ref={bookRef}
            className="relative overflow-hidden cursor-grab active:cursor-grabbing rounded-xl shadow-2xl transition-all"
          >
            {catalog.pages.map((page) => {
              const isCover = page.pageNumber === 1 || page.pageNumber === totalPages;
              const isEven = page.pageNumber % 2 === 0;

              // Lazy loading strategy: Only render heavy image data for pages near the current spread (±2 pages)
              const isNearCurrent = Math.abs(page.pageNumber - currentPage) <= 2 || page.pageNumber === 1 || page.pageNumber === totalPages;

              return (
                <div
                  key={page.pageNumber}
                  className="flip-page relative w-full h-full bg-white overflow-hidden shadow-md select-none"
                  data-density={isCover ? 'hard' : 'soft'}
                >
                  {/* Page Image with Lazy Loading & Decoding */}
                  {isNearCurrent ? (
                    <img
                      src={page.dataUrl}
                      alt={`Strona ${page.pageNumber}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover pointer-events-none select-none"
                      style={{
                        imageRendering: dpr > 1.2 ? '-webkit-optimize-contrast' : 'auto',
                      }}
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex flex-col items-center justify-center p-4 text-neutral-400">
                      <BookOpen className="w-8 h-8 opacity-40 mb-2" />
                      <span className="text-xs font-bold font-mono">Strona {page.pageNumber}</span>
                    </div>
                  )}

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
                  <div className={`absolute bottom-0 ${isEven ? 'left-0' : 'right-0'} w-8 h-8 pointer-events-none bg-gradient-to-tl from-white/10 to-transparent opacity-60`} />

                  {/* Page Number Badge */}
                  <div 
                    className={`absolute bottom-2 ${isEven ? 'left-3' : 'right-3'} text-[10px] font-semibold text-neutral-700 bg-white/90 px-2 py-0.5 rounded shadow-sm border border-neutral-300 pointer-events-none`}
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
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={handleNext}
            aria-label="Następna strona katalogu"
            className="absolute right-2 sm:right-4 z-40 p-3.5 rounded-full bg-neutral-900/90 hover:bg-white text-white hover:text-black border border-neutral-700 hover:border-white shadow-2xl backdrop-blur-md transition-colors"
            title="Następna strona"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        )}
      </motion.div>

      {/* Helper hint for drag gestures & HiDPI indicator */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-neutral-400 bg-neutral-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-white" />
          <span>Przeciągnij narożnik strony lub kliknij strzałki, aby przekładać strony</span>
        </div>
        {dpr > 1 && (
          <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
            HiDPI {dpr}x
          </span>
        )}
      </div>
    </div>
  );
};


