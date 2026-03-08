import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import UnreadAnnouncements from './pages/UnreadAnnouncements'
import MarkAsRead from './pages/MarkAsRead'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<UnreadAnnouncements />} />
          <Route path="/mark-read" element={<MarkAsRead />} />
        </Routes>
      </main>
    </div>
  )
}
