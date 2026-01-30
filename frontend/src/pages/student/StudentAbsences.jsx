import { useEffect, useState } from 'react'
import { getAbsences } from '../../api/student'
import { Alert, Card, Spinner } from '../../components/ui'

export default function StudentAbsences() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [absences, setAbsences] = useState([])

  useEffect(() => {
    let mounted = true
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const data = await getAbsences()
        if (!mounted) return
        setAbsences(Array.isArray(data) ? data : data?.data || [])
      } catch (err) {
        if (!mounted) return
        setError(err?.response?.data?.message || 'Failed to load absences.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Absences</div>
        <div className="text-sm text-slate-600">Your absences (read-only).</div>
      </div>

      <Card title="Absences list">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Spinner /> Loading…
          </div>
        ) : null}
        {error ? <Alert kind="error">{error}</Alert> : null}
        {!loading && !error && absences.length === 0 ? (
          <div className="text-sm text-slate-600">No absences found.</div>
        ) : null}

        {!loading && !error && absences.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="py-2">Date</th>
                  <th className="py-2">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {absences.map((a, idx) => (
                  <tr key={a.id || idx}>
                    <td className="py-2">{a.absent_on || a.date || '—'}</td>
                    <td className="py-2">{a.reason || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </div>
  )
}

