import React, { useState } from 'react';
import {
  Download,
  Printer,
  X,
  FileCheck2,
  Check,
  Share2,
  Smartphone,
  Save,
} from 'lucide-react';
import { EXPORT_FORMATS, ExportFormatOption, exportDocument } from '../../utils/exportFormats';
import { DocumentState } from '../../types/document';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  docState: DocumentState;
  docElement: HTMLElement | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  docState,
  docElement,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatOption['id']>('docx');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const isMobile =
    typeof navigator !== 'undefined' &&
    (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768);

  const canNativeShare = typeof navigator !== 'undefined' && 'canShare' in navigator;

  const handleDownload = async (formatId: ExportFormatOption['id'], preferShare: boolean = false) => {
    setIsExporting(true);
    setExportSuccess(null);
    try {
      await exportDocument(formatId, docState, docElement, preferShare);
      const fmt = EXPORT_FORMATS.find((f) => f.id === formatId);
      setExportSuccess(
        preferShare
          ? `¡Documento preparado para guardar o compartir en tu móvil!`
          : `¡Archivo ${fmt?.name} generado exitosamente!`
      );
      setTimeout(() => {
        setExportSuccess(null);
      }, 4000);
    } catch (err: any) {
      console.error('Export error:', err);
      alert(`Error al exportar: ${err.message || 'Error desconocido'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const currentOption = EXPORT_FORMATS.find((f) => f.id === selectedFormat) || EXPORT_FORMATS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Exportar y Guardar Documento
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Guarda en tu móvil o PC en formato Word (.docx), PDF o texto estándar.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formats Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Mobile Direct Share Card Highlight */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-950 dark:text-blue-100">
                  Guardar directamente en tu teléfono móvil
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-300">
                  Abre el menú nativo para guardar en "Archivos", "Descargas", Drive o compartir por WhatsApp.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDownload(selectedFormat, true)}
              disabled={isExporting}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 shrink-0 min-h-[42px]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Guardar en el Móvil</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {EXPORT_FORMATS.map((fmt) => {
              const isSelected = selectedFormat === fmt.id;
              return (
                <div
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`p-3 sm:p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 relative min-h-[56px] ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg ${fmt.iconColor} flex items-center justify-center font-bold text-[11px] shrink-0 shadow-xs`}
                  >
                    {fmt.extension.toUpperCase().replace('.', '')}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {fmt.name}
                      </span>
                      {fmt.badge && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                          {fmt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {fmt.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute right-3 top-3 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Print Alternative */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  Imprimir o Guardar como PDF del sistema
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Abre la vista previa de impresión nativa de tu dispositivo.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                window.print();
              }}
              className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[38px]"
            >
              Imprimir
            </button>
          </div>

          {exportSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{exportSuccess}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Archivo: <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{docState.title || 'Documento'}{currentOption.extension}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors min-h-[44px]"
            >
              Cerrar
            </button>
            <button
              onClick={() => handleDownload(selectedFormat, false)}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generando...' : `Descargar archivo`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
