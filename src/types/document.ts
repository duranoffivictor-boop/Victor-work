export type PageOrientation = 'portrait' | 'landscape';

export type PageSize = 'letter' | 'a4' | 'legal';

export interface PageDimension {
  width: number; // in pixels at 100%
  height: number;
  label: string;
  name: PageSize;
}

export const PAGE_DIMENSIONS: Record<PageSize, { portrait: PageDimension; landscape: PageDimension }> = {
  letter: {
    portrait: { width: 816, height: 1056, label: 'Carta (Letter 21.6 x 27.9 cm)', name: 'letter' },
    landscape: { width: 1056, height: 816, label: 'Carta Horizontal', name: 'letter' },
  },
  a4: {
    portrait: { width: 794, height: 1123, label: 'A4 (21.0 x 29.7 cm)', name: 'a4' },
    landscape: { width: 1123, height: 794, label: 'A4 Horizontal', name: 'a4' },
  },
  legal: {
    portrait: { width: 816, height: 1344, label: 'Oficio (Legal 21.6 x 35.6 cm)', name: 'legal' },
    landscape: { width: 1344, height: 816, label: 'Oficio Horizontal', name: 'legal' },
  },
};

export type MarginType = 'normal' | 'narrow' | 'moderate' | 'wide';

export interface MarginPreset {
  id: MarginType;
  label: string;
  top: number; // px
  right: number;
  bottom: number;
  left: number;
  cmDescription: string;
}

export const MARGIN_PRESETS: MarginPreset[] = [
  {
    id: 'normal',
    label: 'Normal',
    top: 96, // 2.54 cm
    right: 96,
    bottom: 96,
    left: 96,
    cmDescription: '2.54 cm en todos los lados',
  },
  {
    id: 'narrow',
    label: 'Estrecho',
    top: 48, // 1.27 cm
    right: 48,
    bottom: 48,
    left: 48,
    cmDescription: '1.27 cm en todos los lados',
  },
  {
    id: 'moderate',
    label: 'Moderado',
    top: 96,
    right: 72,
    bottom: 96,
    left: 72,
    cmDescription: 'Sup/Inf 2.54 cm · Izq/Der 1.9 cm',
  },
  {
    id: 'wide',
    label: 'Ancho',
    top: 96,
    right: 144,
    bottom: 96,
    left: 144,
    cmDescription: 'Sup/Inf 2.54 cm · Izq/Der 3.8 cm',
  },
];

export type ViewMode = 'print' | 'web' | 'reading';

export interface DocumentState {
  id: string;
  title: string;
  content: string; // rich HTML
  headerText: string;
  footerText: string;
  pageSize: PageSize;
  orientation: PageOrientation;
  marginType: MarginType;
  customMargins?: { top: number; right: number; bottom: number; left: number };
  pageColor: string;
  fontFamily: string;
  fontSize: string;
  updatedAt: string;
  createdAt: string;
}

export interface DocumentStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  readingTimeMinutes: number;
}
