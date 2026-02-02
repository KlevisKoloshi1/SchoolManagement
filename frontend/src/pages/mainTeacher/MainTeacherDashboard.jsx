import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getStudents, getClasses } from '../../api/mainTeacher'
import { Card, Select } from '../../components/ui'
import { useMainTeacherClass } from '../../contexts/MainTeacherClassContext'

export default function MainTeacherDashboard() {
  const { t } = useTranslation()
  const { currentClassId, setCurrentClassId } = useMainTeacherClass()
  const [classInfo, setClassInfo] = useState(null)
  const [homeroomClass, setHomeroomClass] = useState(null)
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const classIdParam = currentClassId ?? undefined
    Promise.all([
      getStudents(classIdParam),
      getClasses(),
    ])
      .then(([data, classesRes]) => {
        setHomeroomClass(data.homeroom_class || null)
        setClassInfo(data.class || null)
        setStudents(data.students || [])
        setClasses(classesRes.classes || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [currentClassId])

  const isViewingHomeroom = currentClassId == null || (homeroomClass && currentClassId === homeroomClass.id)

  function handleClassChange(e) {
    const val = e.target.value
    setCurrentClassId(val === '' ? null : Number(val))
  }

  const classOptions = classes
    .filter((c) => homeroomClass && c.id !== homeroomClass.id)
    .map(c => ({ value: c.id, label: c.name }))

  const dashboardCards = [
    {
      title: t('navigation.students'),
      description: isViewingHomeroom 
        ? t('mainTeacher.addViewStudents')
        : t('mainTeacher.viewStudents'),
      link: '/main-teacher/students',
      icon: '●',
      color: 'from-primary/10 to-primary/5',
      stats: !loading && classInfo ? `${students.length} ${t('navigation.students').toLowerCase()}` : null
    },
    {
      title: t('mainTeacher.records'),
      description: t('mainTeacher.addLessonTopics'),
      icon: '◑',
      color: 'from-accent/10 to-accent/5',
      subCards: [
        { title: t('mainTeacher.lessons'), link: '/main-teacher/lessons', icon: '▼' },
        { title: t('mainTeacher.absencesTitle'), link: '/main-teacher/absences', icon: '◐' },
        { title: t('mainTeacher.gradesTitle'), link: '/main-teacher/grades', icon: '◗' }
      ]
    },
    {
      title: t('navigation.reports'),
      description: t('mainTeacher.reportsDescription'),
      link: '/main-teacher/reports',
      icon: '📋',
      color: 'from-blue-500/10 to-blue-500/5'
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center sm:text-left">
        <div className="text-3xl font-bold text-text-primary mb-2">
          {t('mainTeacher.dashboard')}
        </div>
        <div className="text-text-secondary max-w-2xl">
          {t('mainTeacher.manageClass')}
        </div>
      </div>

      {/* Class selector */}
      {homeroomClass && classes.length > 0 && (
        <Card title={t('mainTeacher.currentClass')} className="max-w-2xl">
          <div className="space-y-4">
            <Select
              label={t('mainTeacher.viewClass')}
              value={currentClassId ?? ''}
              onChange={handleClassChange}
              options={[
                { value: '', label: `${t('mainTeacher.myClass')} (${homeroomClass.name})` },
                ...classOptions
              ]}
            />
            
            {!isViewingHomeroom && classInfo && (
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                <div className="text-sm font-medium text-primary mb-1">
                  {t('mainTeacher.viewingAsTeacher')} – {classInfo.name}
                </div>
                <div className="text-xs text-text-secondary">
                  {t('mainTeacher.sameInterface')}
                </div>
              </div>
            )}
            
            {isViewingHomeroom && (
              <div className="p-3 rounded-xl bg-accent/5 border border-accent/20">
                <div className="text-sm font-medium text-accent-700 mb-1">
                  {t('mainTeacher.yourClass')}
                </div>
                <div className="text-xs text-text-secondary">
                  {t('mainTeacher.homeroomClass')}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Class info */}
      {classInfo && (
        <Card className="max-w-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 flex items-center justify-center text-2xl">
              ◆
            </div>
            <div>
              <div className="text-xl font-semibold text-text-primary">
                {isViewingHomeroom ? t('mainTeacher.yourClass') : `Class: ${classInfo.name}`}
              </div>
              <div className="text-text-secondary">
                {loading ? t('common.loading') : `${students.length} student(s) in this class.`}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Dashboard cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card, index) => (
          <div key={card.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            {card.link ? (
              <Link to={card.link} className="block group">
                <Card 
                  className="h-full hover:shadow-soft-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group-hover:scale-[1.02]"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl mb-4`}>
                    {card.icon}
                  </div>
                  <div className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </div>
                  <div className="text-sm text-text-secondary leading-relaxed mb-2">
                    {card.description}
                  </div>
                  {card.stats && (
                    <div className="text-sm font-medium text-primary">
                      {card.stats}
                    </div>
                  )}
                </Card>
              </Link>
            ) : (
              <Card className="h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl mb-4`}>
                  {card.icon}
                </div>
                <div className="text-lg font-semibold text-text-primary mb-4">
                  {card.title}
                </div>
                <div className="text-sm text-text-secondary mb-4 leading-relaxed">
                  {card.description}
                </div>
                {card.subCards && (
                  <div className="grid gap-3">
                    {card.subCards.map((subCard) => (
                      <Link 
                        key={subCard.title}
                        to={subCard.link} 
                        className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover hover:bg-border-light transition-all duration-200 hover:scale-[1.02] group"
                      >
                        <span className="text-lg">{subCard.icon}</span>
                        <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                          {subCard.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* Recent students */}
      {!loading && students.length > 0 && (
        <Card title={t('mainTeacher.recentStudents')} className="max-w-4xl">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {students.slice(0, 6).map((student) => (
              <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                  {student.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {student.user.name}
                  </div>
                  <div className="text-xs text-text-secondary truncate">
                    {student.user.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {students.length > 6 && (
            <div className="mt-4 text-center">
              <Link 
                to="/main-teacher/students" 
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t('mainTeacher.viewAllStudents')} {students.length} {t('navigation.students').toLowerCase()}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
