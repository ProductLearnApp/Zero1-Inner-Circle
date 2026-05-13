import { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

function getUploadDir(): string {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads')
}

const MIME: Record<string, string> = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.avif': 'image/avif',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const segments = params.path
    const base = getUploadDir()
    const resolved = path.resolve(base, ...segments)

    // Guard against path traversal
    if (!resolved.startsWith(path.resolve(base))) {
      return new Response('Forbidden', { status: 403 })
    }

    if (!existsSync(resolved)) {
      return new Response('Not found', { status: 404 })
    }

    const ext = path.extname(resolved).toLowerCase()
    const contentType = MIME[ext] ?? 'application/octet-stream'
    const buffer = await readFile(resolved)

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (e) {
    console.error('[media serve]', e)
    return new Response('Internal server error', { status: 500 })
  }
}
