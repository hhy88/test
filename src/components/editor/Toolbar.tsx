import { useState, useEffect, useCallback, useRef } from 'react'
import { toggleMark, setBlockType } from 'prosemirror-commands'
import { wrapInList } from 'prosemirror-schema-list'
import { markEditSchema } from '@/prosemirror/schema'
import { editorViewRef } from '@/components/editor/EditorCanvas'
import useEditorStore from '@/stores/editorStore'
import {
  Bold,
  Italic,
  Strikethrough,
  Link,
  ImageIcon,
  Heading,
  List,
} from 'lucide-react'

const schema = markEditSchema

interface ToolbarPosition {
  top: number
  left: number
}

export default function Toolbar() {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState<ToolbarPosition>({ top: 0, left: 0 })
  const [headingLevel, setHeadingLevel] = useState(0)
  const [listOpen, setListOpen] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const editMode = useEditorStore((s) => s.editMode)

  const checkSelection = useCallback(() => {
    const view = editorViewRef.current
    if (!view || editMode === 'source') {
      setVisible(false)
      return
    }

    const { from, to, empty } = view.state.selection
    if (empty) {
      setVisible(false)
      setListOpen(false)
      return
    }

    try {
      const startCoords = view.coordsAtPos(from)
      const endCoords = view.coordsAtPos(to)
      const editorRect = view.dom.parentElement?.getBoundingClientRect()

      const top = startCoords.top - (editorRect?.top ?? 0) + window.scrollY - 48
      const left = (startCoords.left + endCoords.left) / 2 - (editorRect?.left ?? 0) + window.scrollX

      setPosition({ top, left })
      setVisible(true)
    } catch {
      setVisible(false)
    }
  }, [editMode])

  useEffect(() => {
    document.addEventListener('selectionchange', checkSelection)
    document.addEventListener('mouseup', checkSelection)
    document.addEventListener('keyup', checkSelection)
    return () => {
      document.removeEventListener('selectionchange', checkSelection)
      document.removeEventListener('mouseup', checkSelection)
      document.removeEventListener('keyup', checkSelection)
    }
  }, [checkSelection])

  useEffect(() => {
    if (editMode === 'source') {
      setVisible(false)
    }
  }, [editMode])

  const runCommand = useCallback((command: (view: typeof editorViewRef.current) => boolean) => {
    const view = editorViewRef.current
    if (!view) return
    command(view)
    view.focus()
  }, [])

  const handleBold = useCallback(() => {
    runCommand((view) => toggleMark(schema.marks.bold)(view.state, view.dispatch))
  }, [runCommand])

  const handleItalic = useCallback(() => {
    runCommand((view) => toggleMark(schema.marks.italic)(view.state, view.dispatch))
  }, [runCommand])

  const handleStrikethrough = useCallback(() => {
    runCommand((view) => toggleMark(schema.marks.strikethrough)(view.state, view.dispatch))
  }, [runCommand])

  const handleLink = useCallback(() => {
    const url = window.prompt('输入链接地址:', 'https://')
    if (!url) return
    runCommand((view) =>
      toggleMark(schema.marks.link, { href: url })(view.state, view.dispatch)
    )
  }, [runCommand])

  const handleImage = useCallback(() => {
    const url = window.prompt('输入图片地址:', '')
    if (!url) return
    const view = editorViewRef.current
    if (!view) return
    const imageNode = view.state.schema.nodes.image.create({ src: url })
    const tr = view.state.tr.replaceSelectionWith(imageNode)
    view.dispatch(tr)
    view.focus()
  }, [])

  const handleHeading = useCallback(() => {
    const view = editorViewRef.current
    if (!view) return
    const nextLevel = headingLevel >= 6 ? 0 : headingLevel + 1
    setHeadingLevel(nextLevel)
    if (nextLevel === 0) {
      setBlockType(schema.nodes.paragraph)(view.state, view.dispatch)
    } else {
      setBlockType(schema.nodes.heading, { level: nextLevel })(view.state, view.dispatch)
    }
    view.focus()
  }, [headingLevel, runCommand])

  const handleBulletList = useCallback(() => {
    runCommand((view) => wrapInList(schema.nodes.bullet_list)(view.state, view.dispatch))
    setListOpen(false)
  }, [runCommand])

  const handleOrderedList = useCallback(() => {
    runCommand((view) => wrapInList(schema.nodes.ordered_list)(view.state, view.dispatch))
    setListOpen(false)
  }, [runCommand])

  if (!visible) return null

  return (
    <div
      ref={toolbarRef}
      className="absolute z-50 flex items-center gap-0.5 px-2 py-1 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateX(-50%)',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        onClick={handleBold}
        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        title="粗体"
      >
        <Bold size={14} />
      </button>
      <button
        onClick={handleItalic}
        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        title="斜体"
      >
        <Italic size={14} />
      </button>
      <button
        onClick={handleStrikethrough}
        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        title="删除线"
      >
        <Strikethrough size={14} />
      </button>
      <button
        onClick={handleLink}
        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        title="链接"
      >
        <Link size={14} />
      </button>
      <button
        onClick={handleImage}
        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        title="图片"
      >
        <ImageIcon size={14} />
      </button>
      <button
        onClick={handleHeading}
        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        title={headingLevel > 0 ? `标题 ${headingLevel}` : '标题'}
      >
        <Heading size={14} />
        {headingLevel > 0 && (
          <span className="text-[10px] ml-0.5">{headingLevel}</span>
        )}
      </button>
      <div className="relative">
        <button
          onClick={() => setListOpen(!listOpen)}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
          title="列表"
        >
          <List size={14} />
        </button>
        {listOpen && (
          <div className="absolute top-full left-0 mt-1 py-1 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 min-w-[100px]">
            <button
              onClick={handleBulletList}
              className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              无序列表
            </button>
            <button
              onClick={handleOrderedList}
              className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              有序列表
            </button>
          </div>
        )}
      </div>
      <div
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700"
      />
    </div>
  )
}
