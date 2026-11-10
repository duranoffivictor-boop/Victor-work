import React from 'react';
import {
  Eye,
  FileCheck2,
  Globe,
  BookOpen,
  Ruler as RulerIcon,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
} from 'lucide-react';
import { ViewMode } from '../../types/document';

interface ViewTabProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  zoom: number;
  onChangeZoom: (zoom: number) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const ZOOM_PRESETS = [50, 75, 90, 100, 125, 150, 200];

export const ViewTab: React.FC<ViewTabProps> = ({
  viewMode,
  onChangeViewMode,
  showRuler,
  onToggleRuler,
  zoom,
  onChangeZoom,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <div className="flex items-center flex-wrap gap-1 px-4 py-1.5 text-xs select-none">
      {/* 1. Vistas de Documento */}
      <div className="flex items-center gap-1 pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <button
          onClick={() => onChangeViewMode('print')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors ${
            viewMode === 'print'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Diseño de Impresión</span>
        </button>

        <button
          onClick={() => onChangeViewMode('web')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors ${
            viewMode === 'web'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Diseño Web</span>
        </button>

        <button
          onClick={() => onChangeViewMode('reading')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors ${
            viewMode === 'reading'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Modo Lectura</span>
        </button>
      </div>

      {/* 2. Regla */}
      <div className="flex items-center gap-1 pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <button
          onClick={onToggleRuler}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors ${
            showRuler
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <RulerIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          <span>Regla {showRuler ? 'Activada' : 'Oculta'}</span>
        </button>
      </div>

      {/* 3. Zoom */}
      <div className="flex items-center gap-1 pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <button
          onClick={() => onChangeZoom(Math.max(50, zoom - 10))}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          title="Alejar zoom"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="w-12 text-center font-mono font-medium text-slate-700 dark:text-slate-200">
          {zoom}%
        </span>

        <button
          onClick={() => onChangeZoom(Math.min(200, zoom + 10))}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          title="Acercar zoom"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-0.5 ml-1">
          {ZOOM_PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => onChangeZoom(p)}
              className={`px-1.5 py-0.5 rounded text-[11px] ${
                zoom === p
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {p}%
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tema de la interfaz */}
      <div className="flex items-center gap-1 pl-1">
        <button
          onClick={onToggleDarkMode}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>Modo Oscuro</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
