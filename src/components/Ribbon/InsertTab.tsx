import React, { useRef, useState } from 'react';
import {
  Table as TableIcon,
  Image as ImageIcon,
  SeparatorHorizontal,
  Link2,
  Calendar,
  Sparkles,
  Info,
  ChevronDown,
} from 'lucide-react';
import {
  insertPageBreak,
  insertCallout,
  insertDateStamp,
  insertHtmlAtCursor,
  executeCommand,
} from '../../utils/editorCommands';

interface InsertTabProps {
  onOpenTableModal: () => void;
}

const COMMON_SYMBOLS = [
  '€', '£', '¥', '$', '¢', '©', '®', '™', '°', '±', '≠', '≈', '≤', '≥', '×', '÷', '√', '∞',
  '→', '←', '↑', '↓', '↔', '★', '✓', '✗', '•', '·', '—', '–', '¶', '§', '¿', '¡', '«', '»',
];

export const InsertTab: React.FC<InsertTabProps> = ({ onOpenTableModal }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSymbols, setShowSymbols] = useState(false);
  const [showCallouts, setShowCallouts] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const base64 = loadEvent.target?.result as string;
      if (base64) {
        const imageHtml = `
          <div style="text-align: center; margin: 16px 0;">
            <img src="${base64}" alt="Imagen insertada" style="max-width: 100%; height: auto; border-radius: 4px; border: 1px solid #e2e8f0; display: inline-block;" />
          </div>
          <p><br></p>
        `;
        insertHtmlAtCursor(imageHtml);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleInsertLink = () => {
    const url = prompt('Introduce la URL del enlace (ejemplo: https://www.ejemplo.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleInsertSymbol = (sym: string) => {
    insertHtmlAtCursor(sym);
    setShowSymbols(false);
  };

  return (
    <div className="flex items-center flex-wrap gap-1 px-4 py-1.5 text-xs select-none">
      {/* 1. Tablas */}
      <div className="flex items-center gap-1 pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <button
          onClick={onOpenTableModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <TableIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Insertar Tabla</span>
        </button>
      </div>

      {/* 2. Ilustraciones / Imágenes */}
      <div className="flex items-center gap-1 pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Subir Imagen</span>
        </button>
      </div>

      {/* 3. Vínculos y Páginas */}
      <div className="flex items-center gap-1 pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <button
          onClick={handleInsertLink}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <Link2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Vínculo</span>
        </button>

        <button
          onClick={insertPageBreak}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <SeparatorHorizontal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Salto de Página</span>
        </button>
      </div>

      {/* 4. Elementos especiales (Cuadro de llamada, Fecha, Símbolos) */}
      <div className="flex items-center gap-1">
        {/* Cuadro de llamada */}
        <div className="relative">
          <button
            onClick={() => setShowCallouts(!showCallouts)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
          >
            <Info className="w-4 h-4 text-amber-500" />
            <span>Nota Destacada</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
          {showCallouts && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  insertCallout('note');
                  setShowCallouts(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                Nota Informativa (Azul)
              </button>
              <button
                onClick={() => {
                  insertCallout('tip');
                  setShowCallouts(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                Consejo Práctico (Verde)
              </button>
              <button
                onClick={() => {
                  insertCallout('warning');
                  setShowCallouts(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                Advertencia (Ámbar)
              </button>
            </div>
          )}
        </div>

        {/* Fecha Actual */}
        <button
          onClick={insertDateStamp}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          <span>Fecha y Hora</span>
        </button>

        {/* Símbolos */}
        <div className="relative">
          <button
            onClick={() => setShowSymbols(!showSymbols)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Símbolos</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
          {showSymbols && (
            <div className="absolute top-full right-0 mt-1 p-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg grid grid-cols-6 gap-1.5 z-50">
              {COMMON_SYMBOLS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleInsertSymbol(s)}
                  className="h-7 rounded border border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 text-center text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
