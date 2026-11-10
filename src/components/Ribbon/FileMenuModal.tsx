import React, { useRef, useState } from 'react';
import {
  FileText,
  FolderOpen,
  Save,
  Download,
  Printer,
  X,
  FilePlus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { DOCUMENT_TEMPLATES, DocumentTemplate } from '../../utils/templates';
import { EXPORT_FORMATS, ExportFormatOption } from '../../utils/exportFormats';
import { DocumentState } from '../../types/document';
import { importDocxFile } from '../../utils/docxImport';

interface FileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc: DocumentState;
  onSelectTemplate: (template: DocumentTemplate) => void;
  onImportFile: (content: string, title: string) => void;
  onSaveToLibrary: () => void;
  savedDocuments: DocumentState[];
  onLoadSavedDoc: (doc: DocumentState) => void;
  onDeleteSavedDoc: (id: string) => void;
  onTriggerExport: (formatId: ExportFormatOption['id']) => void;
  onPrint: () => void;
}

type FileMenuTab = 'new' | 'open' | 'save' | 'library' | 'export';

export const FileMenuModal: React.FC<FileMenuModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onSelectTemplate,
  onImportFile,
  onSaveToLibrary,
  savedDocuments,
  onLoadSavedDoc,
  onDeleteSavedDoc,
  onTriggerExport,
  onPrint,
}) => {
  const [activeTab, setActiveTab] = useState<FileMenuTab>('new');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus('Leyendo archivo...');

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'docx') {
        const { html, title } = await importDocxFile(file);
        onImportFile(html, title);
        setImportStatus(`¡Documento Word "${file.name}" cargado exitosamente!`);
        setTimeout(() => onClose(), 800);
      } else if (ext === 'json') {
        const text = await file.text();
        const data = JSON.parse(text) as DocumentState;
        if (data && data.content) {
          onImportFile(data.content, data.title || 'Documento Importado');
          setImportStatus('¡Copia de seguridad restaurada!');
          setTimeout(() => onClose(), 800);
        }
      } else if (ext === 'html' || ext === 'htm') {
        const html = await file.text();
        const title = file.name.replace(/\.[^/.]+$/, '');
        onImportFile(html, title);
        setImportStatus(`¡Archivo HTML "${file.name}" cargado!`);
        setTimeout(() => onClose(), 800);
      } else if (ext === 'md' || ext === 'txt') {
        const text = await file.text();
        const title = file.name.replace(/\.[^/.]+$/, '');
        // Convert plain text or markdown paragraphs into HTML
        const html = text
          .split('\n\n')
          .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
          .join('');
        onImportFile(html, title);
        setImportStatus(`¡Archivo "${file.name}" cargado!`);
        setTimeout(() => onClose(), 800);
      } else {
        setImportStatus('Formato no compatible. Por favor sube .docx, .html, .md, .txt o .json.');
      }
    } catch (err: any) {
      console.error(err);
      setImportStatus(`Error al importar: ${err.message || 'Archivo dañado o inválido'}`);
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[94vh] sm:h-[600px] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar (Desktop) & Top Tabs (Mobile) */}
        <div className="w-full md:w-56 bg-blue-700 text-white flex flex-col justify-between shrink-0 p-2 sm:p-3">
          <div>
            <div className="px-3 py-3 sm:py-4 flex items-center justify-between border-b border-blue-600/60 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-800 flex items-center justify-center font-bold text-sm">
                  V
                </div>
                <div>
                  <span className="font-extrabold tracking-tight text-sm sm:text-base block leading-none">
                    VICTOR WORK
                  </span>
                  <span className="text-[9px] text-blue-200 tracking-wider">DOCUMENTATION</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-600 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex md:flex-col overflow-x-auto no-scrollbar gap-1 pb-1 md:pb-0">
              <button
                onClick={() => setActiveTab('new')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left shrink-0 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'new' ? 'bg-blue-800 text-white shadow-xs' : 'text-blue-100 hover:bg-blue-600/60'
                }`}
              >
                <FilePlus className="w-4 h-4" />
                <span>Nuevo</span>
              </button>

              <button
                onClick={() => setActiveTab('open')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left shrink-0 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'open' ? 'bg-blue-800 text-white shadow-xs' : 'text-blue-100 hover:bg-blue-600/60'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                <span>Abrir archivo</span>
              </button>

              <button
                onClick={() => setActiveTab('save')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left shrink-0 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'save' ? 'bg-blue-800 text-white shadow-xs' : 'text-blue-100 hover:bg-blue-600/60'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </button>

              <button
                onClick={() => setActiveTab('library')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left shrink-0 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'library' ? 'bg-blue-800 text-white shadow-xs' : 'text-blue-100 hover:bg-blue-600/60'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Guardados ({savedDocuments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left shrink-0 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'export' ? 'bg-blue-800 text-white shadow-xs' : 'text-blue-100 hover:bg-blue-600/60'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Exportar formatos</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onPrint();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-blue-100 hover:bg-blue-600/60 transition-colors text-left shrink-0 whitespace-nowrap min-h-[40px]"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir</span>
              </button>
            </nav>
          </div>

          <button
            onClick={onClose}
            className="hidden md:flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-800/80 hover:bg-blue-800 text-white rounded-lg text-xs transition-colors min-h-[40px]"
          >
            <X className="w-3.5 h-3.5" />
            <span>Volver al editor</span>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {activeTab === 'new' && 'Plantillas y Nuevos Documentos'}
                {activeTab === 'open' && 'Abrir e Importar Archivos'}
                {activeTab === 'save' && 'Guardar Documento'}
                {activeTab === 'library' && 'Biblioteca de Documentos Guardados'}
                {activeTab === 'export' && 'Exportar en Formatos Estándar (.docx, PDF, RTF...)'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeTab === 'new' && 'Elige una plantilla diseñada profesionalmente o empieza con un documento en blanco.'}
                {activeTab === 'open' && 'Carga archivos Word (.docx), PDF, HTML, Markdown o texto desde tu dispositivo.'}
                {activeTab === 'save' && 'Almacena tu documento en la memoria local segura de tu navegador.'}
                {activeTab === 'library' && 'Reanuda la edición de tus documentos creados anteriormente.'}
                {activeTab === 'export' && 'Descarga tu trabajo en Word (.docx), PDF, RTF, HTML, Markdown o Texto plano.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Tab: NUEVO */}
            {activeTab === 'new' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DOCUMENT_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      onSelectTemplate(tmpl);
                      onClose();
                    }}
                    className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-4 cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className={`h-24 rounded-lg bg-gradient-to-br ${tmpl.previewColor} mb-3 flex items-center justify-center p-3 text-white shadow-inner relative overflow-hidden`}>
                        <div className="absolute inset-x-4 inset-y-3 bg-white/10 backdrop-blur-xs rounded border border-white/20 p-2 text-[9px] line-clamp-4 leading-tight opacity-90">
                          {tmpl.name}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {tmpl.category}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                        {tmpl.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                      <span>Usar plantilla</span>
                      <span>→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: ABRIR / IMPORTAR */}
            {activeTab === 'open' && (
              <div className="max-w-xl mx-auto space-y-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx,.html,.htm,.md,.txt,.json"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-400 dark:border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-2xl p-8 text-center cursor-pointer transition-colors"
                >
                  <FolderOpen className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Arrastra o haz clic para abrir un archivo
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Soporta documentos de <strong>Microsoft Word (.docx)</strong>, archivos web (.html), Markdown (.md), texto plano (.txt) y proyectos (.json).
                  </p>

                  <button
                    disabled={isProcessing}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    {isProcessing ? 'Procesando...' : 'Seleccionar archivo desde el equipo'}
                  </button>
                </div>

                {importStatus && (
                  <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{importStatus}</span>
                  </div>
                )}
              </div>
            )}

            {/* Tab: GUARDAR */}
            {activeTab === 'save' && (
              <div className="max-w-md mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Save className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Guardar en la biblioteca local
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  El documento "{currentDoc.title}" se guardará en el almacenamiento seguro de tu navegador para que puedas recuperarlo en cualquier momento.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onSaveToLibrary();
                      setActiveTab('library');
                    }}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar versión actual</span>
                  </button>

                  <button
                    onClick={() => onTriggerExport('docx')}
                    className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Descargar copia en .docx a mi disco</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab: BIBLIOTECA */}
            {activeTab === 'library' && (
              <div className="space-y-3">
                {savedDocuments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      No tienes documentos guardados aún
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Usa la opción "Guardar" para almacenar copias de tus escritos.
                    </p>
                  </div>
                ) : (
                  savedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 flex items-center justify-between hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          DOC
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {doc.title}
                          </h4>
                          <p className="text-xs text-slate-400">
                            Modificado el {new Date(doc.updatedAt).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onLoadSavedDoc(doc);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                        >
                          Cargar
                        </button>
                        <button
                          onClick={() => onDeleteSavedDoc(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Eliminar de la biblioteca"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: EXPORTAR */}
            {activeTab === 'export' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {EXPORT_FORMATS.map((fmt) => (
                  <div
                    key={fmt.id}
                    onClick={() => {
                      onTriggerExport(fmt.id);
                      onClose();
                    }}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-4 cursor-pointer shadow-xs hover:shadow-md transition-all flex items-start justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${fmt.iconColor} flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                        {fmt.extension.toUpperCase().replace('.', '')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {fmt.name}
                          </h3>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                            {fmt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {fmt.description}
                        </p>
                      </div>
                    </div>

                    <button className="text-blue-600 dark:text-blue-400 text-xs font-semibold shrink-0 mt-1">
                      Descargar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
