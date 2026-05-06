import { useState } from 'react'
import useEditorStore from '@/stores/editorStore'
import useFileStore from '@/stores/fileStore'

export default function StatusBar() {
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const wordCount = useEditorStore((s) => s.wordCount)
  const cursorPosition = useEditorStore((s) => s.cursorPosition)
  const editMode = useEditorStore((s) => s.editMode)
  const activeDocumentId = useEditorStore((s) => s.activeDocumentId)
  const documents = useFileStore((s) => s.documents)
  const activeDoc = documents.find((d) => d.id === activeDocumentId)

  const lineEnding = activeDoc?.lineEnding === 'crlf' ? 'CRLF' : 'LF'
  const modeLabel = editMode === 'wysiwyg' ? 'WYSIWYG' : '源码'

  return (
    <div className="fixed bottom-0 right-0 z-50 flex items-center gap-3 px-4 py-1.5 text-xs bg-black/50 dark:bg-white/10 backdrop-blur-sm text-white/80 dark:text-white/70 rounded-tl-md">
      <div
        className="relative cursor-default"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        <span>{wordCount.totalChars} 字</span>
        {tooltipVisible && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 rounded-md bg-gray-900 dark:bg-gray-800 text-white text-xs whitespace-nowrap shadow-lg border border-white/10">
            <div className="flex justify-between gap-6">
              <span className="text-white/60">总字符</span>
              <span>{wordCount.totalChars}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-white/60">中文字符</span>
              <span>{wordCount.chineseChars}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-white/60">英文字符</span>
              <span>{wordCount.englishChars}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-white/60">不含空格</span>
              <span>{wordCount.charsNoSpace}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-white/60">段落数</span>
              <span>{wordCount.paragraphs}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-white/60">图片数</span>
              <span>{wordCount.images}</span>
            </div>
          </div>
        )}
      </div>
      <span className="text-white/40">|</span>
      <span>UTF-8</span>
      <span className="text-white/40">|</span>
      <span>{lineEnding}</span>
      <span className="text-white/40">|</span>
      <span>行 {cursorPosition.line}, 列 {cursorPosition.column}</span>
      <span className="text-white/40">|</span>
      <span>{modeLabel}</span>
    </div>
  )
}
