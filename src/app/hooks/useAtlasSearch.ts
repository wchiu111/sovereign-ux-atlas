import { useMemo, useState } from "react";
import { INDEXED_ATLAS_SEARCH_ENTRIES } from "../data/atlasSearchIndex";
import { normalizeSearchQuery } from "../search/normalizeSearchQuery";
import { searchAtlas } from "../search/searchAtlas";
import type { IndexedAtlasSearchEntry } from "../types/atlasSearch";

export function useAtlasSearch({
  entries = INDEXED_ATLAS_SEARCH_ENTRIES,
  limit = 4,
}: {
  entries?: readonly IndexedAtlasSearchEntry[];
  limit?: number;
} = {}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = useMemo(() => normalizeSearchQuery(query), [query]);
  const matches = useMemo(
    () => searchAtlas({ query, entries, limit }),
    [entries, limit, query],
  );

  return {
    query,
    setQuery,
    normalizedQuery,
    matches,
  };
}
