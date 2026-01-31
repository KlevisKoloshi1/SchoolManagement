import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth/AuthContext'
import { getActivities, getAnnouncements } from '../api/mainTeacher'
import { getActivities as getStudentActivities, getAnnouncements as getStudentAnnouncements } from '../api/student'
import { useMainTeacherClass } from '../contexts/MainTeacherClassContext'

function NotificationPanel({ activities, announcements, loading }) {
  const { t } = useTranslation()
  if (loading) {
    return <p className="text-sm text-text-secondary py-4 text-center">{t('common.loading')}</p>
  }
  const total = activities.length + announcements.length
  if (total === 0) {
    return <p className="text-sm text-text-secondary py-4 text-center">{t('notifications.noNotifications')}</p>
  }
  return (
    <>
      {activities.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-medium text-text-secondary uppercase tracking-wide px-2 py-1">
            {t('notifications.activities')}
          </div>
          {activities.slice(0, 5).map((a) => (
            <div key={a.id} className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 mb-1">
              <div className="font-medium text-sm text-text-primary">{a.name}</div>
              <div className="text-xs text-text-secondary">{a.date}</div>
              {a.description && <p className="text-xs text-text-secondary mt-1 line-clamp-2">{a.description}</p>}
            </div>
          ))}
          {activities.length > 5 && <p className="text-xs text-text-secondary px-2">{t('navigation.calendar')} for more</p>}
        </div>
      )}
      {announcements.length > 0 && (
        <div>
          <div className="text-xs font-medium text-text-secondary uppercase tracking-wide px-2 py-1">
            {t('notifications.announcements')}
          </div>
          {announcements.slice(0, 5).map((a) => (
            <div key={a.id} className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 mb-1">
              <div className="font-medium text-sm text-text-primary">{a.title}</div>
              <div className="text-xs text-text-secondary capitalize">{a.type}</div>
              <p className="text-xs text-text-secondary mt-1 line-clamp-2">{a.message}</p>
            </div>
          ))}
          {announcements.length > 5 && <p className="text-xs text-text-secondary px-2">See calendar for more</p>}
        </div>
      )}
    </>
  )
}

export function MainTeacherNotificationDropdown() {
  const { t } = useTranslation()
  const { currentClassId } = useMainTeacherClass()
  const [open, setOpen] = useState(false)
  const [activities, setActivities] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([getActivities(currentClassId ?? undefined), getAnnouncements(currentClassId ?? undefined)])
      .then(([actRes, annRes]) => {
        setActivities(actRes?.activities ?? [])
        setAnnouncements(annRes?.announcements ?? [])
      })
      .catch(() => {
        setActivities([])
        setAnnouncements([])
      })
      .finally(() => setLoading(false))
  }, [currentClassId])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const total = activities.length + announcements.length

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-surface hover:bg-surface-hover text-text-primary transition-all"
        title={t('navigation.notifications')}
      >
        <span className="text-lg">🔔</span>
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-surface shadow-soft z-50">
          <div className="p-3 border-b border-border font-medium text-text-primary">{t('navigation.notifications')}</div>
          <div className="p-2">
            <NotificationPanel activities={activities} announcements={announcements} loading={loading} />
          </div>
        </div>
      )}
    </div>
  )
}

export function StudentNotificationDropdown() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [activities, setActivities] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([getStudentActivities(), getStudentAnnouncements()])
      .then(([actRes, annRes]) => {
        setActivities(actRes?.activities ?? [])
        setAnnouncements(annRes?.announcements ?? [])
      })
      .catch(() => {
        setActivities([])
        setAnnouncements([])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const total = activities.length + announcements.length

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-surface hover:bg-surface-hover text-text-primary transition-all"
        title={t('navigation.notifications')}
      >
        <span className="text-lg">🔔</span>
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-surface shadow-soft z-50">
          <div className="p-3 border-b border-border font-medium text-text-primary">{t('navigation.notifications')}</div>
          <div className="p-2">
            <NotificationPanel activities={activities} announcements={announcements} loading={loading} />
          </div>
        </div>
      )}
    </div>
  )
}

export function NotificationDropdown() {
  const { role } = useAuth()
  if (role === 'main_teacher') return <MainTeacherNotificationDropdown />
  if (role === 'student') return <StudentNotificationDropdown />
  return null
}
