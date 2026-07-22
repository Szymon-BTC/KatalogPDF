import React, { useState } from 'react';
import { X, Tag, PlusCircle } from 'lucide-react';
import { Hotspot } from '../types';

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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');
  const [tag, setTag] = useState<'NOWOŚĆ' | 'PROMOCJA' | 'HIT' | 'INFO'>('NOWOŚĆ');
  const [xPercent, setXPercent] = useState(50);
  const [yPercent, setYPercent] = useState(50);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="apple-glass rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl text-slate-100 relative border border-white/15">
        <button
          onClick={onClose}
          className="apple-press-effect absolute top-4 right-4 p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Dodaj Punkt Produktu</h3>
            <p className="text-xs text-slate-400">Strona {currentPage} w katalogu</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nazwa produktu / Nagłówek *</label>
            <input
              type="text"
              required
              placeholder="np. Sofa Velvet Royal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cena (opcjonalnie)</label>
              <input
                type="text"
                placeholder="np. 2 499 PLN"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Etykieta Badge</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-400 transition-all"
              >
                <option value="NOWOŚĆ">NOWOŚĆ</option>
                <option value="PROMOCJA">PROMOCJA</option>
                <option value="HIT">HIT</option>
                <option value="INFO">INFO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Opis / Szczegóły</label>
            <textarea
              rows={2}
              placeholder="Krótki opis produktu, materiałów lub specyfikacji..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Link do sklepu (URL)</label>
            <input
              type="url"
              placeholder="https://twojsklep.pl/produkt"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
            />
          </div>

          {/* Position Sliders */}
          <div className="bg-black/20 p-3.5 rounded-2xl border border-white/10 space-y-3">
            <div className="text-xs font-bold text-slate-300">Położenie znacznika na stronie:</div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Pozycja X (Poziom)</span>
                <span>{xPercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={xPercent}
                onChange={(e) => setXPercent(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Pozycja Y (Pion)</span>
                <span>{yPercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={yPercent}
                onChange={(e) => setYPercent(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="apple-press-effect w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Zapisz Punkt Produktu</span>
          </button>
        </form>
      </div>
    </div>
  );
};
