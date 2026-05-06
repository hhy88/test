import { useState, useMemo, useCallback, useEffect } from 'react'
import { ChevronRight, ChevronDown, Hash } from 'lucide-react'
import useFileStore from '@/stores/fileStore'
import useEditorStore from '@/stores/editorStore'
import { cn } from '@/lib/utils'

interface Heading {
  level: number
  text: string
  line: number
  id: string
}

interface OutlineContextMenu {
  visible: boolean
  x: number
  y: number
}

function extractHeadings(content: string): Heading[] {
  if (!content) return []
  const lines = content.split('\n')
  const headings: Heading[] = []

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, '-')
        .replace(/^-+|-+$/g, '')
      headings.push({ level, text, line: i + 1, id })
    }
  }

  return headings
}

function computeActiveHeading(headings: Heading[], scrollPosition: number): number {
  if (headings.length === 0) return -1

  const line = Math.floor(scrollPosition / 20) + 1

  let activeIdx = 0
  for (let i = headings.length - 1; i >= 0; i--) {
    if (headings[i].line <= line) {
      activeIdx = i
      break
    }
  }

  return activeIdx
}

interface HeadingNodeProps {
  heading: Heading
  isActive: boolean
  collapsed: boolean
  onToggleCollapse: () => void
  onClick: (heading: Heading) => void
  onContextMenu: (e: React.MouseEvent) => void
  childCount: number
}

function HeadingNode({
  heading,
  isActive,
  collapsed,
  onToggleCollapse,
  onClick,
  onContextMenu,
  childCount,
}: HeadingNodeProps) {
  const hasChildren = childCount > 0
  const indent = (heading.level - 1) * 12

  return (
    <div
      className={cn(
        'flex cursor-pointer items-center gap-1 py-[2px] pr-2 text-[13px] hover:bg-[var(--outline-hover-bg,#e8e8e8)]',
        isActive && 'bg-[var(--outline-active-bg,#d4e4f7)] text-[var(--outline-active-text,#1a5276)] font-medium',
      )}
      style={{ paddingLeft: indent + 4 }}
      onClick={() => onClick(heading)}
      onContextMenu={onContextMenu}
    >
      {hasChildren ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleCollapse()
          }}
          className="flex-shrink-0 p-0"
        >
          {collapsed ? (
            <ChevronRight size={12} className="text-[var(--outline-chevron,#666)]" />
          ) : (
            <ChevronDown size={12} className="text-[var(--outline-chevron,#666)]" />
          )}
        </button>
      ) : (
        <span className="w-[12px] flex-shrink-0" />
      )}
      <Hash
        size={11}
        className={cn(
          'flex-shrink-0',
          isActive ? 'text-[var(--outline-active-hash,#4a90d9)]' : 'text-[var(--outline-hash,#bbb)]',
        )}
      />
      <span className="truncate text-[var(--outline-text,#333)]">{heading.text}</span>
    </div>
  )
}

export default function Outline() {
  const activeDocumentId = useFileStore((s) => s.activeDocumentId)
  const documents = useFileStore((s) => s.documents)
  const scrollPosition = useEditorStore((s) => s.scrollPosition)

  const activeDoc = documents.find((d) => d.id === activeDocumentId)
  const content = activeDoc?.content ?? ''

  const headings = useMemo(() => extractHeadings(content), [content])
  const activeHeadingIdx = useMemo(
    () => computeActiveHeading(headings, scrollPosition),
    [headings, scrollPosition],
  )

  const [collapsedSet, setCollapsedSet] = useState<Set<string>>(() => new Set())
  const [contextMenu, setContextMenu] = useState<OutlineContextMenu>({
    visible: false,
    x: 0,
    y: 0,
  })
  const [contextHeading, setContextHeading] = useState<Heading | null>(null)

  useEffect(() => {
    setCollapsedSet(new Set())
  }, [activeDocumentId])

  const toggleCollapse = useCallback((id: string) => {
    setCollapsedSet((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const collapseAll = useCallback(() => {
    setCollapsedSet(new Set(headings.map((h) => h.id)))
  }, [headings])

  const expandAll = useCallback(() => {
    setCollapsedSet(new Set())
  }, [])

  const handleHeadingClick = useCallback((heading: Heading) => {
    window.dispatchEvent(
      new CustomEvent('outline:scroll-to', {
        detail: { line: heading.line, id: heading.id },
      }),
    )
  }, [])

  const handleContextMenu = useCallback((e: React.MouseEvent, heading: Heading) => {
    e.preventDefault()
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY })
    setContextHeading(heading)
  }, [])

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }))
    setContextHeading(null)
  }, [])

  const handleCopyAnchor = useCallback(() => {
    if (contextHeading) {
      navigator.clipboard.writeText(`#${contextHeading.id}`).catch(() => {})
    }
    handleCloseContextMenu()
  }, [contextHeading, handleCloseContextMenu])

  const getChildCount = useCallback(
    (index: number): number => {
      const level = headings[index].level
      let count = 0
      for (let i = index + 1; i < headings.length; i++) {
        if (headings[i].level <= level) break
        if (headings[i].level === level + 1) count++
      }
      return count
    },
    [headings],
  )

  const isVisible = useCallback(
    (index: number): boolean => {
      for (let i = index - 1; i >= 0; i--) {
        if (headings[i].level < headings[index].level) {
          if (collapsedSet.has(headings[i].id)) return false
          return isVisible(i)
        }
      }
      return true
    },
    [headings, collapsedSet],
  )

  if (headings.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4">
        <Hash size={32} className="text-[var(--outline-empty-icon,#ccc)]" />
        <p className="text-center text-xs text-[var(--outline-empty-text,#999)]">
          {content ? '当前文档没有标题' : '请先打开一个文档'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col" onClick={handleCloseContextMenu}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-1">
        {headings.map(
          (heading, index) =>
            isVisible(index) && (
              <HeadingNode
                key={`${heading.id}-${heading.line}`}
                heading={heading}
                isActive={index === activeHeadingIdx}
                collapsed={collapsedSet.has(heading.id)}
                onToggleCollapse={() => toggleCollapse(heading.id)}
                onClick={handleHeadingClick}
                onContextMenu={(e) => handleContextMenu(e, heading)}
                childCount={getChildCount(index)}
              />
            ),
        )}
      </div>

      {contextMenu.visible && (
        <div
          className="fixed z-50 min-w-[140px] rounded border border-[var(--context-menu-border,#ddd)] bg-[var(--context-menu-bg,#fff)] py-1 shadow-lg"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={collapseAll}
            className="w-full px-3 py-1 text-left text-xs text-[var(--context-menu-text,#333)] hover:bg-[var(--context-menu-hover-bg,#f0f0f0)]"
          >
            折叠全部
          </button>
          <button
            onClick={expandAll}
            className="w-full px-3 py-1 text-left text-xs text-[var(--context-menu-text,#333)] hover:bg-[var(--context-menu-hover-bg,#f0f0f0)]"
          >
            展开全部
          </button>
          <div className="my-1 border-t border-[var(--context-menu-border,#ddd)]" />
          <button
            onClick={handleCopyAnchor}
            className="w-full px-3 py-1 text-left text-xs text-[var(--context-menu-text,#333)] hover:bg-[var(--context-menu-hover-bg,#f0f0f0)]"
          >
            复制锚点链接
          </button>
        </div>
      )}
    </div>
  )
}
