import { NextRequest } from 'next/server'
import { readdir, mkdir, unlink, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

function getUploadDir(): string {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads')
}

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'])

/** GET /api/admin/media — list all folders and files */
export async function GET() {
  try {
    const base = getUploadDir()

    if (!existsSync(base)) {
      return Response.json({ folders: [], files: [] })
    }

    const entries = await readdir(base, { withFileTypes: true })
    const folders = entries.filter(e => e.isDirectory()).map(e => e.name).sort()

    const files: { name: string; originalName: string; folder: string; url: string; size: number }[] = []

    for (const folder of folders) {
      const folderPath = path.join(base, folder)
      let folderEntries: Awaited<ReturnType<typeof readdir>>
      try {
        folderEntries = await readdir(folderPath, { withFileTypes: true })
      } catch {
        continue
      }
      for (const entry of folderEntries) {
        if (!entry.isFile()) continue
        const ext = path.extname(entry.name).toLowerCase()
        if (!IMAGE_EXTS.has(ext)) continue
        const fileStat = await stat(path.join(folderPath, entry.name)).catch(() => null)
        files.push({
          name: entry.name,
          originalName: entry.name,
          folder,
          url: `/api/admin/media/${folder}/${entry.name}`,
          size: fileStat?.size ?? 0,
        })
      }
    }

    return Response.json({ folders, files })
  } catch (e) {
    console.error('[media GET]', e)
    return Response.json({ error: String(e) }, { status: 500 })
  }
}

/** POST /api/admin/media — create a folder: body { folder: string } */
export async function POST(req: NextRequest) {
  try {
    const { folder } = await req.json() as { folder?: string }
    if (!folder?.trim()) {
      return Response.json({ error: 'folder name required' }, { status: 400 })
    }
    const safeFolder = folder.trim().replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 64)
    const folderPath = path.join(getUploadDir(), safeFolder)
    await mkdir(folderPath, { recursive: true })
    return Response.json({ folder: safeFolder })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}

/** DELETE /api/admin/media?path=folder/filename.jpg */
export async function DELETE(req: NextRequest) {
  try {
    const filePath = new URL(req.url).searchParams.get('path')
    if (!filePath) {
      return Response.json({ error: 'path required' }, { status: 400 })
    }

    // Guard against path traversal
    const base = getUploadDir()
    const resolved = path.resolve(base, filePath)
    if (!resolved.startsWith(path.resolve(base))) {
      return Response.json({ error: 'Invalid path' }, { status: 400 })
    }

    if (!existsSync(resolved)) {
      return Response.json({ error: 'File not found' }, { status: 404 })
    }

    await unlink(resolved)
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
