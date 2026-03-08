import { useEffect, useState } from 'react'
import api from '../api/client'
import type { Announcement, Customer } from '../types'

export default function UnreadAnnouncements() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerId, setCustomerId] = useState<number>(1)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load customer list once
  useEffect(() => {
    api.get<Customer[]>('/customers')
      .then((res) => {
        setCustomers(res.data)
        if (res.data.length > 0) setCustomerId(res.data[0].id)
      })
      .catch(() => setError('Failed to load customers.'))
  }, [])

  // Reload unread announcements whenever the selected customer changes
  useEffect(() => {
    setLoading(true)
    setError(null)
    api.get<Announcement[]>('/announcements/unread', {
      params: { customer_id: customerId },
    })
      .then((res) => setAnnouncements(res.data))
      .catch(() => setError('Failed to load announcements.'))
      .finally(() => setLoading(false))
  }, [customerId])

  const selectedCustomer = customers.find((c) => c.id === customerId)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Unread Announcements</h1>

      {/* Customer selector */}
      <div className="mb-6">
        <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
          Viewing as customer
        </label>
        <select
          id="customer"
          value={customerId}
          onChange={(e) => setCustomerId(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              #{c.id} – {c.name} ({c.email})
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      {loading && <p className="text-gray-500 text-sm">Loading…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Announcements list */}
      {!loading && !error && (
        <>
          {announcements.length === 0 ? (
            <p className="text-gray-500 text-sm">
              {selectedCustomer?.name ?? 'This customer'} has no unread announcements.
            </p>
          ) : (
            <ul className="space-y-4">
              {announcements.map((a) => (
                <li
                  key={a.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                        #{a.id}
                      </span>
                      <h2 className="text-base font-semibold text-gray-800 mt-1">{a.title}</h2>
                      <p className="text-sm text-gray-600 mt-1">{a.body}</p>
                    </div>
                    <span className="shrink-0 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
