export function getContrastTextColor(hexColor: string): string {
  // Default fallback
  if (!hexColor || typeof hexColor !== 'string') return '#ffffff';

  // Normalize hex
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((char) => char + char).join('');
  }

  if (hex.length !== 6) return '#ffffff';

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Relative luminance formula (WCAG 2.0)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.65 ? '#111827' : '#ffffff';
}

export const getContrastColor = getContrastTextColor;

export function hexToRgba(hexColor: string, alpha: number = 0.1): string {
  if (!hexColor || typeof hexColor !== 'string') return `rgba(13, 148, 136, ${alpha})`;

  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }

  if (hex.length !== 6) return `rgba(13, 148, 136, ${alpha})`;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
