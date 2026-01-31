import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getClasses } from '../../api/teacher'
import { Card, Select } from '../../components/ui'
import { useTeacherClass } from '../../contexts/TeacherClassContext'

export default function TeacherDashboard() {
  const { t } = useTranslation()
  const { currentClassId, setCurrentClassId } = useTeacherClass()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClasses()
      .then((d) => setClasses(d.classes || []))
      .catch(() => setClasses([]))
      .finally(() => setLoading(false))
  }, [])

  const classOptions = classes.map((c) => ({ value: c.id, label: c.name }))

  const dashboardCards = [
    {
      title: t('teacher.lessons'),
      description: t('teacher.addLessonTopics'),
      link: '/teacher/lessons',
      icon: '▼',
      color: 'from-primary/10 to-primary/5'
    },
    {
      title: t('teacher.records'),
      description: t('teacher.addAbsencesGrades'),
      icon: '◑',
      color: 'from-accent/10 to-accent/5',
      subCards: [
        { title: t('navigation.grades'), link: '/teacher/grades', icon: '◗' },
        { title: t('mainTeacher.absencesTitle'), link: '/teacher/absences', icon: '◐' }
      ]
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center sm:text-left">
        <div className="text-3xl font-bold text-text-primary mb-2">
          {t('teacher.dashboard')}
        </div>
        <div className="text-text-secondary max-w-2xl">
          {t('teacher.manageSubjects')}
        </div>
      </div>

      {!loading && classes.length > 0 && (
        <Card title={t('teacher.selectClass')} className="max-w-2xl">
          <Select
            label={t('teacher.viewClass')}
            value={currentClassId ?? ''}
            onChange={(e) => {
              const val = e.target.value
              setCurrentClassId(val === '' ? null : Number(val))
            }}
            options={[{ value: '', label: t('teacher.selectClassFirst') }, ...classOptions]}
            placeholder={t('teacher.selectClassFirst')}
          />
          <p className="mt-2 text-sm text-text-secondary">
            {t('teacher.classSelectionHint')}
          </p>
        </Card>
      )}
      
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
                  <div className="text-sm text-text-secondary leading-relaxed">
                    {card.description}
                  </div>
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
    </div>
  )
}

