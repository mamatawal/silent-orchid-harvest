import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Unread Announcements' },
    { to: '/mark-read', label: 'Mark as Read' },
  ]

  return (
    <nav className="bg-indigo-700 shadow">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-8">
        <span className="text-white font-bold text-lg tracking-tight">
          AnnounceKit
        </span>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium px-3 py-1.5 rounded transition-colors ${
                pathname === link.to
                  ? 'bg-white text-indigo-700'
                  : 'text-indigo-100 hover:bg-indigo-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
