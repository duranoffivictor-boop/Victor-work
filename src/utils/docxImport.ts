import mammoth from 'mammoth';

/**
 * Imports a .docx file and converts its contents into clean HTML for the editor
 */
export async function importDocxFile(file: File): Promise<{ html: string; title: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value || '<p></p>';
  const title = file.name.replace(/\.docx$/i, '');
  return { html, title };
}
