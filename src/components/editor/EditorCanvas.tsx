import { useRef, useEffect, useCallback } from 'react'
import { EditorView } from 'prosemirror-view'
import {
  createEditorState,
  createEditorView,
  serializeToMarkdown,
} from '@/prosemirror/setup'
import useEditorStore from '@/stores/editorStore'
import useFileStore from '@/stores/fileStore'

export const editorViewRef: { current: EditorView | null } = { current: null }

export default function EditorCanvas() {
  const editorMountRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const sourceRef = useRef<HTMLTextAreaElement>(null)
  const activeDocIdRef = useRef<string | null>(null)
  const syncFlagRef = useRef(false)

  const editMode = useEditorStore((s) => s.editMode)
  const activeDocumentId = useFileStore((s) => s.activeDocumentId)
  const updateWordCount = useEditorStore((s) => s.updateWordCount)
  const setCursorPosition = useEditorStore((s) => s.setCursorPosition)
  const documents = useFileStore((s) => s.documents)
  const updateContent = useFileStore((s) => s.updateContent)

  const activeDoc = documents.find((d) => d.id === activeDocumentId)

  activeDocIdRef.current = activeDocumentId ?? null

  const handleUpdate = useCallback((markdown: string) => {
    if (syncFlagRef.current) return
    const docId = activeDocIdRef.current
    if (docId) {
      updateContent(docId, markdown)
    }
    updateWordCount(markdown)
  }, [updateContent, updateWordCount])

  const updateCursorFromView = useCallback(() => {
    const view = viewRef.current
    if (!view) return
    const { from } = view.state.selection
    try {
      const textBefore = view.state.doc.textBetween(0, from, '\n')
      const lines = textBefore.split('\n')
      setCursorPosition({ line: lines.length, column: lines[lines.length - 1].length + 1 })
    } catch {
      setCursorPosition({ line: 1, column: 1 })
    }
  }, [setCursorPosition])

  useEffect(() => {
    if (!editorMountRef.current) return
    const content = activeDoc?.content ?? ''
    const view = createEditorView(editorMountRef.current, content, handleUpdate)
    viewRef.current = view
    editorViewRef.current = view

    const onClick = () => updateCursorFromView()
    const onKeyup = () => updateCursorFromView()
    view.dom.addEventListener('click', onClick)
    view.dom.addEventListener('keyup', onKeyup)

    return () => {
      view.dom.removeEventListener('click', onClick)
      view.dom.removeEventListener('keyup', onKeyup)
      view.destroy()
      viewRef.current = null
      editorViewRef.current = null
    }
  }, [])

  useEffect(() => {
    const view = viewRef.current
    if (!view || !activeDoc) return
    const currentMarkdown = serializeToMarkdown(view.state.doc)
    if (currentMarkdown !== activeDoc.content) {
      syncFlagRef.current = true
      const state = createEditorState(activeDoc.content)
      view.updateState(state)
      syncFlagRef.current = false
    }
  }, [activeDocumentId])

  useEffect(() => {
    if (editMode === 'source') {
      if (viewRef.current && sourceRef.current) {
        sourceRef.current.value = serializeToMarkdown(viewRef.current.state.doc)
      }
    } else {
      if (viewRef.current && sourceRef.current) {
        const markdown = sourceRef.current.value
        syncFlagRef.current = true
        const state = createEditorState(markdown)
        viewRef.current.updateState(state)
        syncFlagRef.current = false
        const docId = activeDocIdRef.current
        if (docId) {
          updateContent(docId, markdown)
        }
        updateWordCount(markdown)
      }
    }
  }, [editMode])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (editMode === 'source') return
    const items = e.clipboardData?.items
    if (!items) return
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (!file) continue
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          const view = viewRef.current
          if (!view) return
          const imageNode = view.state.schema.nodes.image.create({ src: base64 })
          const tr = view.state.tr.replaceSelectionWith(imageNode)
          view.dispatch(tr)
        }
        reader.readAsDataURL(file)
        return
      }
    }
  }, [editMode])

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (editMode === 'source') return
    const files = e.dataTransfer?.files
    if (!files || files.length === 0) return
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          const view = viewRef.current
          if (!view) return
          const imageNode = view.state.schema.nodes.image.create({ src: base64 })
          const tr = view.state.tr.replaceSelectionWith(imageNode)
          view.dispatch(tr)
        }
        reader.readAsDataURL(file)
      }
    }
  }, [editMode])

  const handleSourceChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const markdown = e.target.value
    const docId = activeDocIdRef.current
    if (docId) {
      updateContent(docId, markdown)
    }
    updateWordCount(markdown)
  }, [updateContent, updateWordCount])

  const handleSourceCursor = useCallback(() => {
    if (!sourceRef.current) return
    const ta = sourceRef.current
    const text = ta.value.substring(0, ta.selectionStart)
    const lines = text.split('\n')
    setCursorPosition({ line: lines.length, column: lines[lines.length - 1].length + 1 })
  }, [setCursorPosition])

  return (
    <div
      className="flex-1 overflow-auto"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '40px 60px 80px',
          minHeight: '100%',
        }}
      >
        <div
          ref={editorMountRef}
          style={{ display: editMode === 'wysiwyg' ? 'block' : 'none' }}
        />
        {editMode === 'source' && (
          <textarea
            ref={sourceRef}
            className="w-full min-h-[calc(100vh-160px)] resize-none bg-transparent outline-none font-mono text-sm leading-relaxed"
            style={{
              tabSize: 4,
            }}
            onChange={handleSourceChange}
            onKeyUp={handleSourceCursor}
            onClick={handleSourceCursor}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        )}
      </div>
    </div>
  )
}
