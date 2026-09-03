import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, stat } from 'node:fs/promises'
import { resolve, sep } from 'node:path'

export default defineConfig(({isPreview}) => ({
  appType: isPreview ? 'mpa' : 'spa',
  // Generated archives and QA output are not source. On Windows, watching a
  // ZIP while it is being written can raise EBUSY and terminate the dev server.
  server: {
    watch: { ignored: [/(?:^|[/\\])(?:release|\.verify)(?:[/\\]|$)/] },
  },
  plugins: [react(), {
    name: 'static-preview-not-found',
    configurePreviewServer(server) {
      return () => server.middlewares.use(async (request, response, next) => {
        if (!request.headers.accept?.includes('text/html')) return next()
        try {
          const output = resolve(server.config.root, server.config.build.outDir)
          const requested = resolve(output, '.' + decodeURI((request.url || '/').split('?')[0]))
          if (requested.startsWith(output + sep) && await stat(requested).then(s => s.isFile(), () => false)) return next()
          const html = await readFile(resolve(output, '404.html'))
          response.statusCode = 404
          response.setHeader('Content-Type', 'text/html; charset=utf-8')
          response.end(html)
        } catch { next() }
      })
    },
  }],
}))
