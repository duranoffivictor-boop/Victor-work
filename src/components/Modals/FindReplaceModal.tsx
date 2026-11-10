import React, { useState } from 'react';
import { Search, Replace, X, Check } from 'lucide-react';

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteReplace: (findText: string, replaceText: string, replaceAll: boolean) => number;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  onExecuteReplace,
}) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReplaceOne = () => {
    if (!findText) return;
    const count = onExecuteReplace(findText, replaceText, false);
    if (count > 0) {
      setResultMessage('Coincidencia reemplazada.');
    } else {
      setResultMessage('No se encontraron más coincidencias.');
    }
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    const count = onExecuteReplace(findText, replaceText, true);
    setResultMessage(`Se reemplazaron ${count} coincidencia(s).`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Buscar y Reemplazar
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Buscar texto:
            </label>
            <input
              type="text"
              value={findText}
              onChange={(e) => {
                setFindText(e.target.value);
                setResultMessage(null);
              }}
              placeholder="Palabra o frase a buscar..."
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[44px]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reemplazar con:
            </label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => {
                setReplaceText(e.target.value);
                setResultMessage(null);
              }}
              placeholder="Nuevo texto de sustitución..."
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[44px]"
            />
          </div>

          {resultMessage && (
            <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 p-2 rounded border border-blue-200 dark:border-blue-900">
              {resultMessage}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 min-h-[44px] flex items-center"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReplaceOne}
              disabled={!findText}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 min-h-[44px]"
            >
              Reemplazar
            </button>
            <button
              onClick={handleReplaceAll}
              disabled={!findText}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 min-h-[44px]"
            >
              Reemplazar Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
