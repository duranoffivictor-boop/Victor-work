import React from 'react';
import {
  FileCheck2,
  Globe,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Check,
  Languages,
} from 'lucide-react';
import { DocumentStats, ViewMode } from '../types/document';

interface StatusBarProps {
  stats: DocumentStats;
  pageCount: number;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  zoom: number;
  onChangeZoom: (zoom: number) => void;
  isSaving: boolean;
  onOpenStats: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  stats,
  pageCount,
  viewMode,
  onChangeViewMode,
  zoom,
  onChangeZoom,
  isSaving,
  onOpenStats,
}) => {
  return (
    <footer className="h-6 bg-slate-200 dark:bg-slate-800 border-t border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 flex items-center justify-between text-[11px] select-none no-print">
      {/* Left zone: Word & Page Metrics (clickable for stats modal) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenStats}
          className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          title="Ver estadísticas del documento"
        >
          Página 1 de {pageCount}
        </button>

        <span className="text-slate-400">|</span>

        <button
          onClick={onOpenStats}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors tabular-nums"
          title="Ver recuento de palabras"
        >
          {stats.words.toLocaleString('es-ES')} palabras
        </button>

        <span className="text-slate-400 hidden sm:inline">|</span>

        <div className="hidden sm:flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <Languages className="w-3 h-3" />
          <span>Español</span>
        </div>

        <span className="text-slate-400 hidden md:inline">|</span>

        <div className="hidden md:flex items-center gap-1 text-slate-500 dark:text-slate-400">
          {isSaving ? (
            <span className="italic text-blue-600 dark:text-blue-400">Guardando...</span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Check className="w-3 h-3" />
              <span>Guardado</span>
            </span>
          )}
        </div>
      </div>

      {/* Right zone: View Mode Switcher and Zoom Slider */}
      <div className="flex items-center gap-3">
        {/* View mode toggles */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onChangeViewMode('print')}
            className={`p-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${
              viewMode === 'print' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
            }`}
            title="Diseño de impresión"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeViewMode('web')}
            className={`p-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${
              viewMode === 'web' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
            }`}
            title="Diseño web"
          >
            <Globe className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeViewMode('reading')}
            className={`p-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 ${
              viewMode === 'reading' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
            }`}
            title="Modo lectura"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="text-slate-400">|</span>

        {/* Zoom Slider */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onChangeZoom(Math.max(50, zoom - 10))}
            className="hover:text-blue-600 dark:hover:text-blue-400 p-0.5"
            title="Disminuir zoom"
          >
            <ZoomOut className="w-3 h-3" />
          </button>

          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={zoom}
            onChange={(e) => onChangeZoom(parseInt(e.target.value, 10))}
            className="w-16 h-1 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <button
            onClick={() => onChangeZoom(Math.min(200, zoom + 10))}
            className="hover:text-blue-600 dark:hover:text-blue-400 p-0.5"
            title="Aumentar zoom"
          >
            <ZoomIn className="w-3 h-3" />
          </button>

          <button
            onClick={() => onChangeZoom(100)}
            className="w-9 text-right font-mono tabular-nums text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
            title="Restablecer zoom al 100%"
          >
            {zoom}%
          </button>
        </div>
      </div>
    </footer>
  );
};
