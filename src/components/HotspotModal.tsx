import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Tag, PlusCircle } from 'lucide-react';
import { Hotspot } from '../types';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface HotspotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onSaveHotspot: (hotspot: Omit<Hotspot, 'id'>) => void;
}

export const HotspotModal: React.FC<HotspotModalProps> = ({
  isOpen,
  onClose,
  currentPage,
  onSaveHotspot,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');
  const [tag, setTag] = useState<'NOWOŚĆ' | 'PROMOCJA' | 'HIT' | 'INFO'>('NOWOŚĆ');
  const [xPercent, setXPercent] = useState(50);
  const [yPercent, setYPercent] = useState(50);

  useModalAccessibility({
    isOpen,
    onClose,
    containerRef,
    initialFocusRef: titleInputRef,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveHotspot({
      pageNumber: currentPage,
      xPercent,
      yPercent,
      title: title.trim(),
      description: description.trim() || undefined,
      price: price.trim() || undefined,
      url: url.trim() || undefined,
      tag,
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setPrice('');
    setUrl('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hotspot-modal-title"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="apple-glass rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl text-slate-100 relative border border-white/15"
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              aria-label="Zamknij okno dodawania produktu"
              className="absolute top-4 right-4 p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl bg-white text-black font-bold shadow-md">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 id="hotspot-modal-title" className="text-lg font-bold text-white tracking-tight">
                  Dodaj Punkt Produktu
                </h3>
                <p className="text-xs text-neutral-400">Strona {currentPage} w katalogu</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="hotspot-title" className="block text-xs font-semibold text-neutral-300 mb-1">
                  Nazwa produktu / Nagłówek *
                </label>
                <input
                  id="hotspot-title"
                  ref={titleInputRef}
                  type="text"
                  required
                  placeholder="np. Sofa Velvet Royal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-800 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="hotspot-price" className="block text-xs font-semibold text-neutral-300 mb-1">
                    Cena (opcjonalnie)
                  </label>
                  <input
                    id="hotspot-price"
                    type="text"
                    placeholder="np. 2 499 PLN"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-800 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="hotspot-tag" className="block text-xs font-semibold text-neutral-300 mb-1">
                    Etykieta Badge
                  </label>
                  <select
                    id="hotspot-tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-black/40 border border-neutral-800 rounded-2xl text-xs text-white focus:outline-none focus:border-white transition-all"
                  >
                    <option value="NOWOŚĆ" className="bg-neutral-900 text-white">NOWOŚĆ</option>
                    <option value="PROMOCJA" className="bg-neutral-900 text-white">PROMOCJA</option>
                    <option value="HIT" className="bg-neutral-900 text-white">HIT</option>
                    <option value="INFO" className="bg-neutral-900 text-white">INFO</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="hotspot-description" className="block text-xs font-semibold text-neutral-300 mb-1">
                  Opis / Szczegóły
                </label>
                <textarea
                  id="hotspot-description"
                  rows={2}
                  placeholder="Krótki opis produktu, materiałów lub specyfikacji..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-800 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-all"
                />
              </div>

              <div>
                <label htmlFor="hotspot-url" className="block text-xs font-semibold text-neutral-300 mb-1">
                  Link do sklepu (URL)
                </label>
                <input
                  id="hotspot-url"
                  type="url"
                  placeholder="https://twojsklep.pl/produkt"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-neutral-800 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-all"
                />
              </div>

              {/* Position Sliders */}
              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 space-y-3">
                <div className="text-xs font-bold text-neutral-300">Położenie znacznika na stronie:</div>
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Pozycja X (Poziom)</span>
                    <span>{xPercent}%</span>
                  </div>
                  <input
                    type="range"
                    aria-label="Pozycja X punktu na stronie w procentach"
                    min="5"
                    max="95"
                    value={xPercent}
                    onChange={(e) => setXPercent(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Pozycja Y (Pion)</span>
                    <span>{yPercent}%</span>
                  </div>
                  <input
                    type="range"
                    aria-label="Pozycja Y punktu na stronie w procentach"
                    min="5"
                    max="95"
                    value={yPercent}
                    onChange={(e) => setYPercent(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 text-sm border border-white"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Zapisz Punkt Produktu</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

