import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, BookOpen, Sparkles, Volume2, PlusCircle } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useModalAccessibility({
    isOpen,
    onClose,
    containerRef,
  });

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
            aria-labelledby="help-modal-title"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="apple-glass rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl text-slate-100 relative max-h-[85vh] overflow-y-auto border border-white/15"
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              aria-label="Zamknij instrukcję obsługi i skróty"
              className="absolute top-5 right-5 p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-white text-black font-bold shadow-md">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 id="help-modal-title" className="text-xl font-bold text-white tracking-tight">
                  Instrukcja Obsługi & Skróty
                </h3>
                <p className="text-xs text-neutral-400">Interaktywny Magazyn / Katalog PDF</p>
              </div>
            </div>

            <div className="space-y-5 text-xs text-neutral-300">
              {/* Keyboard Shortcuts */}
              <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">⌨️ Skróty Klawiszowe:</h4>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span>Następna strona</span>
                    <kbd className="px-2 py-0.5 rounded-lg bg-white/10 text-white border border-white/10 text-[10px]">&rarr; / Space</kbd>
                  </div>
                  <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span>Poprzednia strona</span>
                    <kbd className="px-2 py-0.5 rounded-lg bg-white/10 text-white border border-white/10 text-[10px]">&larr;</kbd>
                  </div>
                </div>
              </div>

              {/* Features Overview */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3.5 bg-neutral-900/60 rounded-2xl border border-white/10">
                  <BookOpen className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white text-xs block">Widok Dwustronicowy (Spread):</span>
                    <span>Realistyczny układ rozkładówki czasopisma ze szwami, cieniem grzbietu oraz fizyką kartkowania.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-neutral-900/60 rounded-2xl border border-white/10">
                  <Sparkles className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white text-xs block">AI Asystent Gemini:</span>
                    <span>Zadawaj pytania o produkty, proś o zestawienia cenowe lub podsumowania rozkładówek.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-neutral-900/60 rounded-2xl border border-white/10">
                  <PlusCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white text-xs block">Interaktywne Punkty Produktów (Hotspots):</span>
                    <span>Dodawaj klikalne punkty z opisem, ceną, plakietką PROMOCJA/HIT oraz odnośnikiem zewnętrznym do sklepu.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-neutral-900/60 rounded-2xl border border-white/10">
                  <Volume2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white text-xs block">Dźwięk Kartkowania & Auto-Flip:</span>
                    <span>Syntetyzowany realistyczny szelest papieru oraz automatyczny tryb pokazu slajdów.</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={onClose}
              className="w-full mt-6 py-3 bg-white hover:bg-neutral-200 text-black font-bold rounded-2xl shadow-lg transition-colors text-sm border border-white"
            >
              Rozumiem, zamknij
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

