/**
 * Semantic colors for the focused Atlas reader.
 *
 * Keep this separate from stellarPalette.ts:
 * semantic reader colors describe interface hierarchy;
 * stellar colors describe conceptual/domain meaning.
 */
export const readerSemanticColor = {
  text: {
    primary: "#F5F1E6",
    secondary: "#BDB18E",
    metadata: "#93876C",
    inactive: "#897B5D",
    caption: "#968B73",
  },
  identity: {
    primary: "#8AAEC8",
  },
  utility: {
    primary: "#C5A96E",
  },
} as const;

export type ReaderSemanticColor = typeof readerSemanticColor;
