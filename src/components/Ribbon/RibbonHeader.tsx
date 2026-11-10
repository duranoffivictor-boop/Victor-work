import React from 'react';
import {
  FileText,
  Undo2,
  Redo2,
  Save,
  Printer,
  Download,
  Share2,
} from 'lucide-react';
import { executeCommand } from '../../utils/editorCommands';

export type RibbonTabType = 'home' | 'insert' | 'layout' | 'review' | 'view';

interface RibbonHeaderProps {
  documentTitle: string;
  onUpdateTitle: (newTitle: string) => void;
  activeTab: RibbonTabType;
  onChangeTab: (tab: RibbonTabType) => void;
  onOpenFileMenu: () => void;
  onOpenExportModal: () => void;
  onQuickSave: () => void;
  onPrint: () => void;
  saveStatusText: string;
}

export const RibbonHeader: React.FC<RibbonHeaderProps> = ({
  documentTitle,
  onUpdateTitle,
  activeTab,
  onChangeTab,
  onOpenFileMenu,
  onOpenExportModal,
  onQuickSave,
  onPrint,
  saveStatusText,
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 select-none">
      {/* Upper Bar: Brand, Quick Access, Document Title, and Primary Export Action */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2 border-b border-slate-100 dark:border-slate-800/80">
        {/* Zone 1: Brand & Document Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              V
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap leading-none">
                VICTOR WORK
              </span>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 leading-tight">
                DOCUMENTATION
              </span>
            </div>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

          {/* Quick Access Tools */}
          <div className="hidden sm:flex items-center gap-0.5 shrink-0">
            <button
              onClick={onQuickSave}
              title="Guardar documento (Ctrl+S)"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('undo')}
              title="Deshacer (Ctrl+Z)"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('redo')}
              title="Rehacer (Ctrl+Y)"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onPrint}
              title="Imprimir documento (Ctrl+P)"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden md:block h-4 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

          {/* Editable Document Name */}
          <div className="flex items-center gap-1 min-w-0">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => onUpdateTitle(e.target.value)}
              placeholder="Nombre del documento..."
              className="text-xs font-semibold px-2 py-1 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200 max-w-[130px] sm:max-w-[200px] truncate transition-colors outline-hidden"
              title="Haz clic para renombrar el archivo"
            />
            <span className="text-[10px] text-slate-400 dark:text-slate-500 italic hidden lg:inline whitespace-nowrap">
              {saveStatusText}
            </span>
          </div>
        </div>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onQuickSave}
            title="Guardar"
            className="sm:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap min-h-[40px]"
          >
            <Download className="w-4 h-4" />
            <span className="hidden xs:inline">Exportar / Guardar</span>
            <span className="xs:hidden">Exportar</span>
          </button>
        </div>
      </div>

      {/* Lower Bar: Ribbon Tabs (Archivo + Inicio + Insertar + Disposición + Revisar + Vista) */}
      <div className="flex items-center px-2 sm:px-4 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto no-scrollbar scroll-smooth">
        {/* Archivo Button */}
        <button
          onClick={onOpenFileMenu}
          className="px-3.5 py-2 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-t-md transition-colors mr-1 sm:mr-2 flex items-center gap-1 shrink-0 min-h-[38px] sm:min-h-auto"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Archivo</span>
        </button>

        {/* Ribbon Tabs */}
        <nav className="flex items-center gap-1 shrink-0">
          {(
            [
              { id: 'home', label: 'Inicio' },
              { id: 'insert', label: 'Insertar' },
              { id: 'layout', label: 'Disposición' },
              { id: 'review', label: 'Revisar' },
              { id: 'view', label: 'Vista' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => onChangeTab(t.id)}
              className={`px-3 py-2 sm:py-1.5 text-xs font-medium rounded-t-md transition-colors shrink-0 min-h-[38px] sm:min-h-auto ${
                activeTab === t.id
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 dark:border-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
