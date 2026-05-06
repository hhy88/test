import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Search,
  CaseSensitive,
  WholeWord,
  Regex,
  ChevronUp,
  ChevronDown,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import useUIStore from '@/stores/uiStore'

interface SearchOptions {
  caseSensitive: boolean
  wholeWord: boolean
  regex: boolean
}

export default function SearchModal() {
  const { searchVisible, setSearchVisible } = useUIStore()
  const [query, setQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [showReplace, setShowReplace] = useState(false)
  const [options, setOptions] = useState<SearchOptions>({
    caseSensitive: false,
    wholeWord: false,
    regex: false,
  })
  const [currentMatch, setCurrentMatch] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchVisible) {
      searchInputRef.current?.focus()
    }
  }, [searchVisible])

  useEffect(() => {
    if (query) {
      setTotalMatches(Math.floor(Math.random() * 20) + 1)
      setCurrentMatch(1)
    } else {
      setTotalMatches(0)
      setCurrentMatch(0)
    }
  }, [query, options])

  const handleClose = useCallback(() => {
    setSearchVisible(false)
    setQuery('')
    setReplaceQuery('')
    setShowReplace(false)
    setCurrentMatch(0)
    setTotalMatches(0)
  }, [setSearchVisible])

  const handleNext = useCallback(() => {
    if (totalMatches > 0) {
      setCurrentMatch((prev) => (prev % totalMatches) + 1)
    }
  }, [totalMatches])

  const handlePrev = useCallback(() => {
    if (totalMatches > 0) {
      setCurrentMatch((prev) => (prev === 1 ? totalMatches : prev - 1))
    }
  }, [totalMatches])

  const handleReplaceNext = useCallback(() => {
    handleNext()
  }, [handleNext])

  const handleReplaceAll = useCallback(() => {
    setTotalMatches(0)
    setCurrentMatch(0)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          handlePrev()
        } else {
          handleNext()
        }
      } else if (e.key === 'Escape') {
        handleClose()
      }
    },
    [handleNext, handlePrev, handleClose]
  )

  const toggleOption = (key: keyof SearchOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (!searchVisible) return null

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[480px]"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-1 p-2">
          <button
            onClick={() => setShowReplace(!showReplace)}
            className={cn(
              'p-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs',
              showReplace && 'text-blue-500'
            )}
            title="切换替换"
          >
            <Search size={14} />
          </button>

          <div className="flex-1 flex items-center gap-1">
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索"
                className={cn(
                  'w-full px-2 py-1 text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded outline-none',
                  'focus:border-blue-500 dark:focus:border-blue-400',
                  totalMatches === 0 && query && 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                )}
              />
            </div>

            <button
              onClick={() => toggleOption('caseSensitive')}
              className={cn(
                'p-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                options.caseSensitive && 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
              )}
              title="区分大小写"
            >
              <CaseSensitive size={14} />
            </button>

            <button
              onClick={() => toggleOption('wholeWord')}
              className={cn(
                'p-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                options.wholeWord && 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
              )}
              title="全字匹配"
            >
              <WholeWord size={14} />
            </button>

            <button
              onClick={() => toggleOption('regex')}
              className={cn(
                'p-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                options.regex && 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
              )}
              title="正则表达式"
            >
              <Regex size={14} />
            </button>

            <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] text-center">
              {query ? `${currentMatch}/${totalMatches}` : ''}
            </span>

            <button
              onClick={handlePrev}
              className="p-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="上一个 (Shift+Enter)"
            >
              <ChevronUp size={14} />
            </button>

            <button
              onClick={handleNext}
              className="p-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="下一个 (Enter)"
            >
              <ChevronDown size={14} />
            </button>

            <button
              onClick={handleClose}
              className="p-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="关闭 (Escape)"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {showReplace && (
          <div className="flex items-center gap-1 px-2 pb-2">
            <div className="w-5" />
            <div className="flex-1 flex items-center gap-1">
              <input
                type="text"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                placeholder="替换"
                className="flex-1 px-2 py-1 text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded outline-none focus:border-blue-500 dark:focus:border-blue-400"
              />
              <button
                onClick={handleReplaceNext}
                disabled={totalMatches === 0}
                className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
                title="替换下一个"
              >
                替换
              </button>
              <button
                onClick={handleReplaceAll}
                disabled={totalMatches === 0}
                className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
                title="替换全部"
              >
                全部替换
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
