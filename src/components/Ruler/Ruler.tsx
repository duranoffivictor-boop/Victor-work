import React from 'react';
import { MarginPreset } from '../../types/document';

interface RulerProps {
  pageWidth: number;
  marginPreset: MarginPreset;
  zoom: number;
}

export const HorizontalRuler: React.FC<RulerProps> = ({ pageWidth, marginPreset, zoom }) => {
  const scaledWidth = (pageWidth * zoom) / 100;
  const scaledLeftMargin = (marginPreset.left * zoom) / 100;
  const scaledRightMargin = (marginPreset.right * zoom) / 100;

  // Number of 1cm subdivisions (~37.8px per cm at 96 DPI)
  const cmWidthPx = 37.8 * (zoom / 100);
  const totalCms = Math.floor(scaledWidth / cmWidthPx);
  const marks = Array.from({ length: totalCms + 1 }, (_, i) => i);

  return (
    <div className="flex justify-center w-full select-none no-print overflow-hidden py-1">
      <div
        className="relative h-6 bg-slate-200/80 dark:bg-slate-800 border-y border-slate-300 dark:border-slate-700 shadow-inner flex items-center"
        style={{ width: `${scaledWidth}px` }}
      >
        {/* Left Margin Shading */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-slate-300/80 dark:bg-slate-700/80 border-r border-blue-500/40"
          style={{ width: `${scaledLeftMargin}px` }}
        />

        {/* Right Margin Shading */}
        <div
          className="absolute right-0 top-0 bottom-0 bg-slate-300/80 dark:bg-slate-700/80 border-l border-blue-500/40"
          style={{ width: `${scaledRightMargin}px` }}
        />

        {/* Ruler Tick Marks & CM Numbers */}
        <div className="absolute inset-0 flex">
          {marks.map((cm) => (
            <div
              key={cm}
              className="absolute top-0 bottom-0 flex flex-col justify-between"
              style={{ left: `${cm * cmWidthPx}px` }}
            >
              <div className="h-2 w-px bg-slate-400 dark:bg-slate-500" />
              {cm > 0 && cm < totalCms && (
                <span className="text-[9px] font-mono tabular-nums text-slate-500 dark:text-slate-400 -translate-x-1/2 select-none leading-none mb-0.5">
                  {cm}
                </span>
              )}
              <div className="h-1.5 w-px bg-slate-400 dark:bg-slate-500" />
            </div>
          ))}
        </div>

        {/* Left Margin Triangular Slider Pin */}
        <div
          className="absolute top-0 w-2.5 h-3 bg-blue-600 rounded-b-xs shadow-xs -translate-x-1/2 z-10"
          style={{ left: `${scaledLeftMargin}px` }}
          title={`Margen izquierdo: ${marginPreset.left}px`}
        />

        {/* Right Margin Triangular Slider Pin */}
        <div
          className="absolute top-0 w-2.5 h-3 bg-blue-600 rounded-b-xs shadow-xs -translate-x-1/2 z-10"
          style={{ left: `${scaledWidth - scaledRightMargin}px` }}
          title={`Margen derecho: ${marginPreset.right}px`}
        />
      </div>
    </div>
  );
};
