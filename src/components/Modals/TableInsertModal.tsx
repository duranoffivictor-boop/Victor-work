import React, { useState } from 'react';
import { Table as TableIcon, X, Check } from 'lucide-react';
import { insertTable } from '../../utils/editorCommands';

interface TableInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableInsertModal: React.FC<TableInsertModalProps> = ({ isOpen, onClose }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number }>({ r: 3, c: 3 });

  if (!isOpen) return null;

  const maxGridRows = 8;
  const maxGridCols = 8;

  const handleInsert = (r: number, c: number) => {
    insertTable(r, c);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Insertar Tabla
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Grid Selector */}
        <div className="py-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">
            Selecciona tamaño:{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {hoveredCell.c} columnas × {hoveredCell.r} filas
            </span>
          </p>

          <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 w-fit mx-auto">
            {Array.from({ length: maxGridRows }).map((_, rIdx) =>
              Array.from({ length: maxGridCols }).map((_, cIdx) => {
                const r = rIdx + 1;
                const c = cIdx + 1;
                const isActive = r <= hoveredCell.r && c <= hoveredCell.c;
                return (
                  <button
                    key={`${r}-${c}`}
                    onMouseEnter={() => {
                      setHoveredCell({ r, c });
                      setRows(r);
                      setCols(c);
                    }}
                    onClick={() => handleInsert(r, c)}
                    className={`w-5 h-5 rounded-xs border transition-colors ${
                      isActive
                        ? 'bg-blue-500 border-blue-600 dark:bg-blue-600 dark:border-blue-500'
                        : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-blue-400'
                    }`}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Manual inputs */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Filas:</span>
            <input
              type="number"
              min="1"
              max="30"
              value={rows}
              onChange={(e) => {
                const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                setRows(val);
                setHoveredCell((prev) => ({ ...prev, r: Math.min(8, val) }));
              }}
              className="w-12 px-1.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-center"
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">Cols:</span>
            <input
              type="number"
              min="1"
              max="20"
              value={cols}
              onChange={(e) => {
                const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                setCols(val);
                setHoveredCell((prev) => ({ ...prev, c: Math.min(8, val) }));
              }}
              className="w-12 px-1.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-center"
            />
          </div>

          <button
            onClick={() => handleInsert(rows, cols)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold min-h-[44px]"
          >
            Insertar
          </button>
        </div>
      </div>
    </div>
  );
};
