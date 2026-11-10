import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  PageOrientation as DocxPageOrientation,
  Header,
  Footer,
  PageNumber,
} from 'docx';
import { saveAs } from 'file-saver';
import { DocumentState, MARGIN_PRESETS } from '../types/document';

/**
 * Converts inline DOM nodes into an array of docx TextRun objects,
 * preserving bold, italics, underline, strike, colors, and font styles.
 */
function parseInlineNodes(node: Node, inheritedFont?: string): TextRun[] {
  const runs: TextRun[] = [];

  function traverse(n: Node, styles: { bold?: boolean; italics?: boolean; underline?: boolean; strike?: boolean; color?: string; size?: number }) {
    if (n.nodeType === Node.TEXT_NODE) {
      const text = n.textContent || '';
      if (text.length > 0) {
        runs.push(
          new TextRun({
            text,
            bold: styles.bold,
            italics: styles.italics,
            underline: styles.underline ? {} : undefined,
            strike: styles.strike,
            color: styles.color,
            size: styles.size ? styles.size * 2 : 24, // docx uses half-points (24 = 12pt)
            font: inheritedFont || 'Calibri',
          })
        );
      }
      return;
    }

    if (n.nodeType === Node.ELEMENT_NODE) {
      const el = n as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const newStyles = { ...styles };

      if (tag === 'b' || tag === 'strong' || el.style.fontWeight === 'bold' || parseInt(el.style.fontWeight, 10) >= 600) {
        newStyles.bold = true;
      }
      if (tag === 'i' || tag === 'em' || el.style.fontStyle === 'italic') {
        newStyles.italics = true;
      }
      if (tag === 'u' || el.style.textDecoration?.includes('underline')) {
        newStyles.underline = true;
      }
      if (tag === 's' || tag === 'strike' || tag === 'del' || el.style.textDecoration?.includes('line-through')) {
        newStyles.strike = true;
      }
      if (el.style.color) {
        // Convert rgb/hex to hex string without #
        const hex = rgbToHex(el.style.color);
        if (hex) newStyles.color = hex.replace('#', '');
      }
      if (el.style.fontSize) {
        const pt = parseFloat(el.style.fontSize);
        if (!isNaN(pt) && pt > 0) {
          newStyles.size = pt;
        }
      }

      el.childNodes.forEach((child) => traverse(child, newStyles));
    }
  }

  traverse(node, {});
  return runs;
}

function rgbToHex(color: string): string | null {
  if (color.startsWith('#')) return color;
  const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return null;
  const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
  const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
  const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
  return `${r}${g}${b}`;
}

function getAlignment(el: HTMLElement): (typeof AlignmentType)[keyof typeof AlignmentType] {
  const align = el.style.textAlign || el.getAttribute('align') || '';
  switch (align.toLowerCase()) {
    case 'center':
      return AlignmentType.CENTER;
    case 'right':
      return AlignmentType.RIGHT;
    case 'justify':
      return AlignmentType.JUSTIFIED;
    case 'left':
    default:
      return AlignmentType.LEFT;
  }
}

/**
 * Parses the HTML content string of the editor into docx Document elements
 */
function parseHtmlToDocxElements(html: string, defaultFont: string): (Paragraph | Table)[] {
  const parser = new DOMParser();
  const parsedDoc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const container = parsedDoc.body.firstElementChild || parsedDoc.body;
  const elements: (Paragraph | Table)[] = [];

  for (let i = 0; i < container.childNodes.length; i++) {
    const node = container.childNodes[i];

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        elements.push(
          new Paragraph({
            children: [new TextRun({ text, font: defaultFont, size: 24 })],
            spacing: { after: 120 },
          })
        );
      }
      continue;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const alignment = getAlignment(el);

      if (tag === 'h1') {
        elements.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment,
            children: parseInlineNodes(el, defaultFont),
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (tag === 'h2') {
        elements.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            alignment,
            children: parseInlineNodes(el, defaultFont),
            spacing: { before: 200, after: 100 },
          })
        );
      } else if (tag === 'h3') {
        elements.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            alignment,
            children: parseInlineNodes(el, defaultFont),
            spacing: { before: 160, after: 80 },
          })
        );
      } else if (tag === 'ul') {
        el.querySelectorAll(':scope > li').forEach((li) => {
          elements.push(
            new Paragraph({
              bullet: { level: 0 },
              alignment,
              children: parseInlineNodes(li, defaultFont),
              spacing: { after: 60 },
            })
          );
        });
      } else if (tag === 'ol') {
        let counter = 1;
        el.querySelectorAll(':scope > li').forEach((li) => {
          elements.push(
            new Paragraph({
              alignment,
              children: [
                new TextRun({ text: `${counter}. `, bold: true, font: defaultFont, size: 24 }),
                ...parseInlineNodes(li, defaultFont),
              ],
              spacing: { after: 60 },
            })
          );
          counter++;
        });
      } else if (tag === 'blockquote') {
        elements.push(
          new Paragraph({
            indent: { left: 720 },
            alignment,
            children: parseInlineNodes(el, defaultFont),
            spacing: { before: 120, after: 120 },
          })
        );
      } else if (tag === 'table') {
        const rows: TableRow[] = [];
        const trs = el.querySelectorAll('tr');

        trs.forEach((tr) => {
          const cells: TableCell[] = [];
          const tds = tr.querySelectorAll('th, td');

          tds.forEach((td) => {
            const isHeader = td.tagName.toLowerCase() === 'th';
            const cellParagraphs: Paragraph[] = [];
            const textRuns = parseInlineNodes(td, defaultFont);

            cellParagraphs.push(
              new Paragraph({
                children: textRuns.length > 0 ? textRuns : [new TextRun({ text: '', font: defaultFont, size: 22 })],
                alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
              })
            );

            cells.push(
              new TableCell({
                children: cellParagraphs,
                shading: isHeader ? { fill: 'F1F5F9' } : undefined,
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                  bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                  left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                  right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                },
                width: {
                  size: 100 / Math.max(1, tds.length),
                  type: WidthType.PERCENTAGE,
                },
              })
            );
          });

          if (cells.length > 0) {
            rows.push(new TableRow({ children: cells }));
          }
        });

        if (rows.length > 0) {
          elements.push(
            new Table({
              rows,
              width: { size: 100, type: WidthType.PERCENTAGE },
            })
          );
        }
      } else if (tag === 'hr') {
        elements.push(
          new Paragraph({
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
            },
            spacing: { before: 180, after: 180 },
            children: [],
          })
        );
      } else {
        // Standard paragraph or div
        const runs = parseInlineNodes(el, defaultFont);
        elements.push(
          new Paragraph({
            alignment,
            children: runs.length > 0 ? runs : [new TextRun({ text: '', font: defaultFont, size: 24 })],
            spacing: { after: 120, line: 276 }, // 1.15 line height
          })
        );
      }
    }
  }

  // Ensure there's at least one paragraph
  if (elements.length === 0) {
    elements.push(
      new Paragraph({
        children: [new TextRun({ text: '', font: defaultFont, size: 24 })],
      })
    );
  }

  return elements;
}

import { downloadOrShareBlob } from './fileSaverHelper';

/**
 * Exports the document state to a real Microsoft Word .docx file and initiates download or mobile share
 */
export async function exportToDocx(docState: DocumentState, preferShare: boolean = false): Promise<Blob> {
  const marginPreset = MARGIN_PRESETS.find((m) => m.id === docState.marginType) || MARGIN_PRESETS[0];

  // Convert pixels to twips (1 px ~ 15 twips at 96 DPI: 1440 twips = 1 inch = 96px => 1px = 15 twips)
  const pxToTwips = (px: number) => Math.round(px * 15);

  const topTwip = pxToTwips(marginPreset.top);
  const rightTwip = pxToTwips(marginPreset.right);
  const bottomTwip = pxToTwips(marginPreset.bottom);
  const leftTwip = pxToTwips(marginPreset.left);

  const isLandscape = docState.orientation === 'landscape';

  const docxElements = parseHtmlToDocxElements(docState.content, docState.fontFamily || 'Calibri');

  const doc = new Document({
    title: docState.title || 'Documento',
    description: 'Generado con VICTOR WORK DOCUMENTATION',
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: isLandscape ? DocxPageOrientation.LANDSCAPE : DocxPageOrientation.PORTRAIT,
            },
            margin: {
              top: topTwip,
              right: rightTwip,
              bottom: bottomTwip,
              left: leftTwip,
            },
          },
        },
        headers: docState.headerText
          ? {
              default: new Header({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({
                        text: docState.headerText,
                        color: '64748B',
                        size: 18,
                        font: docState.fontFamily || 'Calibri',
                      }),
                    ],
                  }),
                ],
              }),
            }
          : undefined,
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  ...(docState.footerText
                    ? [
                        new TextRun({
                          text: `${docState.footerText}  |  `,
                          color: '64748B',
                          size: 18,
                          font: docState.fontFamily || 'Calibri',
                        }),
                      ]
                    : []),
                  new TextRun({
                    children: ['Página ', PageNumber.CURRENT, ' de ', PageNumber.TOTAL_PAGES],
                    color: '64748B',
                    size: 18,
                    font: docState.fontFamily || 'Calibri',
                  }),
                ],
              }),
            ],
          }),
        },
        children: docxElements,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeFilename = (docState.title || 'Documento').replace(/[/\\?%*:|"<>]/g, '_');
  await downloadOrShareBlob(blob, `${safeFilename}.docx`, docState.title, preferShare);
  return blob;
}
