export type SeoIndexability =
  | "index"
  | "hold"
  | "retired"
  | "unreleased"
  | "app-state-only";

export interface AtlasSeoMetadata {
  path: string;
  title: string;
  description: string;
  canonicalPath: string;
  indexability: SeoIndexability;
  schemaType?: "WebSite" | "CreativeWork";
}

export const PRODUCTION_SITE_URL = "https://wchiudesign.com";

export const HOMEPAGE_SEO: AtlasSeoMetadata = {
  path: "/",
  title: "Wilson Chiu — Product Designer & Design Engineer | Sovereign Atlas",
  description:
    "Product designer and design engineer exploring AI-native UX, agentic systems, trust, and complex enterprise products. Explore case studies, frameworks, and experiments in the Sovereign Atlas.",
  canonicalPath: "/",
  indexability: "index",
  schemaType: "WebSite",
};

export const SEO_ROUTE_INVENTORY: AtlasSeoMetadata[] = [
  HOMEPAGE_SEO,
  {
    path: "/case-studies/agentic-insurance",
    title: "Agentic Insurance — AI Product Design Case Study | Wilson Chiu",
    description:
      "An exploration of AI-assisted insurance workflows examining how agents can support complex decisions while preserving human judgment, visibility, and control.",
    canonicalPath: "/case-studies/agentic-insurance",
    indexability: "index",
    schemaType: "CreativeWork",
  },
  {
    path: "/case-studies/globality",
    title: "Globality — Enterprise AI Product Design Case Study | Wilson Chiu",
    description:
      "Product design work at Globality focused on AI-powered enterprise procurement, complex workflows, scalable product systems, and reducing friction across sourcing experiences.",
    canonicalPath: "/case-studies/globality",
    indexability: "index",
    schemaType: "CreativeWork",
  },
  {
    path: "/case-studies/oracle",
    title: "Oracle — Enterprise Design Case Study | Wilson Chiu",
    description:
      "Design work at Oracle translating a complex higher-education product ecosystem into a clearer, adaptable customer experience through information architecture and progressive disclosure.",
    canonicalPath: "/case-studies/oracle",
    indexability: "index",
    schemaType: "CreativeWork",
  },
  {
    path: "/case-studies/sovereign-atlas",
    title:
      "Sovereign Atlas — Product Design & Design Engineering Case Study | Wilson Chiu",
    description:
      "How Wilson Chiu designed and built an interactive knowledge system connecting case studies, frameworks, experiments, evidence, search, and AI-assisted exploration.",
    canonicalPath: "/case-studies/sovereign-atlas",
    indexability: "index",
    schemaType: "CreativeWork",
  },
  {
    path: "/frameworks/authority-gradient",
    title: "Decision Rights — Human & AI Decision Authority Framework | Wilson Chiu",
    description:
      "A framework for determining when AI should recommend, act, defer, or require human approval within AI-assisted products.",
    canonicalPath: "/frameworks/authority-gradient",
    indexability: "index",
    schemaType: "CreativeWork",
  },
  {
    path: "/frameworks/relational-ai-literacy",
    title:
      "Relational AI Literacy — Understanding Human-AI Relationships | Wilson Chiu",
    description:
      "A framework for understanding how people interpret, trust, collaborate with, and establish boundaries with increasingly relational AI systems.",
    canonicalPath: "/frameworks/relational-ai-literacy",
    indexability: "index",
    schemaType: "CreativeWork",
  },
  {
    path: "/frameworks/regenerative-systems",
    title:
      "Regenerative Systems — Preserving Design Intent in AI Systems | Wilson Chiu",
    description:
      "A framework for identifying, containing, and repairing design drift as AI-generated products evolve from design through implementation.",
    canonicalPath: "/frameworks/regenerative-systems",
    indexability: "index",
    schemaType: "CreativeWork",
  },
  {
    path: "/frameworks/presence-navigation",
    title: "Presence Navigation — Designing Interfaces Around User State | Wilson Chiu",
    description:
      "A framework exploring how interfaces can respond to attention, context, readiness, and user state rather than relying only on conventional navigation.",
    canonicalPath: "/frameworks/presence-navigation",
    indexability: "index",
    schemaType: "CreativeWork",
  },
];

const ROUTE_MAP = new Map(SEO_ROUTE_INVENTORY.map((route) => [route.path, route]));

const EXPLICIT_EXCLUSIONS: Record<string, SeoIndexability> = {
  "/frameworks/application-kit": "hold",
  "/frameworks/behavioral-architecture": "retired",
};

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

export function getSeoMetadata(pathname: string): AtlasSeoMetadata {
  const path = normalizePath(pathname);
  const approved = ROUTE_MAP.get(path);
  if (approved) return approved;

  const approvedParent = SEO_ROUTE_INVENTORY.find(
    (route) => route.path !== "/" && path.startsWith(`${route.path}/`),
  );
  const exclusion = EXPLICIT_EXCLUSIONS[path]
    ?? (path.startsWith("/experiments/") ? "unreleased" : undefined)
    ?? "app-state-only";

  return {
    path,
    title: approvedParent?.title ?? HOMEPAGE_SEO.title,
    description: approvedParent?.description ?? HOMEPAGE_SEO.description,
    canonicalPath: approvedParent?.canonicalPath ?? path,
    indexability: exclusion,
    schemaType: approvedParent?.schemaType,
  };
}

export function getIndexableSeoRoutes() {
  return SEO_ROUTE_INVENTORY.filter((route) => route.indexability === "index");
}

export function absoluteSeoUrl(path: string, siteUrl = PRODUCTION_SITE_URL) {
  return `${siteUrl.replace(/\/$/, "")}${path === "/" ? "/" : path}`;
}

export function buildSeoSchema(metadata: AtlasSeoMetadata, siteUrl = PRODUCTION_SITE_URL) {
  const url = absoluteSeoUrl(metadata.canonicalPath, siteUrl);
  const person = {
    "@type": "Person",
    "@id": `${siteUrl.replace(/\/$/, "")}/#wilson-chiu`,
    name: "Wilson Chiu",
    jobTitle: ["Product Designer", "Design Engineer"],
  };

  if (metadata.schemaType === "CreativeWork") {
    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: metadata.title.split(" — ")[0],
      description: metadata.description,
      url,
      author: person,
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${siteUrl.replace(/\/$/, "")}/#website`,
        name: "Sovereign Atlas",
        description: metadata.description,
        url,
        author: { "@id": person["@id"] },
      },
    ],
  };
}
