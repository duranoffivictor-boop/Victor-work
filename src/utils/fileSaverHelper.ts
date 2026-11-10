import { saveAs } from 'file-saver';

/**
 * Universal file saver and mobile sharing helper.
 * On mobile devices (iOS/Android), supports the Web Share API to directly save to
 * "Files" / "Downloads" / WhatsApp / Drive, while falling back to direct blob download.
 */
export async function downloadOrShareBlob(
  blob: Blob,
  filename: string,
  title: string = 'Documento',
  preferShare: boolean = false
): Promise<'shared' | 'downloaded'> {
  const isMobile =
    typeof navigator !== 'undefined' &&
    (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768);

  // If user explicitly requests mobile sharing or on mobile with preferShare
  if (preferShare && typeof navigator !== 'undefined' && 'canShare' in navigator) {
    try {
      const file = new File([blob], filename, { type: blob.type || 'application/octet-stream' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title || filename,
          text: `Documento "${filename}" generado en VICTOR WORK DOCUMENTATION`,
        });
        return 'shared';
      }
    } catch (shareErr: any) {
      // If user cancelled sharing dialog, do not fail
      if (shareErr.name === 'AbortError') {
        return 'shared';
      }
      console.warn('Web Share failed or unsupported, falling back to download:', shareErr);
    }
  }

  // Direct download method compatible with mobile and desktop
  try {
    saveAs(blob, filename);
  } catch (saveAsErr) {
    // Direct DOM anchor fallback
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);
  }

  return 'downloaded';
}
