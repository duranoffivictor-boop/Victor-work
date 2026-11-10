import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Outdent,
  Indent,
  Quote,
  Minus,
  Search,
  Eraser,
  Palette,
  Highlighter,
  ChevronDown,
} from 'lucide-react';
import { executeCommand, applyHeading } from '../../utils/editorCommands';

interface HomeTabProps {
  onOpenFindReplace: () => void;
  currentFont: string;
  onChangeFont: (font: string) => void;
  currentSize: string;
  onChangeSize: (size: string) => void;
}

const FONT_OPTIONS = [
  { label: 'Aptos / Modern Sans', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'Calibri', value: 'Calibri, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'EB Garamond (Editorial)', value: "'EB Garamond', Garamond, serif" },
  { label: 'Lora (Elegante)', value: 'Lora, serif' },
  { label: 'JetBrains Mono (Código)', value: "'JetBrains Mono', monospace" },
];

const FONT_SIZES = ['9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];

const TEXT_COLORS = [
  '#000000',
  '#334155',
  '#64748b',
  '#2563eb',
  '#0284c7',
  '#0d9488',
  '#16a34a',
  '#ca8a04',
  '#ea580c',
  '#dc2626',
  '#9333ea',
];

const HIGHLIGHT_COLORS = [
  'transparent',
  '#fef08a', // yellow
  '#bbf7d0', // green
  '#bae6fd', // blue
  '#fbcfe8', // pink
  '#fed7aa', // orange
  '#e9d5ff', // purple
];

export const HomeTab: React.FC<HomeTabProps> = ({
  onOpenFindReplace,
  currentFont,
  onChangeFont,
  currentSize,
  onChangeSize,
}) => {
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLineSpacing, setShowLineSpacing] = useState(false);

  const handleGrowFont = () => {
    const idx = FONT_SIZES.indexOf(currentSize);
    if (idx < FONT_SIZES.length - 1) {
      onChangeSize(FONT_SIZES[idx + 1]);
    }
  };

  const handleShrinkFont = () => {
    const idx = FONT_SIZES.indexOf(currentSize);
    if (idx > 0) {
      onChangeSize(FONT_SIZES[idx - 1]);
    }
  };

  const handleSetLineSpacing = (spacing: string) => {
    // Insert style to selection or active paragraph
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const parentBlock = selection.anchorNode?.parentElement?.closest('p, div, h1, h2, h3, li, blockquote');
      if (parentBlock) {
        (parentBlock as HTMLElement).style.lineHeight = spacing;
      }
    }
    setShowLineSpacing(false);
  };

  return (
    <div className="flex items-center flex-wrap gap-1 px-4 py-1.5 text-xs select-none">
      {/* 1. Fuente y Tipografía */}
      <div className="flex items-center gap-1 pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <select
          value={currentFont}
          onChange={(e) => onChangeFont(e.target.value)}
          aria-label="Familia de fuente"
          className="h-7 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 max-w-[130px] truncate focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <select
          value={currentSize}
          onChange={(e) => onChangeSize(e.target.value)}
          aria-label="Tamaño de fuente"
          className="h-7 w-13 px-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={handleGrowFont}
          title="Aumentar tamaño de fuente"
          className="h-7 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-200"
        >
          A<sup>+</sup>
        </button>
        <button
          onClick={handleShrinkFont}
          title="Reducir tamaño de fuente"
          className="h-7 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          A<sup>-</sup>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

        {/* Basic Styles */}
        <button
          onClick={() => executeCommand('bold')}
          title="Negrita (Ctrl+B)"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => executeCommand('italic')}
          title="Cursiva (Ctrl+I)"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => executeCommand('underline')}
          title="Subrayado (Ctrl+U)"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => executeCommand('strikeThrough')}
          title="Tachado"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => executeCommand('subscript')}
          title="Subíndice"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <Subscript className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => executeCommand('superscript')}
          title="Superíndice"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <Superscript className="w-3.5 h-3.5" />
        </button>

        {/* Text color dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTextColorPicker(!showTextColorPicker)}
            title="Color de fuente"
            className="flex items-center gap-0.5 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          >
            <Palette className="w-3.5 h-3.5 text-blue-600" />
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>
          {showTextColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg grid grid-cols-6 gap-1.5 z-50">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    executeCommand('foreColor', c);
                    setShowTextColorPicker(false);
                  }}
                  className="w-5 h-5 rounded-sm border border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight color dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            title="Color de resaltado de texto"
            className="flex items-center gap-0.5 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          >
            <Highlighter className="w-3.5 h-3.5 text-amber-500" />
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg flex gap-1.5 z-50">
              {HIGHLIGHT_COLORS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => {
                    executeCommand('hiliteColor', c);
                    setShowHighlightPicker(false);
                  }}
                  className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform flex items-center justify-center text-[10px]"
                  style={{ backgroundColor: c === 'transparent' ? '#ffffff' : c }}
                  title={c === 'transparent' ? 'Sin resaltado' : c}
                >
                  {c === 'transparent' && '✕'}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => executeCommand('removeFormat')}
          title="Borrar todo el formato"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
        >
          <Eraser className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Párrafo */}
      <div className="flex items-center gap-0.5 pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <button
          onClick={() => executeCommand('justifyLeft')}
          title="Alinear a la izquierda (Ctrl+L)"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => executeCommand('justifyCenter')}
          title="Centrar (Ctrl+E)"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => executeCommand('justifyRight')}
          title="Alinear a la derecha (Ctrl+R)"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => executeCommand('justifyFull')}
          title="Justificar (Ctrl+J)"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

        <button
          onClick={() => executeCommand('insertUnorderedList')}
          title="Viñetas"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => executeCommand('insertOrderedList')}
          title="Numeración"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => executeCommand('outdent')}
          title="Disminuir sangría"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <Outdent className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => executeCommand('indent')}
          title="Aumentar sangría"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <Indent className="w-3.5 h-3.5" />
        </button>

        {/* Line spacing dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLineSpacing(!showLineSpacing)}
            title="Espaciado entre líneas y párrafos"
            className="flex items-center gap-0.5 px-1.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium"
          >
            <span>↕</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>
          {showLineSpacing && (
            <div className="absolute top-full left-0 mt-1 w-28 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg py-1 z-50">
              {['1.0', '1.15', '1.5', '2.0'].map((val) => (
                <button
                  key={val}
                  onClick={() => handleSetLineSpacing(val)}
                  className="w-full text-left px-3 py-1 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  {val}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => applyHeading('blockquote')}
          title="Cita en bloque"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => executeCommand('insertHorizontalRule')}
          title="Línea horizontal divisoria"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Galería de Estilos Rápidos de Word */}
      <div className="flex items-center gap-1 pr-2.5 border-r border-slate-200 dark:border-slate-700 overflow-x-auto">
        <button
          onClick={() => applyHeading('p')}
          className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          Normal
        </button>
        <button
          onClick={() => applyHeading('h1')}
          className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-400 font-bold"
        >
          Título 1
        </button>
        <button
          onClick={() => applyHeading('h2')}
          className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-300 font-semibold"
        >
          Título 2
        </button>
        <button
          onClick={() => applyHeading('h3')}
          className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
        >
          Título 3
        </button>
      </div>

      {/* 4. Edición / Buscar */}
      <div className="flex items-center gap-1 pl-1">
        <button
          onClick={onOpenFindReplace}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span>Buscar y Reemplazar</span>
        </button>
      </div>
    </div>
  );
};
