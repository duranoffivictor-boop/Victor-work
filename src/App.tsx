import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RibbonHeader, RibbonTabType } from './components/Ribbon/RibbonHeader';
import { HomeTab } from './components/Ribbon/HomeTab';
import { InsertTab } from './components/Ribbon/InsertTab';
import { LayoutTab } from './components/Ribbon/LayoutTab';
import { ReviewTab } from './components/Ribbon/ReviewTab';
import { ViewTab } from './components/Ribbon/ViewTab';
import { FileMenuModal } from './components/Ribbon/FileMenuModal';
import { HorizontalRuler } from './components/Ruler/Ruler';
import { DocumentSheet } from './components/Document/DocumentSheet';
import { StatusBar } from './components/StatusBar';
import { ExportModal } from './components/Modals/ExportModal';
import { StatsModal } from './components/Modals/StatsModal';
import { FindReplaceModal } from './components/Modals/FindReplaceModal';
import { TableInsertModal } from './components/Modals/TableInsertModal';
import { AiAssistantModal } from './components/Modals/AiAssistantModal';
import { MobileQuickBar } from './components/Mobile/MobileQuickBar';
import {
  DocumentState,
  DocumentStats,
  MARGIN_PRESETS,
  PAGE_DIMENSIONS,
  ViewMode,
} from './types/document';
import { DOCUMENT_TEMPLATES, DocumentTemplate } from './utils/templates';
import { EXPORT_FORMATS, ExportFormatOption, exportDocument } from './utils/exportFormats';

const STORAGE_KEY_CURRENT = 'VICTOR_WORK_CURRENT_DOC_V2';
const STORAGE_KEY_LIBRARY = 'VICTOR_WORK_LIBRARY_V2';
const STORAGE_KEY_THEME = 'VICTOR_WORK_THEME_V2';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDarkMode]);

  // Initial document state
  const [docState, setDocState] = useState<DocumentState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved document:', e);
      }
    }
    // Default to Business Letter template
    const initialTmpl = DOCUMENT_TEMPLATES[1];
    return {
      id: 'doc_' + Date.now(),
      title: 'Documentación Oficial de Trabajo',
      content: initialTmpl.content,
      headerText: 'VICTOR WORK DOCUMENTATION | Departamento de Gestión',
      footerText: 'VICTOR WORK DOCUMENTATION · Confidencial',
      pageSize: initialTmpl.pageSize,
      orientation: 'portrait',
      marginType: initialTmpl.marginType,
      pageColor: '#ffffff',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
  });

  // Library of saved documents
  const [savedDocuments, setSavedDocuments] = useState<DocumentState[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LIBRARY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading library:', e);
      }
    }
    return [];
  });

  // Ribbon and View state
  const [activeTab, setActiveTab] = useState<RibbonTabType>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('print');
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(100);
  const [pageCount, setPageCount] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatusText, setSaveStatusText] = useState<string>('Guardado');

  // Modals state
  const [isFileMenuOpen, setIsFileMenuOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState<boolean>(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiInitialAction, setAiInitialAction] = useState<string>('improve');

  // Selection tracking for AI
  const [selectedText, setSelectedText] = useState<string>('');

  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-save to localStorage
  useEffect(() => {
    setIsSaving(true);
    setSaveStatusText('Guardando...');
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(docState));
      setIsSaving(false);
      setSaveStatusText('Guardado automáticamente');
    }, 600);
    return () => clearTimeout(timer);
  }, [docState]);

  // Compute stats
  const stats: DocumentStats = useMemo(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = docState.content;
    const plainText = tempDiv.textContent || '';

    const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
    const characters = plainText.length;
    const charactersNoSpaces = plainText.replace(/\s+/g, '').length;
    const paragraphs = tempDiv.querySelectorAll('p, h1, h2, h3, h4, li, blockquote').length || 1;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

    return {
      words,
      characters,
      charactersNoSpaces,
      paragraphs,
      readingTimeMinutes,
    };
  }, [docState.content]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveToLibrary();
      } else if (modKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
      } else if (modKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFindReplaceOpen(true);
      } else if (modKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsExportModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [docState]);

  // Document Content Updates
  const handleContentChange = useCallback((newHtml: string) => {
    setDocState((prev) => ({
      ...prev,
      content: newHtml,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setDocState((prev) => ({
      ...prev,
      title: newTitle,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Template Selection
  const handleSelectTemplate = (template: DocumentTemplate) => {
    const newDoc: DocumentState = {
      id: 'doc_' + Date.now(),
      title: template.defaultTitle,
      content: template.content,
      headerText: template.id === 'blank' ? '' : `${template.name} | VICTOR WORK DOCUMENTATION`,
      footerText: 'VICTOR WORK DOCUMENTATION',
      pageSize: template.pageSize,
      orientation: 'portrait',
      marginType: template.marginType,
      pageColor: '#ffffff',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setDocState(newDoc);
    if (editorRef.current) {
      editorRef.current.innerHTML = newDoc.content;
    }
  };

  // Import Document file
  const handleImportFile = (content: string, title: string) => {
    setDocState((prev) => ({
      ...prev,
      id: 'doc_' + Date.now(),
      title: title || prev.title,
      content,
      updatedAt: new Date().toISOString(),
    }));
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  };

  // Save to Library
  const handleSaveToLibrary = () => {
    setSavedDocuments((prev) => {
      const existingIdx = prev.findIndex((d) => d.id === docState.id);
      let updated: DocumentState[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = { ...docState, updatedAt: new Date().toISOString() };
      } else {
        updated = [{ ...docState, updatedAt: new Date().toISOString() }, ...prev];
      }
      localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(updated));
      return updated;
    });
    setSaveStatusText('Guardado en Mis Documentos');
    setTimeout(() => setSaveStatusText('Guardado automáticamente'), 3000);
  };

  const handleLoadSavedDoc = (doc: DocumentState) => {
    setDocState(doc);
    if (editorRef.current) {
      editorRef.current.innerHTML = doc.content;
    }
  };

  const handleDeleteSavedDoc = (id: string) => {
    setSavedDocuments((prev) => {
      const filtered = prev.filter((d) => d.id !== id);
      localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(filtered));
      return filtered;
    });
  };

  // Export Dispatcher
  const handleTriggerExport = async (formatId: ExportFormatOption['id']) => {
    const docSheetEl = editorRef.current?.closest('.document-sheet') as HTMLElement;
    await exportDocument(formatId, docState, docSheetEl);
  };

  // Find & Replace Handler
  const handleExecuteReplace = (findText: string, replaceText: string, replaceAll: boolean): number => {
    if (!editorRef.current || !findText) return 0;
    const currentHtml = editorRef.current.innerHTML;

    // Safely replace text within content
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), replaceAll ? 'gi' : 'i');
    const matches = currentHtml.match(regex);
    const count = matches ? matches.length : 0;

    if (count > 0) {
      const newHtml = currentHtml.replace(regex, replaceText);
      editorRef.current.innerHTML = newHtml;
      handleContentChange(newHtml);
    }
    return count;
  };

  // AI Assistant Apply
  const handleApplyAiResult = (resultText: string, mode: 'replace' | 'append') => {
    if (!editorRef.current) return;

    if (mode === 'replace' && selectedText) {
      // Replace active selection
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(resultText);
        range.insertNode(textNode);
      } else {
        editorRef.current.innerHTML = resultText.replace(/\n/g, '<br>');
      }
    } else {
      // Append at bottom
      const appendHtml = `<p><br></p><div style="background-color: #f8fafc; border-left: 3px solid #6366f1; padding: 8px 12px; margin: 12px 0;">${resultText.replace(/\n/g, '<br>')}</div><p><br></p>`;
      editorRef.current.innerHTML += appendHtml;
    }
    handleContentChange(editorRef.current.innerHTML);
  };

  const currentDimension = PAGE_DIMENSIONS[docState.pageSize][docState.orientation];
  const marginPreset = MARGIN_PRESETS.find((m) => m.id === docState.marginType) || MARGIN_PRESETS[0];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* 1. Word Header & Ribbon Tabs (Home, Insert, Layout, Review, View) */}
      <div className="no-print">
        <RibbonHeader
          documentTitle={docState.title}
          onUpdateTitle={handleTitleChange}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenFileMenu={() => setIsFileMenuOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onQuickSave={handleSaveToLibrary}
          onPrint={() => window.print()}
          saveStatusText={saveStatusText}
        />

        {/* Active Ribbon Panel Toolbar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
          {activeTab === 'home' && (
            <HomeTab
              onOpenFindReplace={() => setIsFindReplaceOpen(true)}
              currentFont={docState.fontFamily}
              onChangeFont={(font) => setDocState((prev) => ({ ...prev, fontFamily: font }))}
              currentSize={docState.fontSize}
              onChangeSize={(size) => setDocState((prev) => ({ ...prev, fontSize: size }))}
            />
          )}

          {activeTab === 'insert' && (
            <InsertTab onOpenTableModal={() => setIsTableModalOpen(true)} />
          )}

          {activeTab === 'layout' && (
            <LayoutTab
              marginType={docState.marginType}
              onChangeMargin={(m) => setDocState((prev) => ({ ...prev, marginType: m }))}
              orientation={docState.orientation}
              onChangeOrientation={(o) => setDocState((prev) => ({ ...prev, orientation: o }))}
              pageSize={docState.pageSize}
              onChangePageSize={(s) => setDocState((prev) => ({ ...prev, pageSize: s }))}
              pageColor={docState.pageColor}
              onChangePageColor={(c) => setDocState((prev) => ({ ...prev, pageColor: c }))}
              headerText={docState.headerText}
              onChangeHeaderText={(t) => setDocState((prev) => ({ ...prev, headerText: t }))}
              footerText={docState.footerText}
              onChangeFooterText={(t) => setDocState((prev) => ({ ...prev, footerText: t }))}
            />
          )}

          {activeTab === 'review' && (
            <ReviewTab
              onOpenStats={() => setIsStatsModalOpen(true)}
              onOpenAiAssistant={(act) => {
                setAiInitialAction(act || 'improve');
                setIsAiModalOpen(true);
              }}
              onOpenFindReplace={() => setIsFindReplaceOpen(true)}
            />
          )}

          {activeTab === 'view' && (
            <ViewTab
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              showRuler={showRuler}
              onToggleRuler={() => setShowRuler(!showRuler)}
              zoom={zoom}
              onChangeZoom={setZoom}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />
          )}
        </div>

        {/* 2. Horizontal Ruler (Word Style) */}
        {showRuler && viewMode === 'print' && (
          <HorizontalRuler
            pageWidth={currentDimension.width}
            marginPreset={marginPreset}
            zoom={zoom}
          />
        )}
      </div>

      {/* 3. Main Document Canvas Sheet */}
      <DocumentSheet
        docState={docState}
        onChangeContent={handleContentChange}
        viewMode={viewMode}
        zoom={zoom}
        onSelectText={setSelectedText}
        onPageCountChange={setPageCount}
        editorRef={editorRef}
        containerRef={containerRef}
      />

      {/* 4. Word Status Bar (Desktop & Tablet) */}
      <div className="hidden md:block">
        <StatusBar
          stats={stats}
          pageCount={pageCount}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          zoom={zoom}
          onChangeZoom={setZoom}
          isSaving={isSaving}
          onOpenStats={() => setIsStatsModalOpen(true)}
        />
      </div>

      {/* 5. Mobile Quick Action & Formatting Bar (Smartphones) */}
      <MobileQuickBar
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenAiModal={() => {
          setAiInitialAction('improve');
          setIsAiModalOpen(true);
        }}
        onOpenTableModal={() => setIsTableModalOpen(true)}
        onOpenFileMenu={() => setIsFileMenuOpen(true)}
        onQuickSave={handleSaveToLibrary}
        wordCount={stats.words}
      />

      {/* Modals */}
      <FileMenuModal
        isOpen={isFileMenuOpen}
        onClose={() => setIsFileMenuOpen(false)}
        currentDoc={docState}
        onSelectTemplate={handleSelectTemplate}
        onImportFile={handleImportFile}
        onSaveToLibrary={handleSaveToLibrary}
        savedDocuments={savedDocuments}
        onLoadSavedDoc={handleLoadSavedDoc}
        onDeleteSavedDoc={handleDeleteSavedDoc}
        onTriggerExport={handleTriggerExport}
        onPrint={() => window.print()}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        docState={docState}
        docElement={editorRef.current?.closest('.document-sheet') as HTMLElement}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
        pageCount={pageCount}
      />

      <FindReplaceModal
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        onExecuteReplace={handleExecuteReplace}
      />

      <TableInsertModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        selectedText={selectedText}
        fullDocumentText={editorRef.current?.innerText || ''}
        onApplyResult={handleApplyAiResult}
        initialAction={aiInitialAction}
      />
    </div>
  );
}
