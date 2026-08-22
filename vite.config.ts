import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import type { Plugin, ResolvedConfig } from 'vite'
import {
  absoluteSeoUrl,
  buildSeoSchema,
  getIndexableSeoRoutes,
  HOMEPAGE_SEO,
  type AtlasSeoMetadata,
} from './src/app/seo/seoMetadata'


function figmaAssetResolver(): Plugin {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function renderMetadata(
  html: string,
  metadata: AtlasSeoMetadata,
  siteUrl: string,
  indexableBuild: boolean,
) {
  const shouldIndex = indexableBuild && metadata.indexability === 'index'
  const canonical = absoluteSeoUrl(metadata.canonicalPath, siteUrl)
  const robots = shouldIndex ? 'index, follow' : 'noindex, nofollow'
  const schema = JSON.stringify(buildSeoSchema(metadata, siteUrl)).replaceAll('<', '\\u003c')
  const rendered = html
    .replaceAll('__ATLAS_TITLE__', escapeHtml(metadata.title))
    .replaceAll('__ATLAS_DESCRIPTION__', escapeHtml(metadata.description))
    .replaceAll('__ATLAS_SITE_URL__/', canonical)
    .replaceAll('__ATLAS_ROBOTS__', robots)
    .replace('__ATLAS_SCHEMA__', schema)
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(" \/>)/, `$1${escapeHtml(metadata.description)}$2`)
    .replace(/(<meta name="robots" content=")[^"]*(" \/>)/, `$1${robots}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(" \/>)/, `$1${canonical}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(" \/>)/, `$1${escapeHtml(metadata.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(" \/>)/, `$1${escapeHtml(metadata.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(" \/>)/, `$1${canonical}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(" \/>)/, `$1${escapeHtml(metadata.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(" \/>)/, `$1${escapeHtml(metadata.description)}$2`)
    .replace(/(<script id="atlas-structured-data" type="application\/ld\+json">).*?(<\/script>)/, `$1${schema}$2`)

  return metadata.indexability === 'app-state-only'
    ? rendered.replace(/\s*<link rel="canonical" href="[^"]*" \/>/, '')
    : rendered
}

function atlasMetadata(): Plugin {
  const siteUrl = (process.env.VITE_SITE_URL ?? 'https://wchiudesign.com').replace(/\/$/, '')
  const indexable = process.env.VITE_SITE_INDEXABLE === 'true'
  let resolvedConfig: ResolvedConfig
  return {
    name: 'atlas-metadata',
    configResolved(config) {
      resolvedConfig = config
    },
    transformIndexHtml(html: string) {
      return renderMetadata(html, HOMEPAGE_SEO, siteUrl, indexable)
    },
    generateBundle() {
      const indexableRoutes = getIndexableSeoRoutes()
      const routeUrls = indexableRoutes.map((route) => absoluteSeoUrl(route.path, siteUrl))
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: indexable
          ? `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
          : 'User-agent: *\nDisallow: /\n',
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routeUrls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`,
      })
    },
    writeBundle() {
      const outputDirectory = path.resolve(resolvedConfig.root, resolvedConfig.build.outDir)
      const homepagePath = path.join(outputDirectory, 'index.html')
      const template = fs.readFileSync(homepagePath, 'utf8')

      getIndexableSeoRoutes()
        .filter((route) => route.path !== '/')
        .forEach((route) => {
          const routeDirectory = path.join(outputDirectory, route.path.slice(1))
          fs.mkdirSync(routeDirectory, { recursive: true })
          fs.writeFileSync(
            path.join(routeDirectory, 'index.html'),
            renderMetadata(template, route, siteUrl, indexable),
          )
        })

      fs.writeFileSync(
        path.join(outputDirectory, 'app-shell.html'),
        renderMetadata(
          template,
          { ...HOMEPAGE_SEO, indexability: 'app-state-only' },
          siteUrl,
          false,
        ),
      )
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    atlasMetadata(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
