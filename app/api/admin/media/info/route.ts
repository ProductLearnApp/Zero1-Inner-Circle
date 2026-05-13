import path from 'path'

export async function GET() {
  const isPersisted = !!process.env.UPLOAD_DIR
  const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads')
  return Response.json({ uploadDir, isPersisted })
}
