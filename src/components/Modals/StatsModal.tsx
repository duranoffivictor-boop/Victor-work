import React from 'react';
import { BarChart3, X, BookOpen, Clock, FileText } from 'lucide-react';
import { DocumentStats } from '../../types/document';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DocumentStats;
  pageCount: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  pageCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Contar Palabras y Estadísticas
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-3">
          <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Páginas estimadas:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {pageCount}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Palabras:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {stats.words.toLocaleString('es-ES')}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Caracteres (sin espacios):</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {stats.charactersNoSpaces.toLocaleString('es-ES')}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Caracteres (con espacios):</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {stats.characters.toLocaleString('es-ES')}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Párrafos:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {stats.paragraphs.toLocaleString('es-ES')}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Tiempo de lectura estimado:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              ~{stats.readingTimeMinutes} min
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs min-h-[44px]"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
