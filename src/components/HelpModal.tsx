import React from 'react';
import { X, HelpCircle, ArrowRight, BookOpen, Sparkles, Volume2, PlusCircle, Search } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="apple-glass rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl text-slate-100 relative max-h-[85vh] overflow-y-auto border border-white/15">
        <button
          onClick={onClose}
          className="apple-press-effect absolute top-5 right-5 p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Instrukcja Obsługi & Skróty</h3>
            <p className="text-xs text-slate-400">Interaktywny Magazyn / Katalog PDF</p>
          </div>
        </div>

        <div className="space-y-5 text-xs text-slate-300">
          {/* Keyboard Shortcuts */}
          <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-2">
            <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-2">⌨️ Skróty Klawiszowe:</h4>
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/5">
                <span>Następna strona</span>
                <kbd className="px-2 py-0.5 rounded-lg bg-white/10 text-amber-300 border border-white/10 text-[10px]">&rarr; / Space</kbd>
              </div>
              <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/5">
                <span>Poprzednia strona</span>
                <kbd className="px-2 py-0.5 rounded-lg bg-white/10 text-amber-300 border border-white/10 text-[10px]">&larr;</kbd>
              </div>
            </div>
          </div>

          {/* Features Overview */}
          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3.5 bg-black/20 rounded-2xl border border-white/10">
              <BookOpen className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white text-xs block">Widok Dwustronicowy (Spread):</span>
                <span>Realistyczny układ rozkładówki czasopisma ze szwami, cieniem grzbietu oraz fizyką kartkowania.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-black/20 rounded-2xl border border-white/10">
              <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white text-xs block">AI Asystent Gemini:</span>
                <span>Zadawaj pytania o produkty, proś o zestawienia cenowe lub podsumowania rozkładówek.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-black/20 rounded-2xl border border-white/10">
              <PlusCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white text-xs block">Interaktywne Punkty Produktów (Hotspots):</span>
                <span>Dodawaj klikalne punkty z opisem, ceną, plakietką PROMOCJA/HIT oraz odnośnikiem zewnętrznym do sklepu.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-black/20 rounded-2xl border border-white/10">
              <Volume2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white text-xs block">Dźwięk Kartkowania & Auto-Flip:</span>
                <span>Syntetyzowany realistyczny szelest papieru oraz automatyczny tryb pokazu slajdów.</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="apple-press-effect w-full mt-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all text-sm"
        >
          Rozumiem, zamknij
        </button>
      </div>
    </div>
  );
};
