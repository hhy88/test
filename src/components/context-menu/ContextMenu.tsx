import { useEffect, useRef, useState } from 'react'
import {
  ClipboardPaste, Scissors, Copy, CheckSquare, Table, Code2, Sigma, BarChart3,
  ChevronUp, ChevronDown, Link, Outdent, Indent, ArrowUpFromLine, ArrowDownFromLine,
  ArrowLeftFromLine, ArrowRightFromLine, Trash2, AlignLeft, AlignCenter, AlignRight,
  ChevronRight, Download, ZoomIn, FilePlus, FolderPlus, Pencil, FolderOpen,
  ChevronsDownUp, ChevronsUpDown, X, XCircle, PanelLeftClose, PanelRightClose,
  XSquare, FileText,
} from 'lucide-react'
import useUIStore from '@/stores/uiStore'

type IC = React.ComponentType<{ size?: string | number; className?: string }>

type MI =
  | { type: 'divider' }
  | { type: 'item'; label: string; icon?: IC; shortcut?: string; action?: string; disabled?: boolean }
  | { type: 'submenu'; label: string; icon?: IC; children: MI[] }

const I = (label: string, icon?: IC, shortcut?: string, action?: string, disabled?: boolean): MI =>
  ({ type: 'item', label, icon, shortcut, action, disabled })
const S = (label: string, children: MI[], icon?: IC): MI =>
  ({ type: 'submenu', label, icon, children })
const D: MI = { type: 'divider' }

const MENUS: Record<string, MI[]> = {
  editor: [
    I('粘贴', ClipboardPaste, 'Ctrl+V', 'paste'),
    I('纯文本粘贴', FileText, 'Ctrl+Shift+V', 'pastePlainText'),
    D,
    I('全选', CheckSquare, 'Ctrl+A', 'selectAll'),
    D,
    I('插入表格', Table, '', 'insertTable'),
    I('插入代码块', Code2, 'Ctrl+Shift+K', 'insertCodeBlock'),
    I('插入公式', Sigma, 'Ctrl+Shift+M', 'insertFormula'),
    I('插入图表', BarChart3, '', 'insertChart'),
  ],
  heading: [
    I('剪切', Scissors, 'Ctrl+X', 'cut'),
    I('复制', Copy, 'Ctrl+C', 'copy'),
    I('粘贴', ClipboardPaste, 'Ctrl+V', 'paste'),
    D,
    I('提升标题', ChevronUp, 'Shift+Tab', 'promoteHeading'),
    I('降低标题', ChevronDown, 'Tab', 'demoteHeading'),
    D,
    I('复制标题链接', Link, '', 'copyHeadingLink'),
  ],
  list: [
    I('剪切', Scissors, 'Ctrl+X', 'cut'),
    I('复制', Copy, 'Ctrl+C', 'copy'),
    I('粘贴', ClipboardPaste, 'Ctrl+V', 'paste'),
    D,
    I('升级列表', Outdent, '', 'promoteList'),
    I('降级列表', Indent, '', 'demoteList'),
  ],
  table: [
    I('剪切', Scissors, 'Ctrl+X', 'cut'),
    I('复制', Copy, 'Ctrl+C', 'copy'),
    I('粘贴', ClipboardPaste, 'Ctrl+V', 'paste'),
    D,
    I('在上方插入行', ArrowUpFromLine, '', 'insertRowAbove'),
    I('在下方插入行', ArrowDownFromLine, '', 'insertRowBelow'),
    I('在左侧插入列', ArrowLeftFromLine, '', 'insertColLeft'),
    I('在右侧插入列', ArrowRightFromLine, '', 'insertColRight'),
    D,
    I('删除行', Trash2, '', 'deleteRow'),
    I('删除列', Trash2, '', 'deleteCol'),
    D,
    S('对齐', [
      I('左对齐', AlignLeft, '', 'alignLeft'),
      I('居中', AlignCenter, '', 'alignCenter'),
      I('右对齐', AlignRight, '', 'alignRight'),
    ], AlignLeft),
  ],
  codeblock: [
    I('剪切', Scissors, 'Ctrl+X', 'cut'),
    I('复制', Copy, 'Ctrl+C', 'copy'),
    I('粘贴', ClipboardPaste, 'Ctrl+V', 'paste'),
    D,
    I('复制代码', Copy, '', 'copyCode'),
    D,
    I('切换语言', Code2, '', 'switchLanguage'),
  ],
  image: [
    I('剪切', Scissors, 'Ctrl+X', 'cut'),
    I('复制', Copy, 'Ctrl+C', 'copy'),
    D,
    I('另存图片', Download, '', 'saveImageAs'),
    I('复制图片地址', Link, '', 'copyImageUrl'),
    D,
    S('缩放', [
      I('25%', undefined, '', 'zoom25'),
      I('50%', undefined, '', 'zoom50'),
      I('100%', undefined, '', 'zoom100'),
      I('150%', undefined, '', 'zoom150'),
      I('200%', undefined, '', 'zoom200'),
    ], ZoomIn),
  ],
  formula: [
    I('剪切', Scissors, 'Ctrl+X', 'cut'),
    I('复制', Copy, 'Ctrl+C', 'copy'),
    D,
    I('复制LaTeX源码', Copy, '', 'copyLatex'),
  ],
  chart: [
    I('剪切', Scissors, 'Ctrl+X', 'cut'),
    I('复制', Copy, 'Ctrl+C', 'copy'),
    D,
    I('导出PNG', Download, '', 'exportPNG'),
    I('导出SVG', Download, '', 'exportSVG'),
  ],
  filetree: [
    I('新建文件', FilePlus, '', 'newFile'),
    I('新建文件夹', FolderPlus, '', 'newFolder'),
    D,
    I('重命名', Pencil, '', 'rename'),
    I('删除', Trash2, '', 'delete'),
    D,
    I('复制路径', Copy, '', 'copyPath'),
    I('在资源管理器中打开', FolderOpen, '', 'openInExplorer'),
  ],
  outline: [
    I('折叠全部', ChevronsDownUp, '', 'collapseAll'),
    I('展开全部', ChevronsUpDown, '', 'expandAll'),
    D,
    I('复制锚点链接', Link, '', 'copyAnchorLink'),
  ],
  tab: [
    I('关闭', X, '', 'closeTab'),
    I('关闭其他', XCircle, '', 'closeOtherTabs'),
    I('关闭左侧', PanelLeftClose, '', 'closeLeftTabs'),
    I('关闭右侧', PanelRightClose, '', 'closeRightTabs'),
    D,
    I('全部关闭', XSquare, '', 'closeAllTabs'),
  ],
}

export default function ContextMenu() {
  const contextMenu = useUIStore((s) => s.contextMenu)
  const hideContextMenu = useUIStore((s) => s.hideContextMenu)
  const [hoveredSub, setHoveredSub] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) hideContextMenu()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hideContextMenu()
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [hideContextMenu])

  if (!contextMenu.visible || !contextMenu.type) return null

  const items = MENUS[contextMenu.type]
  if (!items) return null

  const renderItem = (item: MI, idx: number, depth = 0): React.ReactNode => {
    if (item.type === 'divider') {
      return <div key={idx} className="my-1 border-t border-[var(--context-menu-border,#ddd)]" />
    }
    if (item.type === 'submenu') {
      const key = `${depth}-${item.label}`
      return (
        <div key={idx} className="relative"
          onMouseEnter={() => setHoveredSub(key)}
          onMouseLeave={() => setHoveredSub(null)}>
          <div className="px-3 py-1.5 text-sm flex items-center justify-between cursor-pointer hover:bg-[var(--context-menu-hover-bg,#f0f0f0)] text-[var(--context-menu-text,#333)]">
            <span className="flex items-center gap-2">
              {item.icon ? <item.icon size={14} /> : <span className="w-4" />}
              {item.label}
            </span>
            <ChevronRight size={14} className="text-gray-400" />
          </div>
          {hoveredSub === key && (
            <div className="absolute left-full top-0 min-w-44 bg-[var(--context-menu-bg,#fff)] border border-[var(--context-menu-border,#ddd)] shadow-lg rounded py-1 z-50">
              {item.children.map((si, j) => renderItem(si, j, depth + 1))}
            </div>
          )}
        </div>
      )
    }
    return (
      <div key={idx}
        className={`px-3 py-1.5 text-sm flex items-center justify-between cursor-pointer hover:bg-[var(--context-menu-hover-bg,#f0f0f0)] text-[var(--context-menu-text,#333)] ${item.disabled ? 'opacity-40 pointer-events-none' : ''}`}
        onClick={() => hideContextMenu()}>
        <span className="flex items-center gap-2">
          {item.icon ? <item.icon size={14} /> : <span className="w-4" />}
          {item.label}
        </span>
        {item.shortcut && <span className="ml-8 text-xs text-gray-400">{item.shortcut}</span>}
      </div>
    )
  }

  return (
    <div ref={ref}
      className="fixed z-50 min-w-48 bg-[var(--context-menu-bg,#fff)] border border-[var(--context-menu-border,#ddd)] shadow-lg rounded py-1"
      style={{ left: contextMenu.x, top: contextMenu.y }}>
      {items.map((item, idx) => renderItem(item, idx))}
    </div>
  )
}
