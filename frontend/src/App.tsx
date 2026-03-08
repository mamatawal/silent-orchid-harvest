import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import UnreadAnnouncements from './pages/UnreadAnnouncements'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<UnreadAnnouncements />} />
        </Routes>
      </main>
    </div>
  )
}
