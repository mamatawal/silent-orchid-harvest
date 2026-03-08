import { useEffect, useState, type FormEvent } from 'react'
import api from '../api/client'
import type { Announcement, Customer, MarkReadResponse } from '../types'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function MarkAsRead() {
  const [announcementId, setAnnouncementId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<MarkReadResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    api.get<Announcement[]>('/announcements').then((r) => setAnnouncements(r.data)).catch(() => {})
    api.get<Customer[]>('/customers').then((r) => setCustomers(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setResult(null)
    setErrorMessage(null)

    try {
      const res = await api.post<MarkReadResponse>('/announcements/mark-read', {
        announcement_id: Number(announcementId),
        customer_id: Number(customerId),
      })
      setResult(res.data)
      setStatus('success')
      setAnnouncementId('')
      setCustomerId('')
    } catch (err: unknown) {
      setStatus('error')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any
      if (axiosErr?.response?.data?.errors) {
        const msgs: string[] = []
        const errs = axiosErr.response.data.errors as Record<string, string[]>
        Object.values(errs).forEach((v) => msgs.push(...v))
        setErrorMessage(msgs.join(' '))
      } else {
        setErrorMessage(
          axiosErr?.response?.data?.message ?? 'Something went wrong. Please try again.',
        )
      }
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mark Announcement as Read</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5"
      >
        {/* Announcement ID */}
        <div>
          <label
            htmlFor="announcement_id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Announcement ID
          </label>
          <input
            id="announcement_id"
            type="number"
            min="1"
            required
            value={announcementId}
            onChange={(e) => setAnnouncementId(e.target.value)}
            placeholder="e.g. 1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Customer ID */}
        <div>
          <label
            htmlFor="customer_id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Customer ID
          </label>
          <input
            id="customer_id"
            type="number"
            min="1"
            required
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="e.g. 1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors"
        >
          {status === 'loading' ? 'Submitting…' : 'Submit'}
        </button>

        {/* Success */}
        {status === 'success' && result && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800">
            <p className="font-semibold">Success!</p>
            <p className="mt-1">
              <span className="font-medium">{result.customer.name}</span> has been recorded as
              having read{' '}
              <span className="font-medium">&ldquo;{result.announcement.title}&rdquo;</span>.
            </p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && errorMessage && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            <p className="font-semibold">Error</p>
            <p className="mt-1">{errorMessage}</p>
          </div>
        )}
      </form>

      {/* Helper info */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-5">
        <h2 className="text-sm font-semibold text-gray-700">Reference</h2>

        {/* Announcements */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Announcements</p>
          <table className="w-full text-xs text-gray-600 border-collapse">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-200">
                <th className="pb-1.5 pr-4">ID</th>
                <th className="pb-1.5">Title</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((a, i) => (
                <tr key={a.id} className={i < announcements.length - 1 ? 'border-b border-gray-100' : ''}>
                  <td className="py-1.5 pr-4 font-mono">{a.id}</td>
                  <td className="py-1.5">{a.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Customers */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Customers</p>
          <table className="w-full text-xs text-gray-600 border-collapse">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-200">
                <th className="pb-1.5 pr-4">ID</th>
                <th className="pb-1.5 pr-4">Name</th>
                <th className="pb-1.5">Email</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id} className={i < customers.length - 1 ? 'border-b border-gray-100' : ''}>
                  <td className="py-1.5 pr-4 font-mono">{c.id}</td>
                  <td className="py-1.5 pr-4">{c.name}</td>
                  <td className="py-1.5 text-gray-400">{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
