import { create } from 'zustand'

export interface Document {
  id: string
  title: string
  content: string
  filePath: string | null
  encoding: string
  lineEnding: 'lf' | 'crlf'
  isModified: boolean
  lastSavedAt: number | null
  cursorPosition: { line: number; column: number }
  scrollPosition: number
  editMode: 'wysiwyg' | 'source'
}

interface FileState {
  documents: Document[]
  activeDocumentId: string | null
  recentFiles: string[]

  openFile: (doc: Omit<Document, 'id'> & { id?: string }) => string
  closeFile: (id: string) => void
  saveFile: (id: string) => void
  createNewFile: (title?: string) => string
  setActiveDocument: (id: string | null) => void
  updateContent: (id: string, content: string) => void
  updateTitle: (id: string, title: string) => void
  updateFilePath: (id: string, filePath: string) => void
  updateCursorPosition: (id: string, position: { line: number; column: number }) => void
  updateScrollPosition: (id: string, position: number) => void
  updateEditMode: (id: string, mode: 'wysiwyg' | 'source') => void
  addRecentFile: (filePath: string) => void
  removeRecentFile: (filePath: string) => void
  clearRecentFiles: () => void
  getActiveDocument: () => Document | undefined
}

let nextId = 1
const generateId = () => `doc-${Date.now()}-${nextId++}`

const useFileStore = create<FileState>((set, get) => ({
  documents: [],
  activeDocumentId: null,
  recentFiles: [],

  openFile: (doc) => {
    const id = doc.id ?? generateId()
    const existing = get().documents.find((d) => d.filePath && d.filePath === doc.filePath)
    if (existing) {
      set({ activeDocumentId: existing.id })
      return existing.id
    }

    const newDoc: Document = {
      id,
      title: doc.title,
      content: doc.content,
      filePath: doc.filePath,
      encoding: doc.encoding,
      lineEnding: doc.lineEnding,
      isModified: doc.isModified,
      lastSavedAt: doc.lastSavedAt,
      cursorPosition: doc.cursorPosition,
      scrollPosition: doc.scrollPosition,
      editMode: doc.editMode,
    }

    set((state) => ({
      documents: [...state.documents, newDoc],
      activeDocumentId: id,
    }))

    if (doc.filePath) {
      get().addRecentFile(doc.filePath)
    }

    return id
  },

  closeFile: (id) => {
    set((state) => {
      const docs = state.documents.filter((d) => d.id !== id)
      let newActiveId = state.activeDocumentId

      if (state.activeDocumentId === id) {
        const idx = state.documents.findIndex((d) => d.id === id)
        if (docs.length > 0) {
          const nextIdx = Math.min(idx, docs.length - 1)
          newActiveId = docs[nextIdx].id
        } else {
          newActiveId = null
        }
      }

      return { documents: docs, activeDocumentId: newActiveId }
    })
  },

  saveFile: (id) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, isModified: false, lastSavedAt: Date.now() } : d
      ),
    }))
  },

  createNewFile: (title) => {
    const id = generateId()
    const newDoc: Document = {
      id,
      title: title ?? '未命名文档',
      content: '',
      filePath: null,
      encoding: 'utf-8',
      lineEnding: 'lf',
      isModified: false,
      lastSavedAt: null,
      cursorPosition: { line: 1, column: 1 },
      scrollPosition: 0,
      editMode: 'wysiwyg',
    }

    set((state) => ({
      documents: [...state.documents, newDoc],
      activeDocumentId: id,
    }))

    return id
  },

  setActiveDocument: (id) => set({ activeDocumentId: id }),

  updateContent: (id, content) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, content, isModified: true } : d
      ),
    }))
  },

  updateTitle: (id, title) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, title } : d
      ),
    }))
  },

  updateFilePath: (id, filePath) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, filePath } : d
      ),
    }))
    get().addRecentFile(filePath)
  },

  updateCursorPosition: (id, position) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, cursorPosition: position } : d
      ),
    }))
  },

  updateScrollPosition: (id, position) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, scrollPosition: position } : d
      ),
    }))
  },

  updateEditMode: (id, mode) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, editMode: mode } : d
      ),
    }))
  },

  addRecentFile: (filePath) => {
    set((state) => {
      const filtered = state.recentFiles.filter((p) => p !== filePath)
      return { recentFiles: [filePath, ...filtered].slice(0, 20) }
    })
  },

  removeRecentFile: (filePath) => {
    set((state) => ({
      recentFiles: state.recentFiles.filter((p) => p !== filePath),
    }))
  },

  clearRecentFiles: () => set({ recentFiles: [] }),

  getActiveDocument: () => {
    const state = get()
    return state.documents.find((d) => d.id === state.activeDocumentId)
  },
}))

export default useFileStore
