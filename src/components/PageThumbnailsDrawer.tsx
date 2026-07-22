import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Bookmark as BookmarkIcon, 
  Tag, 
  Grid, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { CatalogMetadata, SearchResult } from '../types';
import { searchInPages } from '../utils/pdfLoader';

interface PageThumbnailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: CatalogMetadata | null;
  currentPage: number;
  onSelectPage: (pageNumber: number) => void;
  onRemoveBookmark: (pageNumber: number) => void;
  onRemoveHotspot: (hotspotId: string) => void;
}

export const PageThumbnailsDrawer: React.FC<PageThumbnailsDrawerProps> = ({
  isOpen,
  onClose,
  catalog,
  currentPage,
  onSelectPage,
  onRemoveBookmark,
  onRemoveHotspot,
}) => {
  const [activeTab, setActiveTab] = useState<'thumbnails' | 'search' | 'bookmarks' | 'hotspots'>('thumbnails');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  if (!isOpen || !catalog) return null;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (catalog) {
      const res = searchInPages(catalog.pages, q);
      setSearchResults(res);
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-full sm:w-96 apple-glass border-r border-white/10 text-slate-100 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Grid className="w-4 h-4 text-amber-500" />
            <span>Nawigacja Katalogu</span>
          </h2>
          <p className="text-xs text-slate-400 truncate max-w-[220px]">
            {catalog.title} ({catalog.totalPages} stron)
          </p>
        </div>
        <button
          onClick={onClose}
          className="apple-press-effect p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 p-2 bg-black/20 border-b border-white/10 text-xs font-semibold gap-1">
        <button
          onClick={() => setActiveTab('thumbnails')}
          className={`apple-press-effect py-2.5 px-1 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
            activeTab === 'thumbnails'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Miniatury</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`apple-press-effect py-2.5 px-1 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
            activeTab === 'search'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Szukaj</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`apple-press-effect py-2.5 px-1 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
            activeTab === 'bookmarks'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookmarkIcon className="w-4 h-4" />
          <span>Zakładki ({catalog.bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hotspots')}
          className={`apple-press-effect py-2.5 px-1 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
            activeTab === 'hotspots'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Punkty ({catalog.hotspots.length})</span>
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: THUMBNAILS GRID */}
        {activeTab === 'thumbnails' && (
          <div className="grid grid-cols-2 gap-3">
            {catalog.pages.map((page) => {
              const isCurrent = page.pageNumber === currentPage;
              const hasBookmark = catalog.bookmarks.some((b) => b.pageNumber === page.pageNumber);
              const hasHotspot = catalog.hotspots.some((h) => h.pageNumber === page.pageNumber);

              return (
                <div
                  key={page.pageNumber}
                  onClick={() => {
                    onSelectPage(page.pageNumber);
                    onClose();
                  }}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all p-1.5 ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg scale-[1.02]'
                      : 'border-slate-800 hover:border-slate-600 bg-slate-950/60'
                  }`}
                >
                  <div className="relative aspect-[1/1.4] rounded-lg overflow-hidden bg-slate-950">
                    <img
                      src={page.dataUrl}
                      alt={`Strona ${page.pageNumber}`}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                    
                    {/* Page Badges */}
                    <div className="absolute top-1 left-1 bg-slate-950/80 backdrop-blur-sm text-slate-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Str. {page.pageNumber}
                    </div>

                    <div className="absolute top-1 right-1 flex gap-1">
                      {hasBookmark && (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" title="Strona z zakładką" />
                      )}
                      {hasHotspot && (
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm" title="Strona z interaktywnym punktem" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: SEARCH */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Wpisz nazwę produktu, cenę..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>

            {searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                Brak wyników wyszukiwania dla &quot;{searchQuery}&quot;.
              </div>
            )}

            <div className="space-y-2">
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onSelectPage(res.pageNumber);
                    onClose();
                  }}
                  className="p-3 bg-slate-950/60 hover:bg-slate-800/60 rounded-xl border border-slate-800/80 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                    <span>Strona {res.pageNumber}</span>
                    <span className="text-[10px] text-slate-500">Przejdź &rarr;</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {res.textSnippet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BOOKMARKS */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-2">
            {catalog.bookmarks.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                Brak zapisanych zakładek. Kliknij ikony zakładki na dolnym pasku, aby oznaczyć ważne strony.
              </div>
            ) : (
              catalog.bookmarks.map((bm) => (
                <div
                  key={bm.pageNumber}
                  className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div
                    onClick={() => {
                      onSelectPage(bm.pageNumber);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-sm font-bold text-white">Strona {bm.pageNumber}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{bm.label}</p>
                  </div>
                  <button
                    onClick={() => onRemoveBookmark(bm.pageNumber)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                    title="Usuń zakładkę"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: HOTSPOTS */}
        {activeTab === 'hotspots' && (
          <div className="space-y-2">
            {catalog.hotspots.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                Brak interaktywnych punktów produktów. Dodaj je za pomocą przycisku &quot;+&quot; na dolnym pasku!
              </div>
            ) : (
              catalog.hotspots.map((hs) => (
                <div
                  key={hs.id}
                  className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start justify-between gap-2"
                >
                  <div
                    onClick={() => {
                      onSelectPage(hs.pageNumber);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                        Str. {hs.pageNumber}
                      </span>
                      {hs.tag && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold">
                          {hs.tag}
                        </span>
                      )}
                      <span className="text-sm font-bold text-white truncate">{hs.title}</span>
                    </div>
                    {hs.price && <div className="text-xs font-bold text-emerald-400">{hs.price}</div>}
                    {hs.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{hs.description}</p>}
                    {hs.url && (
                      <a
                        href={hs.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline mt-1"
                      >
                        <span>Otwórz link zewnętrzny</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveHotspot(hs.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
