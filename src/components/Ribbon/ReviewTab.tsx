import React from 'react';
import {
  Sparkles,
  BarChart3,
  Search,
  CheckCircle2,
  Languages,
  BookOpen,
} from 'lucide-react';

interface ReviewTabProps {
  onOpenStats: () => void;
  onOpenAiAssistant: (action?: string) => void;
  onOpenFindReplace: () => void;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  onOpenStats,
  onOpenAiAssistant,
  onOpenFindReplace,
}) => {
  return (
    <div className="flex items-center flex-wrap gap-1 px-4 py-1.5 text-xs select-none">
      {/* 1. Estadísticas */}
      <div className="flex items-center gap-1 pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <button
          onClick={onOpenStats}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Contar Palabras</span>
        </button>
      </div>

      {/* 2. Asistente Editorial con Inteligencia Artificial */}
      <div className="flex items-center gap-1 pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <button
          onClick={() => onOpenAiAssistant('grammar')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Corregir Ortografía</span>
        </button>

        <button
          onClick={() => onOpenAiAssistant('improve')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Mejorar Redacción</span>
        </button>

        <button
          onClick={() => onOpenAiAssistant('summarize')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Resumir</span>
        </button>

        <button
          onClick={() => onOpenAiAssistant('translate_en')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <Languages className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Traducir</span>
        </button>
      </div>

      {/* 3. Búsqueda y Navegación */}
      <div className="flex items-center gap-1 pl-1">
        <button
          onClick={onOpenFindReplace}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span>Buscar y Reemplazar</span>
        </button>
      </div>
    </div>
  );
};
