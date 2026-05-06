import { useState, useCallback } from 'react'
import {
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  GripVertical,
  FolderOpen as FolderOpenIcon,
} from 'lucide-react'
import useFileStore from '@/stores/fileStore'
import { cn } from '@/lib/utils'

interface TreeItem {
  name: string
  type: 'file' | 'folder'
  children?: TreeItem[]
  path: string
  isModified?: boolean
}

const MOCK_TREE: TreeItem[] = [
  {
    name: 'docs',
    type: 'folder',
    path: '/docs',
    children: [
      { name: 'README.md', type: 'file', path: '/docs/README.md', isModified: true },
      { name: 'CHANGELOG.md', type: 'file', path: '/docs/CHANGELOG.md' },
      { name: 'guide', type: 'folder', path: '/docs/guide', children: [
        { name: 'getting-started.md', type: 'file', path: '/docs/guide/getting-started.md' },
        { name: 'configuration.md', type: 'file', path: '/docs/guide/configuration.md', isModified: true },
      ] },
    ],
  },
  {
    name: 'src',
    type: 'folder',
    path: '/src',
    children: [
      { name: 'index.ts', type: 'file', path: '/src/index.ts' },
      { name: 'app.md', type: 'file', path: '/src/app.md' },
      { name: 'components', type: 'folder', path: '/src/components', children: [
        { name: 'Editor.md', type: 'file', path: '/src/components/Editor.md' },
        { name: 'Sidebar.md', type: 'file', path: '/src/components/Sidebar.md' },
      ] },
    ],
  },
  { name: 'package.json', type: 'file', path: '/package.json' },
  { name: 'notes.md', type: 'file', path: '/notes.md', isModified: true },
  { name: 'TODO.md', type: 'file', path: '/TODO.md' },
]

interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  target: string | null
}

function getFileIcon(name: string) {
  if (name.endsWith('.md')) return <FileText size={14} className="text-[var(--file-icon-md,#5b7fa5)]" />
  return <File size={14} className="text-[var(--file-icon-default,#888)]" />
}

interface TreeNodeProps {
  item: TreeItem
  depth: number
  selectedPath: string | null
  onSelect: (path: string) => void
  onOpen: (item: TreeItem) => void
  onContextMenu: (e: React.MouseEvent, path: string) => void
}

function TreeNode({ item, depth, selectedPath, onSelect, onOpen, onContextMenu }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 1)
  const isFolder = item.type === 'folder'
  const isSelected = selectedPath === item.path

  const handleClick = () => {
    if (isFolder) {
      setExpanded(!expanded)
    } else {
      onSelect(item.path)
    }
  }

  const handleDoubleClick = () => {
    if (!isFolder) {
      onOpen(item)
    }
  }

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 cursor-pointer py-[2px] pr-2 text-[13px] hover:bg-[var(--file-tree-hover-bg,#e8e8e8)]',
          isSelected && 'bg-[var(--file-tree-selected-bg,#d4e4f7)]',
        )}
        style={{ paddingLeft: depth * 12 + 4 }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => onContextMenu(e, item.path)}
      >
        <span className="invisible cursor-grab text-[var(--file-tree-grip,#bbb)] group-hover:visible">
          <GripVertical size={12} />
        </span>

        {isFolder ? (
          <>
            {expanded ? (
              <ChevronDown size={14} className="flex-shrink-0 text-[var(--file-tree-chevron,#666)]" />
            ) : (
              <ChevronRight size={14} className="flex-shrink-0 text-[var(--file-tree-chevron,#666)]" />
            )}
            {expanded ? (
              <FolderOpen size={14} className="flex-shrink-0 text-[var(--file-icon-folder,#e8a840)]" />
            ) : (
              <Folder size={14} className="flex-shrink-0 text-[var(--file-icon-folder,#e8a840)]" />
            )}
          </>
        ) : (
          <>
            <span className="w-[14px] flex-shrink-0" />
            {getFileIcon(item.name)}
          </>
        )}

        <span className="truncate text-[var(--file-tree-text,#333)]">{item.name}</span>

        {item.isModified && (
          <span className="ml-auto h-[6px] w-[6px] flex-shrink-0 rounded-full bg-[var(--file-tree-modified-dot,#e07050)]" />
        )}
      </div>

      {isFolder && expanded && item.children && (
        <div>
          {item.children.map((child) => (
            <TreeNode
              key={child.path}
              item={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
              onOpen={onOpen}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FileTree() {
  const documents = useFileStore((s) => s.documents)
  const openFile = useFileStore((s) => s.openFile)
  const setActiveDocument = useFileStore((s) => s.setActiveDocument)

  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [folderOpen, setFolderOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    target: null,
  })

  const handleSelect = useCallback((path: string) => {
    setSelectedPath(path)
  }, [])

  const handleOpen = useCallback(
    (item: TreeItem) => {
      if (item.type === 'file') {
        const existing = documents.find((d) => d.filePath === item.path)
        if (existing) {
          setActiveDocument(existing.id)
        } else {
          openFile({
            title: item.name,
            content: `# ${item.name.replace(/\.[^.]+$/, '')}\n\n`,
            filePath: item.path,
            encoding: 'utf-8',
            lineEnding: 'lf',
            isModified: item.isModified ?? false,
            lastSavedAt: null,
            cursorPosition: { line: 1, column: 1 },
            scrollPosition: 0,
            editMode: 'wysiwyg',
          })
        }
      }
    },
    [documents, openFile, setActiveDocument],
  )

  const handleContextMenu = useCallback((e: React.MouseEvent, path: string) => {
    e.preventDefault()
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, target: path })
  }, [])

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }))
  }, [])

  if (!folderOpen) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-4">
        <FolderOpenIcon size={40} className="text-[var(--file-tree-empty-icon,#ccc)]" />
        <p className="text-center text-xs text-[var(--file-tree-empty-text,#999)]">
          尚未打开文件夹
        </p>
        <button
          onClick={() => setFolderOpen(true)}
          className="rounded bg-[var(--file-tree-open-btn-bg,#4a90d9)] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[var(--file-tree-open-btn-hover,#3a7bc8)]"
        >
          打开文件夹
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col" onClick={handleCloseContextMenu}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-1">
        {MOCK_TREE.map((item) => (
          <TreeNode
            key={item.path}
            item={item}
            depth={0}
            selectedPath={selectedPath}
            onSelect={handleSelect}
            onOpen={handleOpen}
            onContextMenu={handleContextMenu}
          />
        ))}
      </div>

      {contextMenu.visible && (
        <div
          className="fixed z-50 min-w-[140px] rounded border border-[var(--context-menu-border,#ddd)] bg-[var(--context-menu-bg,#fff)] py-1 shadow-lg"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="w-full px-3 py-1 text-left text-xs text-[var(--context-menu-text,#333)] hover:bg-[var(--context-menu-hover-bg,#f0f0f0)]">
            新建文件
          </button>
          <button className="w-full px-3 py-1 text-left text-xs text-[var(--context-menu-text,#333)] hover:bg-[var(--context-menu-hover-bg,#f0f0f0)]">
            新建文件夹
          </button>
          <button className="w-full px-3 py-1 text-left text-xs text-[var(--context-menu-text,#333)] hover:bg-[var(--context-menu-hover-bg,#f0f0f0)]">
            重命名
          </button>
          <div className="my-1 border-t border-[var(--context-menu-border,#ddd)]" />
          <button className="w-full px-3 py-1 text-left text-xs text-[var(--context-menu-danger,#e07050)] hover:bg-[var(--context-menu-hover-bg,#f0f0f0)]">
            删除
          </button>
        </div>
      )}
    </div>
  )
}
