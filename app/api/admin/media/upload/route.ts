import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

function getUploadDir(): string {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads')
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string | null)?.trim() || 'default'

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Sanitise folder name — alphanumeric, dashes, underscores only
    const safeFolder = folder.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 64)

    const ext = path.extname(file.name).toLowerCase() || '.bin'
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']
    if (!allowed.includes(ext)) {
      return Response.json({ error: `File type ${ext} not allowed` }, { status: 400 })
    }

    const fileName = `${randomUUID()}${ext}`
    const folderPath = path.join(getUploadDir(), safeFolder)

    if (!existsSync(folderPath)) {
      await mkdir(folderPath, { recursive: true })
    }

    const filePath = path.join(folderPath, fileName)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const url = `/api/admin/media/${safeFolder}/${fileName}`
    return Response.json({ url, name: fileName, folder: safeFolder, originalName: file.name })
  } catch (e) {
    console.error('[media/upload]', e)
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
