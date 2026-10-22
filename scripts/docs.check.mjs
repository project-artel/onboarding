import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { documentation } = await server.ssrLoadModule('/src/docs/content.ts')
  const { selfHostingPaths } = await server.ssrLoadModule('/src/i18n/selfHostingRoutes.ts')
  const ko = documentation('ko'), en = documentation('en')
  assert.deepEqual(ko.map(p => p.path), en.map(p => p.path))
  const routes = ['/', '/sdk', '/cli', '/skills', '/how-it-works', ...selfHostingPaths, ...ko.map(p => p.path)]
  assert.equal(new Set(routes).size, routes.length)
  const sitemap = readFileSync('public/sitemap.xml', 'utf8')
  const llms = readFileSync('public/llms.txt', 'utf8')
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])
  const expected = routes.flatMap(path => ['https://artel.kr' + path, 'https://artel.kr/en' + (path === '/' ? '' : path)])
  assert.deepEqual([...urls].sort(), [...expected].sort(), 'sitemap and routes')
  for (const url of expected) assert.ok(llms.includes('(' + url + ')'), 'llms: ' + url)
  for (const pages of [ko, en]) for (const page of pages) {
    assert.ok(page.title && page.description && page.sections.length)
    assert.equal(new Set(page.sections.map(s => s.id)).size, page.sections.length, page.path)
    const counterpart = en.find(p => p.path === page.path)
    assert.deepEqual(page.sections.map(s => s.id), counterpart.sections.map(s => s.id))
    for (const section of page.sections) for (const link of section.links ?? []) {
      if (!link.to.startsWith('/')) continue
      const [path, hash] = link.to.split('#')
      if (path.endsWith('.md')) { assert.ok(existsSync('public' + path)); continue }
      assert.ok(routes.includes(path), 'unknown link: ' + link.to)
      if (hash) assert.ok(pages.find(p => p.path === path)?.sections.some(s => s.id === hash), 'unknown anchor: ' + link.to)
    }
  }
  console.log('Documentation checks passed: ' + ko.length + ' pages per locale; sitemap and internal links match.')
} finally {
  await server.close()
}
