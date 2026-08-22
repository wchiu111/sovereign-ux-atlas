import { useEffect } from "react";
import { useAtlasState } from "../state";
import {
  absoluteSeoUrl,
  buildSeoSchema,
  getSeoMetadata,
} from "./seoMetadata";

function setMeta(selector: string, value: string) {
  document.head.querySelector<HTMLMetaElement>(selector)
    ?.setAttribute("content", value);
}

export default function AtlasSeo() {
  const { state } = useAtlasState();

  useEffect(() => {
    const metadata = getSeoMetadata(window.location.pathname);
    const siteUrl = (import.meta.env.VITE_SITE_URL ?? "https://wchiudesign.com").replace(/\/$/, "");
    const canonicalUrl = absoluteSeoUrl(metadata.canonicalPath, siteUrl);
    const robots = metadata.indexability === "index"
      ? "index, follow"
      : "noindex, nofollow";

    document.title = metadata.title;
    setMeta('meta[name="description"]', metadata.description);
    setMeta('meta[name="robots"]', robots);
    setMeta('meta[property="og:title"]', metadata.title);
    setMeta('meta[property="og:description"]', metadata.description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[name="twitter:title"]', metadata.title);
    setMeta('meta[name="twitter:description"]', metadata.description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const schema = buildSeoSchema(metadata, siteUrl);
    let structuredData = document.head.querySelector<HTMLScriptElement>(
      "#atlas-structured-data",
    );
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = "atlas-structured-data";
      structuredData.type = "application/ld+json";
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(schema);
  }, [state.activePlanetId, state.activeSystemId, state.focusSection, state.level]);

  return null;
}
