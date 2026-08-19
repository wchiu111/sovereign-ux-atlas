import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import type { Plugin } from 'vite'


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

function collectAtlasOverviewPaths() {
  const categories = {
    'case-studies': 'case-studies',
    experiments: 'experiments',
    frameworks: 'frameworks',
  }
  const paths = ['/', '/case-studies', '/experiments', '/frameworks']

  Object.entries(categories).forEach(([directory, routeRoot]) => {
    const contentDirectory = path.resolve(__dirname, 'src/app/content', directory)
    fs.readdirSync(contentDirectory)
      .filter((filename) => filename.endsWith('.ts') && filename !== 'index.ts')
      .forEach((filename) => {
        const source = fs.readFileSync(path.join(contentDirectory, filename), 'utf8')
        const id = source.match(/export default defineAtlasEntry\(\{\s*id:\s*["']([^"']+)/)?.[1]
        const slug = source.match(/\n\s*routeSlug:\s*["']([^"']+)/)?.[1]
        if (id) paths.push(`/${routeRoot}/${slug ?? id}`)
      })
  })
  return paths
}

function atlasMetadata(): Plugin {
  const siteUrl = (process.env.VITE_SITE_URL ?? 'https://wchiudesign.com').replace(/\/$/, '')
  const indexable = process.env.VITE_SITE_INDEXABLE === 'true'
  const robots = indexable ? 'index, follow' : 'noindex, nofollow'
  return {
    name: 'atlas-metadata',
    transformIndexHtml(html: string) {
      return html
        .replaceAll('__ATLAS_SITE_URL__', siteUrl)
        .replace('__ATLAS_ROBOTS__', robots)
    },
    generateBundle() {
      const routeUrls = collectAtlasOverviewPaths().map((route) => `${siteUrl}${route}`)
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
