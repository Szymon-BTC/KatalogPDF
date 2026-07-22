import React, { useRef, useState } from 'react';
import { X, Upload, FileText, Sparkles, Check, Loader2 } from 'lucide-react';
import { SAMPLE_CATALOGS } from '../utils/samplePdfs';

interface PdfUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSampleCatalog: (catalogId: string) => void;
  onUploadPdfFile: (file: File) => void;
  isLoading: boolean;
  loadingProgressMsg: string;
}

export const PdfUploaderModal: React.FC<PdfUploaderModalProps> = ({
  isOpen,
  onClose,
  onSelectSampleCatalog,
  onUploadPdfFile,
  isLoading,
  loadingProgressMsg,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        onUploadPdfFile(file);
      } else {
        alert('Proszę wybrać poprawny plik w formacie PDF.');
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onUploadPdfFile(file);
      } else {
        alert('Proszę upuścić plik w formacie PDF.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="apple-glass rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto border border-white/15">
        {!isLoading && (
          <button
            onClick={onClose}
            className="apple-press-effect absolute top-5 right-5 p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold mb-3 shadow-lg shadow-amber-500/20">
            <Upload className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Wczytaj Katalog PDF</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Wybierz własny plik PDF z dysku lub wypróbuj jeden z naszych przykładowych magazynów i katalogów produktów.
          </p>
        </div>

        {/* Loading State Overlay */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
              <Loader2 className="w-8 h-8 text-amber-500 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Generowanie i przetwarzanie PDF...</h3>
              <p className="text-xs text-amber-400 mt-1 font-mono">{loadingProgressMsg}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Local PDF Drag and Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-amber-500 bg-amber-500/10 scale-[1.01]'
                  : 'border-white/15 hover:border-amber-500/60 bg-black/20 hover:bg-black/40'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />
              <FileText className="w-10 h-10 text-amber-500 mx-auto mb-3 animate-bounce" />
              <h3 className="text-base font-bold text-white">
                Przeciągnij i upuść plik PDF tutaj
              </h3>
              <p className="text-xs text-slate-400 mt-1">lub kliknij, aby przeglądać pliki na komputerze</p>
              <div className="inline-block mt-4 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                Obsługuje dowolne katalogi PDF, magazyny, gazety, menu i broszury
              </div>
            </div>

            {/* Preloaded Sample Catalogs Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Przykładowe Katalogi Demonstracyjne</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SAMPLE_CATALOGS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => onSelectSampleCatalog(sample.id)}
                    className="apple-press-effect group relative p-4 rounded-3xl bg-black/30 hover:bg-black/50 border border-white/10 hover:border-amber-500/60 cursor-pointer transition-all shadow-md flex items-start justify-between gap-3"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                        {sample.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                        {sample.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sample.subtitle}</p>
                      <div className="text-[11px] text-slate-500 mt-2 font-medium">
                        {sample.totalPages} stron • Wysoka jakość PDF
                      </div>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white/5 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 transition-all border border-white/10">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
