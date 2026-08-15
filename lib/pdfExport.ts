import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  A4_WIDTH_MM,
  A4_WIDTH_PX,
  DOC_WIDTH_PX,
  PAGE_MARGIN_MM,
  PAGE_MARGIN_PX,
  CONTENT_PAGE_HEIGHT_MM,
  a4HeightPx,
  contentPageHeightPx,
} from '@/lib/pageLayout';
import { applyPageBreakGuards } from '@/lib/pageBreaks';

/** Ignore leftover shorter than this to avoid blank trailing pages */
const BLANK_PAGE_EPSILON_MM = 2.5;

async function toDataUrl(src: string): Promise<string> {
  if (!src || src.startsWith('data:')) return src;

  try {
    const res = await fetch(src, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return await new Promise<string>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const c = document.createElement('canvas');
          c.width = img.naturalWidth || img.width;
          c.height = img.naturalHeight || img.height;
          const ctx = c.getContext('2d');
          if (!ctx || !c.width || !c.height) {
            resolve(src);
            return;
          }
          ctx.drawImage(img, 0, 0);
          resolve(c.toDataURL('image/jpeg', 0.92));
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    });
  }
}

async function prepareElementForCapture(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map(async (img) => {
      const el = img as HTMLImageElement;
      const src = el.currentSrc || el.src;
      if (!src) return;

      try {
        const dataUrl = await toDataUrl(src);
        el.src = dataUrl;
        el.removeAttribute('srcset');
      } catch {
        /* keep original */
      }

      const rect = el.getBoundingClientRect();
      let w = Math.max(1, Math.round(rect.width || el.offsetWidth || 96));
      let h = Math.max(1, Math.round(rect.height || el.offsetHeight || 96));

      const parent = el.parentElement;
      const parentRadius = parent ? getComputedStyle(parent).borderRadius : '';
      const isCircleAvatar =
        !!parent &&
        (parent.classList.contains('rounded-full') ||
          parentRadius === '50%' ||
          parentRadius.startsWith('9999') ||
          parentRadius.split(' ').every((p) => p === '50%'));

      // Keep circular avatars square so PDF capture never locks in a squashed ellipse
      if (isCircleAvatar) {
        const side = Math.max(1, Math.round(Math.min(w, h) || 96));
        w = side;
        h = side;
      }

      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.maxWidth = `${w}px`;
      el.style.maxHeight = `${h}px`;
      el.style.objectFit = 'cover';
      el.style.objectPosition = 'center';
      el.style.display = 'block';

      if (parent) {
        parent.style.width = `${w}px`;
        parent.style.height = `${h}px`;
        parent.style.minWidth = `${w}px`;
        parent.style.minHeight = `${h}px`;
        parent.style.maxWidth = `${w}px`;
        parent.style.maxHeight = `${h}px`;
        parent.style.aspectRatio = '1 / 1';
        parent.style.overflow = 'hidden';
        parent.style.flexShrink = '0';
        parent.style.flexGrow = '0';
      }
    })
  );
}

function hardenCloneStyles(clonedRoot: HTMLElement) {
  clonedRoot.style.width = `${DOC_WIDTH_PX}px`;
  clonedRoot.style.maxWidth = `${DOC_WIDTH_PX}px`;
  clonedRoot.style.margin = '0';
  clonedRoot.style.transform = 'none';
  clonedRoot.style.boxShadow = 'none';
  clonedRoot.style.opacity = '1';

  clonedRoot.querySelectorAll('.truncate').forEach((node) => {
    const el = node as HTMLElement;
    el.style.overflow = 'visible';
    el.style.textOverflow = 'clip';
    el.style.whiteSpace = 'normal';
    el.style.wordBreak = 'break-word';
    el.classList.remove('truncate');
  });

  clonedRoot.querySelectorAll('*').forEach((node) => {
    const el = node as HTMLElement;
    if (el.style) {
      el.style.backdropFilter = 'none';
      // @ts-expect-error vendor
      el.style.webkitBackdropFilter = 'none';
    }
  });
}

/**
 * Export resume to multi-page A4 PDF with consistent page margins.
 */
export async function exportToPdf(filename: string = 'Resume.pdf'): Promise<void> {
  const source = document.getElementById('resume-preview-canvas');
  if (!source) {
    console.error('Resume preview canvas element not found.');
    return;
  }

  const host = document.createElement('div');
  host.setAttribute('data-pdf-export-host', 'true');
  host.style.cssText = [
    'position:fixed',
    'left:0',
    'top:0',
    `width:${DOC_WIDTH_PX}px`,
    'z-index:2147483646',
    'opacity:1',
    'pointer-events:none',
    'background:#ffffff',
  ].join(';');

  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.style.width = `${DOC_WIDTH_PX}px`;
  clone.style.minHeight = `${contentPageHeightPxFallback()}px`;
  clone.style.height = 'auto';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.transform = 'none';
  clone.style.opacity = '1';
  clone.style.position = 'relative';
  clone.style.left = '0';
  clone.style.top = '0';
  clone.style.backgroundColor = '#ffffff';

  host.appendChild(clone);
  document.body.appendChild(host);

  clone.getBoundingClientRect();
  await prepareElementForCapture(clone);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  // Re-apply page guards on the export clone so PDF slices match preview pagination
  const pageContentH = contentPageHeightPx(a4HeightPx(A4_WIDTH_PX));
  applyPageBreakGuards(clone, pageContentH);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
      width: DOC_WIDTH_PX,
      windowWidth: DOC_WIDTH_PX,
      scrollX: 0,
      scrollY: 0,
      onclone: (_doc, el) => {
        hardenCloneStyles(el as HTMLElement);
      },
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const contentWidthMm = A4_WIDTH_MM - PAGE_MARGIN_MM * 2;
    const contentHeightMm = CONTENT_PAGE_HEIGHT_MM;
    const imgHeightMm = (canvas.height * contentWidthMm) / canvas.width;

    let totalPages = Math.max(1, Math.ceil(imgHeightMm / contentHeightMm));
    const leftover = imgHeightMm - (totalPages - 1) * contentHeightMm;
    if (totalPages > 1 && leftover < BLANK_PAGE_EPSILON_MM) {
      totalPages -= 1;
    }
    if (imgHeightMm <= contentHeightMm + BLANK_PAGE_EPSILON_MM) {
      totalPages = 1;
    }

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage();

      const srcY = (page * contentHeightMm * canvas.width) / contentWidthMm;
      const idealSrcHeight = (contentHeightMm * canvas.width) / contentWidthMm;
      const srcHeight = Math.min(idealSrcHeight, Math.max(0, canvas.height - srcY));
      if (srcHeight < 2) continue;

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.max(1, Math.ceil(srcHeight));

      const ctx = pageCanvas.getContext('2d');
      if (!ctx) continue;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0,
        Math.floor(srcY),
        canvas.width,
        Math.ceil(srcHeight),
        0,
        0,
        pageCanvas.width,
        pageCanvas.height
      );

      const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
      const drawHeightMm = Math.min(
        contentHeightMm,
        (pageCanvas.height * contentWidthMm) / pageCanvas.width
      );

      // Place content inside page margins on every A4 sheet
      pdf.addImage(
        imgData,
        'JPEG',
        PAGE_MARGIN_MM,
        PAGE_MARGIN_MM,
        contentWidthMm,
        drawHeightMm,
        undefined,
        'FAST'
      );
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    host.remove();
  }
}

function contentPageHeightPxFallback(): number {
  return Math.max(1, a4HeightPx(A4_WIDTH_PX) - PAGE_MARGIN_PX * 2);
}
