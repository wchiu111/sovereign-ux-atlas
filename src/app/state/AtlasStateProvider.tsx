import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { AtlasAction } from "./atlasActions";
import { atlasReducer } from "./atlasReducer";
import { initialAtlasState, type AtlasState } from "./atlasState";
import {
  currentBrowserPath,
  parseAtlasRoute,
  replaceAtlasPath,
} from "../routing/atlasRoutes";

interface AtlasStateContextValue {
  state: AtlasState;
  dispatch: Dispatch<AtlasAction>;
}

const AtlasStateContext = createContext<AtlasStateContextValue | null>(null);

export function AtlasStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    atlasReducer,
    initialAtlasState,
    (fallbackState) => {
      if (typeof window === "undefined") return fallbackState;
      const route = parseAtlasRoute(window.location);
      if (!route) {
        replaceAtlasPath("/");
        return fallbackState;
      }
      const canonicalPath = `${route.canonicalPath}${window.location.search}`;
      if (canonicalPath !== currentBrowserPath()) {
        replaceAtlasPath(canonicalPath);
      }
      return route.atlasState;
    },
  );
  const value = useMemo(() => ({ state, dispatch }), [state]);

  useEffect(() => {
    const restoreFromLocation = () => {
      const route = parseAtlasRoute(window.location);
      if (!route) {
        replaceAtlasPath("/");
        dispatch({ type: "RESTORE_NAVIGATION", state: initialAtlasState });
        return;
      }
      dispatch({ type: "RESTORE_NAVIGATION", state: route.atlasState });
    };

    window.addEventListener("popstate", restoreFromLocation);
    return () => window.removeEventListener("popstate", restoreFromLocation);
  }, []);

  return (
    <AtlasStateContext.Provider value={value}>
      {children}
    </AtlasStateContext.Provider>
  );
}

export function useAtlasStateContext() {
  const context = useContext(AtlasStateContext);
  if (!context) {
    throw new Error("useAtlasStateContext must be used inside AtlasStateProvider");
  }
  return context;
}
