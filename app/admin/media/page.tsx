'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

type MediaFile = {
  name: string
  folder: string
  url: string
  size: number
}

type MediaData = {
  folders: string[]
  files: MediaFile[]
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function MediaPage() {
  const [data, setData]                   = useState<MediaData>({ folders: [], files: [] })
  const [loading, setLoading]             = useState(true)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [uploading, setUploading]         = useState(false)
  const [newFolder, setNewFolder]         = useState('')
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [copiedUrl, setCopiedUrl]         = useState<string | null>(null)
  const [deleting, setDeleting]           = useState<string | null>(null)
  const [dragOver, setDragOver]           = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) {
        const json = await res.json() as MediaData
        setData(json)
        // Auto-select first folder if none selected
        setSelectedFolder(f => f ?? (json.folders[0] ?? null))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const visibleFiles = selectedFolder
    ? data.files.filter(f => f.folder === selectedFolder)
    : data.files

  async function handleCreateFolder(e: React.FormEvent) {
    e.preventDefault()
    if (!newFolder.trim()) return
    setCreatingFolder(true)
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: newFolder.trim() }),
      })
      if (res.ok) {
        const { folder } = await res.json() as { folder: string }
        setNewFolder('')
        setShowNewFolder(false)
        await load()
        setSelectedFolder(folder)
      }
    } finally {
      setCreatingFolder(false)
    }
  }

  async function uploadFiles(files: FileList | File[]) {
    if (!selectedFolder) {
      alert('Select or create a folder first.')
      return
    }
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('folder', selectedFolder)
        await fetch('/api/admin/media/upload', { method: 'POST', body: fd })
      }
      await load()
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(file: MediaFile) {
    if (!confirm(`Delete "${file.name}"?`)) return
    setDeleting(`${file.folder}/${file.name}`)
    try {
      await fetch(`/api/admin/media?path=${encodeURIComponent(`${file.folder}/${file.name}`)}`, {
        method: 'DELETE',
      })
      await load()
    } finally {
      setDeleting(null)
    }
  }

  function copyUrl(url: string) {
    const absolute = `${window.location.origin}${url}`
    navigator.clipboard.writeText(absolute).then(() => {
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
  }

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden" style={{ background: '#0a0a0f' }}>

      {/* ── Left: folder sidebar ──────────────────────────── */}
      <aside className="flex flex-col flex-shrink-0 w-56 border-r overflow-y-auto"
        style={{ background: 'linear-gradient(to bottom, #030308, #06060c)', borderColor: '#1e1e1e' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 flex-shrink-0 border-b"
          style={{ borderColor: '#1e1e1e' }}>
          <h2 className="text-sm font-semibold text-white">Folders</h2>
          <button
            onClick={() => setShowNewFolder(v => !v)}
            className="w-6 h-6 rounded flex items-center justify-center text-lg leading-none transition-colors"
            style={{ color: 'var(--accent)', background: 'rgba(242,186,48,0.1)' }}
            title="New folder"
          >+</button>
        </div>

        {/* New folder form */}
        {showNewFolder && (
          <form onSubmit={handleCreateFolder} className="px-3 pt-3 pb-2">
            <input
              autoFocus
              value={newFolder}
              onChange={e => setNewFolder(e.target.value)}
              placeholder="Folder name…"
              className="w-full rounded px-2 py-1.5 text-xs text-white outline-none"
              style={{ background: '#161616', border: '1px solid #333' }}
            />
            <div className="flex gap-2 mt-2">
              <button type="submit" disabled={creatingFolder || !newFolder.trim()}
                className="flex-1 py-1 rounded text-xs font-semibold text-black disabled:opacity-50"
                style={{ background: 'var(--accent)' }}>
                {creatingFolder ? '…' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowNewFolder(false); setNewFolder('') }}
                className="flex-1 py-1 rounded text-xs"
                style={{ color: '#666', background: '#1a1a1a' }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* All files entry */}
        <button
          onClick={() => setSelectedFolder(null)}
          className="flex items-center px-4 h-9 text-xs transition-colors text-left"
          style={selectedFolder === null
            ? { color: '#f2ba30', fontWeight: 600, background: 'rgba(242,186,48,0.08)' }
            : { color: 'rgba(102,102,102,0.7)' }}>
          All files
          <span className="ml-auto text-[10px]" style={{ color: '#404040' }}>{data.files.length}</span>
        </button>

        {/* Folder list */}
        {loading ? (
          <p className="text-xs px-4 py-2" style={{ color: '#404040' }}>Loading…</p>
        ) : data.folders.length === 0 ? (
          <p className="text-xs px-4 py-3" style={{ color: '#333' }}>No folders yet</p>
        ) : (
          data.folders.map(folder => {
            const count = data.files.filter(f => f.folder === folder).length
            const active = selectedFolder === folder
            return (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className="flex items-center px-4 h-9 text-xs transition-colors text-left w-full"
                style={active
                  ? { color: '#f2ba30', fontWeight: 600, background: 'rgba(242,186,48,0.08)' }
                  : { color: 'rgba(102,102,102,0.7)' }}>
                <span className="truncate">{folder}</span>
                <span className="ml-auto flex-shrink-0 text-[10px]" style={{ color: '#404040' }}>{count}</span>
              </button>
            )
          })
        )}
      </aside>

      {/* ── Right: content area ───────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 h-16 flex-shrink-0 border-b"
          style={{ borderColor: '#1e1e1e' }}>
          <h1 className="text-base font-semibold text-white">
            {selectedFolder ?? 'All files'}
            <span className="ml-2 text-xs font-normal" style={{ color: '#404040' }}>
              {visibleFiles.length} {visibleFiles.length === 1 ? 'file' : 'files'}
            </span>
          </h1>

          {selectedFolder && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-black disabled:opacity-50"
              style={{ background: 'var(--accent)' }}>
              {uploading ? 'Uploading…' : '+ Upload'}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => e.target.files && uploadFiles(e.target.files)}
          />
        </div>

        {/* Drop zone + grid */}
        <div
          className="flex-1 overflow-y-auto p-6"
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {/* Drop overlay */}
          {dragOver && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              style={{ background: 'rgba(242,186,48,0.08)', border: '2px dashed #f2ba30' }}>
              <p className="text-xl font-bold" style={{ color: '#f2ba30' }}>Drop images here</p>
            </div>
          )}

          {/* No folder selected prompt */}
          {!selectedFolder && data.folders.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(242,186,48,0.1)', border: '1px solid rgba(242,186,48,0.2)' }}>
                <span className="text-xl">📁</span>
              </div>
              <p className="text-sm font-semibold text-white mb-1">No folders yet</p>
              <p className="text-xs" style={{ color: '#404040' }}>
                Click <strong style={{ color: '#f2ba30' }}>+</strong> in the sidebar to create your first folder.
              </p>
            </div>
          )}

          {/* No folder selected but folders exist */}
          {!selectedFolder && data.folders.length > 0 && visibleFiles.length === 0 && (
            <p className="text-sm text-center pt-16" style={{ color: '#404040' }}>No images uploaded yet.</p>
          )}

          {/* Upload prompt when folder selected but empty */}
          {selectedFolder && visibleFiles.length === 0 && !uploading && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-colors"
              style={{ borderColor: '#2a2a2a', color: '#404040' }}>
              <span className="text-3xl mb-2">+</span>
              <span className="text-sm">Click to upload or drag &amp; drop images</span>
            </button>
          )}

          {/* Image grid */}
          {visibleFiles.length > 0 && (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
              {visibleFiles.map(file => {
                const key = `${file.folder}/${file.name}`
                const isDeleting = deleting === key
                const isCopied = copiedUrl === file.url
                return (
                  <div key={key} className="rounded-xl overflow-hidden flex flex-col"
                    style={{ background: '#111', border: '1px solid #1e1e1e' }}>

                    {/* Thumbnail */}
                    <div className="relative bg-[#0a0a0f]" style={{ aspectRatio: '1', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Meta + actions */}
                    <div className="p-2 flex flex-col gap-1.5">
                      <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.5)' }}
                        title={file.name}>{file.name}</p>
                      {!selectedFolder && (
                        <p className="text-[10px]" style={{ color: '#333' }}>{file.folder}/</p>
                      )}
                      <p className="text-[10px]" style={{ color: '#333' }}>{formatSize(file.size)}</p>

                      <button
                        onClick={() => copyUrl(file.url)}
                        className="w-full py-1.5 rounded text-[11px] font-semibold transition-colors"
                        style={isCopied
                          ? { background: 'rgba(30,210,90,0.15)', color: '#1ed25a' }
                          : { background: 'rgba(242,186,48,0.12)', color: '#f2ba30' }}>
                        {isCopied ? 'Copied ✓' : 'Copy URL'}
                      </button>

                      <button
                        onClick={() => handleDelete(file)}
                        disabled={isDeleting}
                        className="w-full py-1 rounded text-[11px] transition-colors disabled:opacity-40"
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                        {isDeleting ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
