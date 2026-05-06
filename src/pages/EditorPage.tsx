import MenuBar from '@/components/editor/MenuBar'
import EditorCanvas from '@/components/editor/EditorCanvas'
import StatusBar from '@/components/editor/StatusBar'
import Toolbar from '@/components/editor/Toolbar'
import Sidebar from '@/components/sidebar/Sidebar'

export default function EditorPage() {
  return (
    <div className="h-screen flex flex-col">
      <MenuBar />
      <div className="flex flex-1 pt-8 overflow-hidden">
        <Sidebar />
        <div className="flex-1 relative overflow-hidden">
          <EditorCanvas />
          <Toolbar />
        </div>
      </div>
      <StatusBar />
    </div>
  )
}
