import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getCalendar } from '../../api/mainTeacher'
import { useMainTeacherClass } from '../../contexts/MainTeacherClassContext'
import { Card } from '../../components/ui'

export default function MainTeacherCalendar() {
  const { t } = useTranslation()
  const { currentClassId } = useMainTeacherClass()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth())

  const from = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const lastDay = new Date(year, month + 1, 0).getDate()
  const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  useEffect(() => {
    setLoading(true)
    getCalendar(from, to, currentClassId ?? undefined)
      .then((data) => setActivities(data.activities || []))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false))
  }, [from, to, currentClassId])

  const monthLabel = new Date(year, month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  function prevMonth() {
    if (month === 0) {
      setYear((y) => y - 1)
      setMonth(11)
    } else {
      setMonth((m) => m - 1)
    }
  }
  function nextMonth() {
    if (month === 11) {
      setYear((y) => y + 1)
      setMonth(0)
    } else {
      setMonth((m) => m + 1)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center sm:text-left">
        <div className="text-3xl font-bold text-text-primary mb-2">{t('navigation.calendar')}</div>
        <div className="text-text-secondary max-w-2xl">
          {t('notifications.activities')} – {t('mainTeacher.homeroomClass')}
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4 mb-6">
          <button type="button" onClick={prevMonth} className="px-3 py-2 rounded-xl border border-border hover:bg-surface-hover text-text-primary">
            ←
          </button>
          <h2 className="text-lg font-semibold text-text-primary capitalize">{monthLabel}</h2>
          <button type="button" onClick={nextMonth} className="px-3 py-2 rounded-xl border border-border hover:bg-surface-hover text-text-primary">
            →
          </button>
        </div>
        {loading ? (
          <p className="text-text-secondary py-8 text-center">{t('common.loading')}</p>
        ) : activities.length === 0 ? (
          <p className="text-text-secondary py-8 text-center">{t('notifications.noActivities')}</p>
        ) : (
          <ul className="divide-y divide-border">
            {activities.map((a) => (
              <li key={a.id} className="py-4">
                <div className="font-medium text-text-primary">{a.name}</div>
                <div className="text-sm text-text-secondary">{a.date}</div>
                {a.description && <p className="text-sm text-text-secondary mt-1">{a.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
