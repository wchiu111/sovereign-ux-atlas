import { useEffect } from "react";
import { getAtlasEntry } from "../content/registry";
import { useAtlasState } from "../state";

const SITE_NAME = "Sovereign Atlas | wchiudesign";
const DEFAULT_DESCRIPTION =
  "Explore Wilson Chiu’s case studies, experiments, and frameworks for designing trustworthy AI and complex digital systems.";
const SYSTEM_LABELS: Record<string, string> = {
  "case-studies": "Case Studies",
  experiments: "Experiments",
  frameworks: "Frameworks",
};

function setMeta(selector: string, value: string) {
  document.head.querySelector<HTMLMetaElement>(selector)
    ?.setAttribute("content", value);
}

export default function AtlasSeo() {
  const { state } = useAtlasState();

  useEffect(() => {
    const entry = state.activePlanetId ? getAtlasEntry(state.activePlanetId) : undefined;
    const section = entry?.sections?.[state.focusSection];
    const system = state.activeSystemId ? SYSTEM_LABELS[state.activeSystemId] : undefined;
    const pageName = section && state.level === 3
      ? `${entry?.title}: ${section.label}`
      : entry?.title ?? system;
    const title = pageName ? `${pageName} | Sovereign Atlas` : SITE_NAME;
    const description = entry?.subtitle ?? DEFAULT_DESCRIPTION;
    const siteUrl = (import.meta.env.VITE_SITE_URL ?? "https://wchiudesign.com").replace(/\/$/, "");
    const canonicalUrl = `${siteUrl}${window.location.pathname}`;

    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute("href", canonicalUrl);

    const schema = entry
      ? {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: entry.title,
          description,
          url: canonicalUrl,
          author: { "@type": "Person", name: "Wilson Chiu" },
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: canonicalUrl,
          author: { "@type": "Person", name: "Wilson Chiu" },
        };
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
