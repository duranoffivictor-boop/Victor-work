import React, { useRef, useEffect } from 'react';
import {
  DocumentState,
  MARGIN_PRESETS,
  PAGE_DIMENSIONS,
  ViewMode,
} from '../../types/document';

interface DocumentSheetProps {
  docState: DocumentState;
  onChangeContent: (newHtml: string) => void;
  viewMode: ViewMode;
  zoom: number;
  onSelectText: (selected: string) => void;
  onPageCountChange: (count: number) => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const DocumentSheet: React.FC<DocumentSheetProps> = ({
  docState,
  onChangeContent,
  viewMode,
  zoom,
  onSelectText,
  onPageCountChange,
  editorRef,
  containerRef,
}) => {
  const currentDimension = PAGE_DIMENSIONS[docState.pageSize][docState.orientation];
  const marginPreset = MARGIN_PRESETS.find((m) => m.id === docState.marginType) || MARGIN_PRESETS[0];

  // Update selection tracking for AI Assistant or formatting
  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      onSelectText(selection.toString());
    }
  };

  // Sync initial content once or when document ID changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== docState.content) {
      editorRef.current.innerHTML = docState.content;
    }
  }, [docState.id]);

  // Estimate page count based on content height
  useEffect(() => {
    if (editorRef.current) {
      const contentHeight = editorRef.current.scrollHeight;
      const usablePageHeight = currentDimension.height - marginPreset.top - marginPreset.bottom;
      const pages = Math.max(1, Math.ceil(contentHeight / Math.max(300, usablePageHeight)));
      onPageCountChange(pages);
    }
  }, [docState.content, docState.pageSize, docState.orientation, docState.marginType]);

  const handleInput = () => {
    if (editorRef.current) {
      onChangeContent(editorRef.current.innerHTML);
    }
  };

  // Handle styles depending on view mode
  if (viewMode === 'reading') {
    return (
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-amber-50/30 dark:bg-slate-950">
        <div className="max-w-3xl w-full bg-white dark:bg-slate-900 shadow-lg rounded-xl p-12 border border-slate-200 dark:border-slate-800">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onMouseUp={handleSelectionChange}
            onKeyUp={handleSelectionChange}
            className="word-page-content focus:outline-none min-h-[500px] text-slate-800 dark:text-slate-100"
            style={{
              fontFamily: docState.fontFamily || "'Plus Jakarta Sans', sans-serif",
              fontSize: `${docState.fontSize || '11'}pt`,
              lineHeight: 1.6,
            }}
          />
        </div>
      </div>
    );
  }

  if (viewMode === 'web') {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 shadow-xs rounded-xl p-8 border border-slate-200 dark:border-slate-800">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onMouseUp={handleSelectionChange}
            onKeyUp={handleSelectionChange}
            className="word-page-content focus:outline-none min-h-[600px] text-slate-800 dark:text-slate-100"
            style={{
              fontFamily: docState.fontFamily || "'Plus Jakarta Sans', sans-serif",
              fontSize: `${docState.fontSize || '11'}pt`,
              lineHeight: 1.5,
            }}
          />
        </div>
      </div>
    );
  }

  // Print Layout Mode (Default - Authentic Microsoft Word Page Sheet with Mobile Adaptation)
  const scale = zoom / 100;
  const scaledWidth = currentDimension.width * scale;
  const scaledMinHeight = currentDimension.height * scale;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overflow-x-auto p-2 sm:p-6 md:p-10 pb-28 md:pb-12 flex flex-col items-center bg-slate-200/70 dark:bg-slate-950 print-page-container"
    >
      <div
        className="document-sheet relative w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xl rounded-sm sm:rounded-none transition-all duration-150 origin-top"
        style={{
          maxWidth: '100%',
          width: undefined, // handled by media classes and inline style below on desktop
          minHeight: `${currentDimension.height}px`,
          backgroundColor: docState.pageColor || '#ffffff',
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          marginBottom: scale !== 1 ? `${(scaledMinHeight - currentDimension.height) / 2 + 40}px` : '40px',
        }}
      >
        <style>{`
          @media (min-width: 640px) {
            .document-sheet {
              width: ${currentDimension.width}px !important;
            }
          }
        `}</style>

        {/* Document Header Area */}
        {docState.headerText && (
          <div
            className="absolute top-2 sm:top-4 inset-x-0 px-4 sm:px-8 text-right text-[10px] sm:text-[11px] text-slate-400 select-none border-b border-dashed border-slate-200 dark:border-slate-700 pb-1"
            style={{ paddingLeft: `${Math.min(24, marginPreset.left)}px`, paddingRight: `${Math.min(24, marginPreset.right)}px` }}
          >
            {docState.headerText}
          </div>
        )}

        {/* Editable Page Body Area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onMouseUp={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          className="word-page-content focus:outline-none text-slate-900 dark:text-slate-100 selection:bg-blue-200 selection:text-blue-900 px-4 sm:px-0"
          style={{
            minHeight: `${currentDimension.height - marginPreset.top - marginPreset.bottom}px`,
            paddingTop: `${marginPreset.top}px`,
            paddingRight: `${marginPreset.right}px`,
            paddingBottom: `${marginPreset.bottom}px`,
            paddingLeft: `${marginPreset.left}px`,
            fontFamily: docState.fontFamily || "'Plus Jakarta Sans', sans-serif",
            fontSize: `${docState.fontSize || '11'}pt`,
            lineHeight: 1.4,
          }}
        />

        {/* Document Footer Area */}
        <div
          className="absolute bottom-2 sm:bottom-4 inset-x-0 px-4 sm:px-8 flex justify-between items-center text-[10px] sm:text-[11px] text-slate-400 select-none border-t border-dashed border-slate-200 dark:border-slate-700 pt-1"
          style={{ paddingLeft: `${Math.min(24, marginPreset.left)}px`, paddingRight: `${Math.min(24, marginPreset.right)}px` }}
        >
          <span className="truncate max-w-[200px]">{docState.footerText}</span>
          <span className="font-mono tabular-nums shrink-0">Página 1</span>
        </div>
      </div>
    </div>
  );
};
