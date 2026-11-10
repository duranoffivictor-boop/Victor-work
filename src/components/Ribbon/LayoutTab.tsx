import React, { useState } from 'react';
import {
  FileText,
  RotateCw,
  Scaling,
  PaintBucket,
  ChevronDown,
  Columns2,
} from 'lucide-react';
import {
  MarginType,
  MARGIN_PRESETS,
  PageOrientation,
  PageSize,
  PAGE_DIMENSIONS,
} from '../../types/document';

interface LayoutTabProps {
  marginType: MarginType;
  onChangeMargin: (m: MarginType) => void;
  orientation: PageOrientation;
  onChangeOrientation: (o: PageOrientation) => void;
  pageSize: PageSize;
  onChangePageSize: (s: PageSize) => void;
  pageColor: string;
  onChangePageColor: (c: string) => void;
  headerText: string;
  onChangeHeaderText: (t: string) => void;
  footerText: string;
  onChangeFooterText: (t: string) => void;
}

const PAGE_COLORS = [
  { label: 'Blanco Puro', value: '#ffffff' },
  { label: 'Crema Editorial', value: '#fcfaf2' },
  { label: 'Gris Papel', value: '#f8fafc' },
  { label: 'Sepia Suave', value: '#fef7ee' },
  { label: 'Carbón Oscuro', value: '#1e293b' },
];

export const LayoutTab: React.FC<LayoutTabProps> = ({
  marginType,
  onChangeMargin,
  orientation,
  onChangeOrientation,
  pageSize,
  onChangePageSize,
  pageColor,
  onChangePageColor,
  headerText,
  onChangeHeaderText,
  footerText,
  onChangeFooterText,
}) => {
  const [showMargins, setShowMargins] = useState(false);
  const [showOrientation, setShowOrientation] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [showColors, setShowColors] = useState(false);

  return (
    <div className="flex items-center flex-wrap gap-1 px-4 py-1.5 text-xs select-none">
      {/* 1. Márgenes */}
      <div className="relative pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setShowMargins(!showMargins)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <Columns2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Márgenes: {MARGIN_PRESETS.find((m) => m.id === marginType)?.label}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {showMargins && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg py-1 z-50">
            {MARGIN_PRESETS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onChangeMargin(m.id);
                  setShowMargins(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 flex flex-col ${
                  marginType === m.id ? 'bg-blue-50 dark:bg-slate-700/60 font-semibold' : ''
                }`}
              >
                <span className="text-slate-800 dark:text-slate-200 font-medium">{m.label}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{m.cmDescription}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Orientación */}
      <div className="relative pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setShowOrientation(!showOrientation)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <RotateCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{orientation === 'portrait' ? 'Vertical' : 'Horizontal'}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {showOrientation && (
          <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg py-1 z-50">
            <button
              onClick={() => {
                onChangeOrientation('portrait');
                setShowOrientation(false);
              }}
              className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 ${
                orientation === 'portrait' ? 'bg-blue-50 dark:bg-slate-700 font-semibold text-blue-600' : ''
              }`}
            >
              Vertical (Retrato)
            </button>
            <button
              onClick={() => {
                onChangeOrientation('landscape');
                setShowOrientation(false);
              }}
              className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 ${
                orientation === 'landscape' ? 'bg-blue-50 dark:bg-slate-700 font-semibold text-blue-600' : ''
              }`}
            >
              Horizontal (Apaisado)
            </button>
          </div>
        )}
      </div>

      {/* 3. Tamaño de Papel */}
      <div className="relative pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setShowSizes(!showSizes)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <Scaling className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Tamaño: {pageSize.toUpperCase()}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {showSizes && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg py-1 z-50">
            {(['letter', 'a4', 'legal'] as PageSize[]).map((sz) => (
              <button
                key={sz}
                onClick={() => {
                  onChangePageSize(sz);
                  setShowSizes(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 flex flex-col ${
                  pageSize === sz ? 'bg-blue-50 dark:bg-slate-700/60 font-semibold' : ''
                }`}
              >
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {PAGE_DIMENSIONS[sz].portrait.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Color de Página */}
      <div className="relative pr-2.5 border-r border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setShowColors(!showColors)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
        >
          <PaintBucket className="w-4 h-4 text-amber-500" />
          <span>Fondo de Hoja</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {showColors && (
          <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg py-1 z-50">
            {PAGE_COLORS.map((pc) => (
              <button
                key={pc.value}
                onClick={() => {
                  onChangePageColor(pc.value);
                  setShowColors(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <span
                  className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 inline-block"
                  style={{ backgroundColor: pc.value }}
                />
                <span className="text-slate-700 dark:text-slate-200">{pc.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. Encabezado y Pie de página */}
      <div className="flex items-center gap-2 pl-1">
        <div className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-500">Encabezado:</span>
          <input
            type="text"
            value={headerText}
            onChange={(e) => onChangeHeaderText(e.target.value)}
            placeholder="Membrete o título superior..."
            className="h-6 w-36 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-500">Pie:</span>
          <input
            type="text"
            value={footerText}
            onChange={(e) => onChangeFooterText(e.target.value)}
            placeholder="Confidencial, empresa..."
            className="h-6 w-36 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
