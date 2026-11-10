/**
 * Utility commands for rich text editing on contentEditable elements
 */

export function executeCommand(command: string, value: string | undefined = undefined): boolean {
  try {
    document.execCommand('styleWithCSS', false, 'true');
    return document.execCommand(command, false, value);
  } catch (err) {
    console.error(`Failed to execute command ${command}:`, err);
    return false;
  }
}

export function applyHeading(tag: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'blockquote'): void {
  // Try formatBlock with and without angle brackets (browser compatibility)
  try {
    const success = document.execCommand('formatBlock', false, tag);
    if (!success) {
      document.execCommand('formatBlock', false, `<${tag}>`);
    }
  } catch {
    document.execCommand('formatBlock', false, `<${tag}>`);
  }
}

export function insertHtmlAtCursor(html: string): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const el = document.createElement('div');
  el.innerHTML = html;
  const frag = document.createDocumentFragment();
  let node: ChildNode | null = null;
  let lastNode: ChildNode | null = null;

  while ((node = el.firstChild)) {
    lastNode = frag.appendChild(node);
  }

  range.insertNode(frag);

  if (lastNode) {
    const newRange = range.cloneRange();
    newRange.setStartAfter(lastNode);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}

export function insertTable(rows: number, cols: number): void {
  let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 16px 0;"><tbody>';
  for (let r = 0; r < rows; r++) {
    tableHtml += '<tr>';
    for (let c = 0; c < cols; c++) {
      if (r === 0) {
        tableHtml += `<th style="border: 1px solid #cbd5e1; padding: 8px 12px; background-color: #f1f5f9; text-align: left; font-weight: 600;">Encabezado ${c + 1}</th>`;
      } else {
        tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Dato ${r},${c + 1}</td>`;
      }
    }
    tableHtml += '</tr>';
  }
  tableHtml += '</tbody></table><p><br></p>';
  insertHtmlAtCursor(tableHtml);
}

export function insertPageBreak(): void {
  const pageBreakHtml = `
    <div class="page-break-indicator" style="page-break-after: always; border-top: 2px dashed #94a3b8; margin: 32px 0 24px 0; padding-top: 8px; text-align: center; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; user-select: none;">
      --------- Salto de Página ---------
    </div>
    <p><br></p>
  `;
  insertHtmlAtCursor(pageBreakHtml);
}

export function insertCallout(type: 'note' | 'tip' | 'warning' = 'note'): void {
  const configs = {
    note: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', title: 'Nota Informativa' },
    tip: { bg: '#f0fdf4', border: '#22c55e', text: '#166534', title: 'Consejo Práctico' },
    warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', title: 'Advertencia' },
  };
  const c = configs[type];
  const html = `
    <div style="background-color: ${c.bg}; border: 1px solid ${c.border}; border-radius: 6px; padding: 12px 16px; margin: 16px 0;">
      <p style="margin: 0 0 6px 0; font-weight: 600; color: ${c.text};">${c.title}</p>
      <p style="margin: 0; color: #334155;">Escribe aquí el contenido destacado o consideración especial...</p>
    </div>
    <p><br></p>
  `;
  insertHtmlAtCursor(html);
}

export function insertDateStamp(): void {
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  insertHtmlAtCursor(`<strong>${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}</strong> `);
}
