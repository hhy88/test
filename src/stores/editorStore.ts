import { create } from 'zustand'

interface CursorPosition {
  line: number
  column: number
}

interface WordCount {
  totalChars: number
  chineseChars: number
  englishChars: number
  charsNoSpace: number
  paragraphs: number
  images: number
}

interface EditorState {
  activeDocumentId: string | null
  editMode: 'wysiwyg' | 'source'
  cursorPosition: CursorPosition
  scrollPosition: number
  isModified: boolean
  wordCount: WordCount

  setActiveDocumentId: (id: string | null) => void
  setEditMode: (mode: 'wysiwyg' | 'source') => void
  setCursorPosition: (position: CursorPosition) => void
  setScrollPosition: (position: number) => void
  setIsModified: (modified: boolean) => void
  setWordCount: (count: Partial<WordCount>) => void
  updateWordCount: (content: string) => void
  resetEditor: () => void
}

const initialWordCount: WordCount = {
  totalChars: 0,
  chineseChars: 0,
  englishChars: 0,
  charsNoSpace: 0,
  paragraphs: 0,
  images: 0,
}

const useEditorStore = create<EditorState>((set) => ({
  activeDocumentId: null,
  editMode: 'wysiwyg',
  cursorPosition: { line: 1, column: 1 },
  scrollPosition: 0,
  isModified: false,
  wordCount: { ...initialWordCount },

  setActiveDocumentId: (id) => set({ activeDocumentId: id }),

  setEditMode: (mode) => set({ editMode: mode }),

  setCursorPosition: (position) => set({ cursorPosition: position }),

  setScrollPosition: (position) => set({ scrollPosition: position }),

  setIsModified: (modified) => set({ isModified: modified }),

  setWordCount: (count) =>
    set((state) => ({
      wordCount: { ...state.wordCount, ...count },
    })),

  updateWordCount: (content) => {
    const chineseCharMatch = content.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g)
    const chineseChars = chineseCharMatch ? chineseCharMatch.length : 0

    const englishCharMatch = content.match(/[a-zA-Z]/g)
    const englishChars = englishCharMatch ? englishCharMatch.length : 0

    const totalChars = content.length
    const charsNoSpace = content.replace(/\s/g, '').length

    const paragraphMatch = content.match(/[^\n]+/g)
    const paragraphs = paragraphMatch ? paragraphMatch.length : 0

    const imageMatch = content.match(/!\[.*?\]\(.*?\)/g)
    const images = imageMatch ? imageMatch.length : 0

    set({
      wordCount: {
        totalChars,
        chineseChars,
        englishChars,
        charsNoSpace,
        paragraphs,
        images,
      },
    })
  },

  resetEditor: () =>
    set({
      activeDocumentId: null,
      editMode: 'wysiwyg',
      cursorPosition: { line: 1, column: 1 },
      scrollPosition: 0,
      isModified: false,
      wordCount: { ...initialWordCount },
    }),
}))

export default useEditorStore
