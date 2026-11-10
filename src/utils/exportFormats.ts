import { downloadOrShareBlob } from './fileSaverHelper';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DocumentState } from '../types/document';
import { exportToDocx } from './docxExport';

export interface ExportFormatOption {
  id: 'docx' | 'pdf' | 'rtf' | 'html' | 'md' | 'txt' | 'json';
  name: string;
  extension: string;
  description: string;
  badge: string;
  iconColor: string;
}

export const EXPORT_FORMATS: ExportFormatOption[] = [
  {
    id: 'docx',
    name: 'Microsoft Word (.docx)',
    extension: '.docx',
    description: 'Documento estándar de Microsoft Word con estilos, tablas, listas y márgenes completos.',
    badge: 'Recomendado',
    iconColor: 'bg-blue-600 text-white',
  },
  {
    id: 'pdf',
    name: 'Documento PDF (.pdf)',
    extension: '.pdf',
    description: 'Formato estándar universal para imprimir, compartir y archivar en cualquier móvil o PC.',
    badge: 'Popular',
    iconColor: 'bg-red-600 text-white',
  },
  {
    id: 'rtf',
    name: 'Texto Enriquecido (.rtf)',
    extension: '.rtf',
    description: 'Compatible universalmente con WordPad, Apple Pages, LibreOffice y todas las versiones de Word.',
    badge: 'Universal',
    iconColor: 'bg-amber-600 text-white',
  },
  {
    id: 'html',
    name: 'Página Web (.html)',
    extension: '.html',
    description: 'Archivo HTML independiente con estilos tipográficos listos para publicar en la web.',
    badge: 'Web',
    iconColor: 'bg-orange-500 text-white',
  },
  {
    id: 'md',
    name: 'Markdown (.md)',
    extension: '.md',
    description: 'Formato ligero ideal para desarrolladores, documentación, GitHub, Notion y Obsidian.',
    badge: 'Código',
    iconColor: 'bg-slate-700 text-white',
  },
  {
    id: 'txt',
    name: 'Texto Plano (.txt)',
    extension: '.txt',
    description: 'Texto limpio sin formato visual, compatible con cualquier dispositivo o editor móvil.',
    badge: 'Plano',
    iconColor: 'bg-emerald-600 text-white',
  },
  {
    id: 'json',
    name: 'Copia de Seguridad (.json)',
    extension: '.json',
    description: 'Respaldo completo de la configuración del documento (márgenes, fuentes, orientación y contenido).',
    badge: 'Respaldo',
    iconColor: 'bg-indigo-600 text-white',
  },
];

/**
 * Exports HTML content to an RTF string with unicode escape support
 */
function htmlToRtf(html: string, title: string): string {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${html}</div>`, 'text/html');

  let rtf = '{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1034\n';
  rtf += '{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}{\\f1\\fnil\\fcharset0 Arial;}}\n';
  rtf += '{\\colortbl ;\\red0\\green0\\blue0;\\red37\\green99\\blue235;\\red100\\green116\\blue139;}\n';
  rtf += `{\\*\\generator VICTOR WORK DOCUMENTATION;}\n`;
  rtf += `\\viewkind4\\uc1\\pard\\sa200\\sl276\\slmult1\\f0\\fs24\n`;

  function escapeRtf(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .replace(/[^\x00-\x7F]/g, (char) => {
        const code = char.charCodeAt(0);
        return `\\u${code}?`;
      });
  }

  function traverseNodes(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeRtf(node.textContent || '');
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      let inner = '';
      el.childNodes.forEach((child) => {
        inner += traverseNodes(child);
      });

      switch (tag) {
        case 'h1':
          return `\\pard\\b\\fs36\\cf2 ${inner}\\b0\\fs24\\cf1\\par\\sa160\n`;
        case 'h2':
          return `\\pard\\b\\fs30\\cf2 ${inner}\\b0\\fs24\\cf1\\par\\sa140\n`;
        case 'h3':
          return `\\pard\\b\\fs26\\cf1 ${inner}\\b0\\fs24\\par\\sa120\n`;
        case 'b':
        case 'strong':
          return `\\b ${inner}\\b0 `;
        case 'i':
        case 'em':
          return `\\i ${inner}\\i0 `;
        case 'u':
          return `\\ul ${inner}\\ulnone `;
        case 's':
        case 'strike':
        case 'del':
          return `\\strike ${inner}\\strike0 `;
        case 'li':
          return `\\bullet  ${inner}\\par\n`;
        case 'blockquote':
          return `\\pard\\li720\\i\\cf3 ${inner}\\i0\\cf1\\par\\sa120\n`;
        case 'p':
        case 'div':
          return `\\pard\\sa160 ${inner}\\par\n`;
        case 'br':
          return `\\line `;
        case 'hr':
          return `\\pard\\brdrb\\brdrs\\brdrw10\\brsp20 \\par\\pard\\sa160\n`;
        default:
          return inner;
      }
    }
    return '';
  }

  rtf += traverseNodes(parsed.body.firstElementChild || parsed.body);
  rtf += '\n}';
  return rtf;
}

/**
 * Converts HTML to clean Markdown text
 */
function htmlToMarkdown(html: string): string {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${html}</div>`, 'text/html');

  function traverse(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      let inner = '';
      el.childNodes.forEach((c) => {
        inner += traverse(c);
      });

      switch (tag) {
        case 'h1':
          return `\n# ${inner.trim()}\n\n`;
        case 'h2':
          return `\n## ${inner.trim()}\n\n`;
        case 'h3':
          return `\n### ${inner.trim()}\n\n`;
        case 'h4':
          return `\n#### ${inner.trim()}\n\n`;
        case 'b':
        case 'strong':
          return `**${inner}**`;
        case 'i':
        case 'em':
          return `*${inner}*`;
        case 'u':
          return `<u>${inner}</u>`;
        case 's':
        case 'strike':
        case 'del':
          return `~~${inner}~~`;
        case 'ul':
          return `\n${inner}\n`;
        case 'ol':
          return `\n${inner}\n`;
        case 'li':
          return `- ${inner.trim()}\n`;
        case 'blockquote':
          return `\n> ${inner.trim().replace(/\n/g, '\n> ')}\n\n`;
        case 'p':
        case 'div':
          return `${inner}\n\n`;
        case 'br':
          return `\n`;
        case 'hr':
          return `\n---\n\n`;
        case 'a':
          return `[${inner}](${el.getAttribute('href') || '#'})`;
        case 'table': {
          let tableMd = '\n';
          const rows = el.querySelectorAll('tr');
          rows.forEach((tr, rowIndex) => {
            const cells = tr.querySelectorAll('th, td');
            const rowText = Array.from(cells)
              .map((c) => c.textContent?.trim() || '')
              .join(' | ');
            tableMd += `| ${rowText} |\n`;
            if (rowIndex === 0) {
              const divider = Array.from(cells)
                .map(() => '---')
                .join(' | ');
              tableMd += `| ${divider} |\n`;
            }
          });
          return `${tableMd}\n`;
        }
        default:
          return inner;
      }
    }
    return '';
  }

  const raw = traverse(parsed.body.firstElementChild || parsed.body);
  return raw.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Converts HTML to clean plain text
 */
function htmlToPlainText(html: string): string {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${html}</div>`, 'text/html');

  // Replace block elements with linebreaks
  const blockTags = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'tr', 'hr'];
  blockTags.forEach((tag) => {
    parsed.querySelectorAll(tag).forEach((el) => {
      el.insertAdjacentText('afterend', '\n');
    });
  });

  return (parsed.body.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Exports document to PDF using html2canvas and jsPDF for mobile-compatible download/share
 */
export async function exportToPdf(
  docElement: HTMLElement,
  docState: DocumentState,
  preferShare: boolean = false
): Promise<void> {
  const isLandscape = docState.orientation === 'landscape';
  const format = docState.pageSize === 'legal' ? 'legal' : docState.pageSize === 'letter' ? 'letter' : 'a4';

  const canvas = await html2canvas(docElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'pt',
    format,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Calculate ratio
  const ratio = pdfWidth / imgWidth;
  const renderedHeight = imgHeight * ratio;

  if (renderedHeight <= pdfHeight) {
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, renderedHeight);
  } else {
    // Multi-page slicing
    let heightLeft = renderedHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, renderedHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, renderedHeight);
      heightLeft -= pdfHeight;
    }
  }

  const safeFilename = (docState.title || 'Documento').replace(/[/\\?%*:|"<>]/g, '_');
  const pdfBlob = pdf.output('blob');
  await downloadOrShareBlob(pdfBlob, `${safeFilename}.pdf`, docState.title, preferShare);
}

/**
 * Main export dispatcher for all formats with mobile saving support
 */
export async function exportDocument(
  formatId: ExportFormatOption['id'],
  docState: DocumentState,
  docElement?: HTMLElement | null,
  preferShare: boolean = false
): Promise<void> {
  const safeFilename = (docState.title || 'Documento').replace(/[/\\?%*:|"<>]/g, '_');

  switch (formatId) {
    case 'docx':
      await exportToDocx(docState, preferShare);
      break;

    case 'pdf':
      if (docElement) {
        await exportToPdf(docElement, docState, preferShare);
      } else {
        window.print();
      }
      break;

    case 'rtf': {
      const rtfContent = htmlToRtf(docState.content, docState.title);
      const blob = new Blob([rtfContent], { type: 'application/rtf;charset=utf-8' });
      await downloadOrShareBlob(blob, `${safeFilename}.rtf`, docState.title, preferShare);
      break;
    }

    case 'html': {
      const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docState.title || 'Documento'} - VICTOR WORK DOCUMENTATION</title>
  <style>
    body {
      font-family: ${docState.fontFamily || "'Plus Jakarta Sans', Arial, sans-serif"};
      max-width: 800px;
      margin: 40px auto;
      padding: 0 24px;
      color: #1e293b;
      line-height: 1.6;
    }
    h1 { font-size: 2rem; color: #0f172a; margin-top: 1.5em; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3em; }
    h2 { font-size: 1.5rem; color: #1e293b; margin-top: 1.3em; }
    h3 { font-size: 1.25rem; color: #334155; margin-top: 1.1em; }
    table { border-collapse: collapse; width: 100%; margin: 1.5em 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; font-weight: 600; }
    blockquote { border-left: 4px solid #3b82f6; margin: 1.2em 0; padding-left: 1rem; color: #475569; font-style: italic; }
    hr { border: none; border-top: 1px solid #cbd5e1; margin: 2em 0; }
    ul, ol { padding-left: 1.5rem; }
  </style>
</head>
<body>
  ${docState.headerText ? `<div style="text-align: right; font-size: 0.85rem; color: #64748b; margin-bottom: 2rem;">${docState.headerText}</div>` : ''}
  ${docState.content}
  ${docState.footerText ? `<div style="text-align: right; font-size: 0.85rem; color: #64748b; margin-top: 3rem; border-top: 1px solid #e2e8f0; padding-top: 1rem;">${docState.footerText}</div>` : ''}
</body>
</html>`;
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      await downloadOrShareBlob(blob, `${safeFilename}.html`, docState.title, preferShare);
      break;
    }

    case 'md': {
      const mdContent = htmlToMarkdown(docState.content);
      const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
      await downloadOrShareBlob(blob, `${safeFilename}.md`, docState.title, preferShare);
      break;
    }

    case 'txt': {
      const txtContent = htmlToPlainText(docState.content);
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
      await downloadOrShareBlob(blob, `${safeFilename}.txt`, docState.title, preferShare);
      break;
    }

    case 'json': {
      const jsonContent = JSON.stringify(docState, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
      await downloadOrShareBlob(blob, `${safeFilename}.json`, docState.title, preferShare);
      break;
    }
  }
}
