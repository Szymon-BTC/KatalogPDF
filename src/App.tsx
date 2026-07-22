import React, { useState, useEffect, useCallback } from 'react';
import { CatalogMetadata, ViewMode, BackgroundTheme, Hotspot } from './types';
import { SAMPLE_CATALOGS } from './utils/samplePdfs';
import { loadPdfPagesFromArrayBuffer } from './utils/pdfLoader';
import { CatalogHeader } from './components/CatalogHeader';
import { MagazineFlipbook } from './components/MagazineFlipbook';
import { CatalogToolbar } from './components/CatalogToolbar';
import { PageThumbnailsDrawer } from './components/PageThumbnailsDrawer';
import { PdfUploaderModal } from './components/PdfUploaderModal';
import { AiCatalogAssistant } from './components/AiCatalogAssistant';
import { HotspotModal } from './components/HotspotModal';
import { HelpModal } from './components/HelpModal';
import { BookOpen, Upload, Loader2, Grid } from 'lucide-react';

export default function App() {
  const [catalog, setCatalog] = useState<CatalogMetadata | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('double');
  const [theme, setTheme] = useState<BackgroundTheme>('dark-wood');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Autoplay
  const [isAutoplay, setIsAutoplay] = useState<boolean>(false);
  const [autoplayInterval, setAutoplayInterval] = useState<number>(5);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isThumbnailsDrawerOpen, setIsThumbnailsDrawerOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isHotspotModalOpen, setIsHotspotModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Loading indicator for PDF processing
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);
  const [loadingProgressMsg, setLoadingProgressMsg] = useState<string>('Ładowanie katalogu startowego...');

  // Helper to load a PDF array buffer into state
  const handleLoadPdfBuffer = useCallback(async (
    buffer: ArrayBuffer,
    title: string,
    subtitle?: string,
    initialHotspots: Hotspot[] = []
  ) => {
    setIsLoadingPdf(true);
    try {
      const { pages, title: extractedTitle } = await loadPdfPagesFromArrayBuffer(
        buffer,
        (current, total, msg) => {
          setLoadingProgressMsg(msg);
        }
      );

      const newCatalog: CatalogMetadata = {
        id: 'cat-' + Date.now(),
        title: title || extractedTitle || 'Katalog PDF',
        subtitle: subtitle || 'Wersja cyfrowa interaktywna',
        totalPages: pages.length,
        pages,
        hotspots: initialHotspots,
        bookmarks: [
          { pageNumber: 1, label: 'Okładka Główna', color: '#f59e0b', createdAt: new Date().toLocaleTimeString() }
        ],
        loadedAt: new Date().toISOString(),
      };

      setCatalog(newCatalog);
      setCurrentPage(1);
    } catch (err: any) {
      console.error('Błąd podczas ładowania PDF:', err);
      alert('Nie udało się wczytać pliku PDF. Upewnij się, że plik jest nieuszkodzony.');
    } finally {
      setIsLoadingPdf(false);
      setIsUploadModalOpen(false);
    }
  }, []);

  // Load default sample catalog on mount
  useEffect(() => {
    const loadDefaultSample = async () => {
      const defaultSample = SAMPLE_CATALOGS[0];
      const buffer = defaultSample.generatePdf();

      // Sample hotspots for default furniture catalog
      const defaultHotspots: Hotspot[] = [
        {
          id: 'hs-1',
          pageNumber: 3,
          xPercent: 50,
          yPercent: 45,
          title: 'Sofa Velvet Royal 3-Os.',
          description: 'Luksusowa sofa w granatowym aksamicie hydrofobowym.',
          price: '4 899 PLN',
          tag: 'HIT',
          url: 'https://example.com/sofa-velvet',
        },
        {
          id: 'hs-2',
          pageNumber: 4,
          xPercent: 50,
          yPercent: 45,
          title: 'Stół Dębowy Artisan',
          description: 'Lite drewno dębowe ze stalową czarną podstawą.',
          price: '5 499 PLN',
          tag: 'NOWOŚĆ',
          url: 'https://example.com/stol-artisan',
        },
      ];

      await handleLoadPdfBuffer(
        buffer.buffer as ArrayBuffer,
        defaultSample.title,
        defaultSample.subtitle,
        defaultHotspots
      );
    };

    loadDefaultSample();
  }, [handleLoadPdfBuffer]);

  // Autoplay effect
  useEffect(() => {
    if (!isAutoplay || !catalog) return;

    const timer = setInterval(() => {
      setCurrentPage((prev) => {
        if (prev >= catalog.totalPages) {
          setIsAutoplay(false);
          return prev;
        }
        return viewMode === 'double' ? Math.min(catalog.totalPages, prev + 2) : prev + 1;
      });
    }, autoplayInterval * 1000);

    return () => clearInterval(timer);
  }, [isAutoplay, autoplayInterval, catalog, viewMode]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Sample Selector handler
  const handleSelectSample = async (sampleId: string) => {
    const sampleDef = SAMPLE_CATALOGS.find((s) => s.id === sampleId);
    if (!sampleDef) return;

    const buffer = sampleDef.generatePdf();
    await handleLoadPdfBuffer(buffer.buffer as ArrayBuffer, sampleDef.title, sampleDef.subtitle);
  };

  // File Upload handler
  const handleUploadFile = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    await handleLoadPdfBuffer(arrayBuffer, file.name.replace('.pdf', ''), 'Załadowany plik użytkownika');
  };

  // Bookmark handlers
  const handleAddBookmark = () => {
    if (!catalog) return;
    const exists = catalog.bookmarks.some((b) => b.pageNumber === currentPage);
    if (exists) {
      // Remove
      setCatalog({
        ...catalog,
        bookmarks: catalog.bookmarks.filter((b) => b.pageNumber !== currentPage),
      });
    } else {
      // Add
      setCatalog({
        ...catalog,
        bookmarks: [
          ...catalog.bookmarks,
          {
            pageNumber: currentPage,
            label: `Zakładka Strona ${currentPage}`,
            color: '#f59e0b',
            createdAt: new Date().toLocaleTimeString(),
          },
        ],
      });
    }
  };

  // Hotspot handlers
  const handleSaveHotspot = (hotspotData: Omit<Hotspot, 'id'>) => {
    if (!catalog) return;
    const newHotspot: Hotspot = {
      ...hotspotData,
      id: 'hs-' + Date.now(),
    };
    setCatalog({
      ...catalog,
      hotspots: [...catalog.hotspots, newHotspot],
    });
  };

  const handleRemoveHotspot = (hotspotId: string) => {
    if (!catalog) return;
    setCatalog({
      ...catalog,
      hotspots: catalog.hotspots.filter((h) => h.id !== hotspotId),
    });
  };

  const handleRemoveBookmark = (pageNum: number) => {
    if (!catalog) return;
    setCatalog({
      ...catalog,
      bookmarks: catalog.bookmarks.filter((b) => b.pageNumber !== pageNum),
    });
  };

  const isCurrentBookmarked = catalog?.bookmarks.some((b) => b.pageNumber === currentPage) || false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden select-none">
      {/* Top Header */}
      <CatalogHeader
        catalog={catalog}
        currentPage={currentPage}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenSearch={() => setIsThumbnailsDrawerOpen(true)}
        onOpenThumbnails={() => setIsThumbnailsDrawerOpen(true)}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />

      {/* Main Content View */}
      <main className="flex-1 flex flex-col items-center justify-center relative pb-24">
        {isLoadingPdf && !catalog ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            <p className="text-sm text-slate-300 font-medium font-mono">{loadingProgressMsg}</p>
          </div>
        ) : catalog ? (
          viewMode === 'grid' ? (
            /* Grid Mode View */
            <div className="max-w-6xl mx-auto p-6 w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Grid className="w-5 h-5 text-amber-500" />
                  <span>Przegląd Wszystkich Stron ({catalog.totalPages})</span>
                </h2>
                <button
                  onClick={() => setViewMode('double')}
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Powrót do Trybu Magazynu
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {catalog.pages.map((p) => (
                  <div
                    key={p.pageNumber}
                    onClick={() => {
                      setCurrentPage(p.pageNumber);
                      setViewMode('double');
                    }}
                    className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all p-2 bg-slate-900 ${
                      p.pageNumber === currentPage ? 'border-amber-500 shadow-xl scale-105' : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="aspect-[1/1.4] bg-slate-950 rounded-lg overflow-hidden">
                      <img src={p.dataUrl} alt={`Strona ${p.pageNumber}`} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="mt-2 text-center text-xs font-bold text-slate-300">
                      Strona {p.pageNumber}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Interactive 3D Magazine View */
            <MagazineFlipbook
              catalog={catalog}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              viewMode={viewMode}
              theme={theme}
              zoomLevel={zoomLevel}
              soundEnabled={soundEnabled}
              onOpenHotspotModal={() => setIsHotspotModalOpen(true)}
            />
          )
        ) : (
          /* Empty State */
          <div className="text-center py-20 px-4">
            <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Brak Wczytanego Katalogu</h2>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl shadow-lg inline-flex items-center gap-2 text-sm"
            >
              <Upload className="w-5 h-5" />
              <span>Wczytaj Plik PDF</span>
            </button>
          </div>
        )}
      </main>

      {/* Floating Toolbar Controls */}
      {catalog && (
        <CatalogToolbar
          currentPage={currentPage}
          totalPages={catalog.totalPages}
          zoomLevel={zoomLevel}
          onZoomIn={() => setZoomLevel((z) => Math.min(2.5, z + 0.15))}
          onZoomOut={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
          onZoomReset={() => setZoomLevel(1.0)}
          onPrevPage={() => {
            if (currentPage > 1) {
              setCurrentPage((p) => (viewMode === 'double' ? Math.max(1, p - 2) : p - 1));
            }
          }}
          onNextPage={() => {
            if (currentPage < catalog.totalPages) {
              setCurrentPage((p) => (viewMode === 'double' ? Math.min(catalog.totalPages, p + 2) : p + 1));
            }
          }}
          onFirstPage={() => setCurrentPage(1)}
          onLastPage={() => setCurrentPage(catalog.totalPages)}
          onGoToPage={setCurrentPage}
          currentTheme={theme}
          onChangeTheme={setTheme}
          isAutoplay={isAutoplay}
          onToggleAutoplay={() => setIsAutoplay(!isAutoplay)}
          autoplayInterval={autoplayInterval}
          onChangeAutoplayInterval={setAutoplayInterval}
          onAddBookmark={handleAddBookmark}
          isBookmarked={isCurrentBookmarked}
          onOpenHotspotModal={() => setIsHotspotModalOpen(true)}
          onOpenHelpModal={() => setIsHelpModalOpen(true)}
        />
      )}

      {/* Slide-out Drawers & Modals */}
      <PageThumbnailsDrawer
        isOpen={isThumbnailsDrawerOpen}
        onClose={() => setIsThumbnailsDrawerOpen(false)}
        catalog={catalog}
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        onRemoveBookmark={handleRemoveBookmark}
        onRemoveHotspot={handleRemoveHotspot}
      />

      <PdfUploaderModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSelectSampleCatalog={handleSelectSample}
        onUploadPdfFile={handleUploadFile}
        isLoading={isLoadingPdf}
        loadingProgressMsg={loadingProgressMsg}
      />

      <AiCatalogAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        catalog={catalog}
        currentPage={currentPage}
      />

      <HotspotModal
        isOpen={isHotspotModalOpen}
        onClose={() => setIsHotspotModalOpen(false)}
        currentPage={currentPage}
        onSaveHotspot={handleSaveHotspot}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
