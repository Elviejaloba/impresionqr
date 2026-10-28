import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, resolve, sep } from 'node:path'

const root = resolve('dist')
const port = Number(process.env.PORT || 3000)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
}

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname)
    const candidate = resolve(root, '.' + pathname)
    if (candidate !== root && !candidate.startsWith(root + sep)) {
      response.writeHead(403).end()
      return
    }
    let file = candidate
    if (!(await stat(file).catch(() => null))?.isFile()) file = join(root, 'index.html')
    const content = await readFile(file)
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' })
    response.end(request.method === 'HEAD' ? undefined : content)
  } catch {
    response.writeHead(500).end('Error al servir la aplicación')
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`ImpresiónQR disponible en el puerto ${port}`)
})
