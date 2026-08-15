/** Shared A4 page geometry for preview + PDF */

export const A4_WIDTH_PX = 794;
/** Clear margin on every page edge (preview frame + PDF) */
export const PAGE_MARGIN_PX = 56;
/** Content column width inside the margin frame */
export const DOC_WIDTH_PX = A4_WIDTH_PX - PAGE_MARGIN_PX * 2;
/** Visual gap between stacked A4 sheets in the preview */
export const PAGE_GAP_PX = 28;

export function a4HeightPx(widthPx: number = A4_WIDTH_PX): number {
  return (297 / 210) * widthPx;
}

/** Usable content height per page after top+bottom margins */
export function contentPageHeightPx(pageHeightPx: number = a4HeightPx()): number {
  return Math.max(1, pageHeightPx - PAGE_MARGIN_PX * 2);
}

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const PAGE_MARGIN_MM = (PAGE_MARGIN_PX / A4_WIDTH_PX) * A4_WIDTH_MM;
export const CONTENT_PAGE_HEIGHT_MM = A4_HEIGHT_MM - PAGE_MARGIN_MM * 2;
