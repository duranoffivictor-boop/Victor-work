import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  List,
  Heading1,
  Sparkles,
  Download,
  Share2,
  Table as TableIcon,
  ChevronUp,
  Save,
  Menu,
} from 'lucide-react';
import { executeCommand, applyHeading } from '../../utils/editorCommands';

interface MobileQuickBarProps {
  onOpenExportModal: () => void;
  onOpenAiModal: () => void;
  onOpenTableModal: () => void;
  onOpenFileMenu: () => void;
  onQuickSave: () => void;
  wordCount: number;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  onOpenExportModal,
  onOpenAiModal,
  onOpenTableModal,
  onOpenFileMenu,
  onQuickSave,
  wordCount,
}) => {
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg pb-safe">
      {/* Submenu for headings if opened */}
      {showStyleMenu && (
        <div className="flex items-center justify-around p-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-2 duration-150">
          <button
            onClick={() => {
              applyHeading('p');
              setShowStyleMenu(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-800 dark:text-slate-100 min-h-[40px] flex items-center"
          >
            Párrafo
          </button>
          <button
            onClick={() => {
              applyHeading('h1');
              setShowStyleMenu(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-blue-600 dark:text-blue-400 min-h-[40px] flex items-center"
          >
            Título 1
          </button>
          <button
            onClick={() => {
              applyHeading('h2');
              setShowStyleMenu(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold text-blue-500 dark:text-blue-300 min-h-[40px] flex items-center"
          >
            Título 2
          </button>
          <button
            onClick={() => {
              applyHeading('blockquote');
              setShowStyleMenu(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs italic text-slate-700 dark:text-slate-200 min-h-[40px] flex items-center"
          >
            Cita
          </button>
        </div>
      )}

      {/* Main Touch Toolbar */}
      <div className="flex items-center justify-between px-2 py-1 overflow-x-auto no-scrollbar gap-1">
        {/* Archivo / Menu */}
        <button
          onClick={onOpenFileMenu}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] shrink-0"
          title="Menú Archivo"
        >
          <Menu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-[9px] font-medium mt-0.5">Archivo</span>
        </button>

        {/* Styles Switcher */}
        <button
          onClick={() => setShowStyleMenu(!showStyleMenu)}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg min-h-[44px] min-w-[44px] shrink-0 ${
            showStyleMenu
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Estilos de texto"
        >
          <Heading1 className="w-4 h-4" />
          <span className="text-[9px] font-medium mt-0.5">Estilos</span>
        </button>

        {/* Bold */}
        <button
          onClick={() => executeCommand('bold')}
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[40px] flex items-center justify-center shrink-0"
          title="Negrita"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          onClick={() => executeCommand('italic')}
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[40px] flex items-center justify-center shrink-0"
          title="Cursiva"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Underline */}
        <button
          onClick={() => executeCommand('underline')}
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[40px] flex items-center justify-center shrink-0"
          title="Subrayado"
        >
          <Underline className="w-4 h-4" />
        </button>

        {/* Bullets */}
        <button
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[40px] flex items-center justify-center shrink-0"
          title="Viñetas"
        >
          <List className="w-4 h-4" />
        </button>

        {/* Table */}
        <button
          onClick={onOpenTableModal}
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[40px] flex items-center justify-center shrink-0"
          title="Insertar Tabla"
        >
          <TableIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </button>

        {/* AI Assistant */}
        <button
          onClick={onOpenAiModal}
          className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 min-h-[44px] min-w-[40px] flex items-center justify-center shrink-0"
          title="Asistente IA"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Save */}
        <button
          onClick={onQuickSave}
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[40px] flex items-center justify-center shrink-0"
          title="Guardar localmente"
        >
          <Save className="w-4 h-4" />
        </button>

        {/* Export / Share CTA Button */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shrink-0 shadow-xs active:scale-95 transition-transform min-h-[40px]"
          title="Exportar y guardar en móvil"
        >
          <Download className="w-4 h-4" />
          <span>Guardar</span>
        </button>
      </div>
    </div>
  );
};
