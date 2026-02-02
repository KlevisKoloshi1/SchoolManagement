import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/ui'

export default function StudentDashboard() {
  const { t } = useTranslation()

  const dashboardCards = [
    {
      title: t('student.gradesTitle'),
      description: t('student.gradesDescription'),
      link: '/student/grades',
      icon: '◗',
      color: 'from-primary/10 to-primary/5'
    },
    {
      title: t('student.absencesTitle'),
      description: t('student.absencesDescription'),
      link: '/student/absences',
      icon: '◐',
      color: 'from-accent/10 to-accent/5'
    },
    {
      title: t('student.reportsTitle'),
      description: t('student.reportsDescription'),
      link: '/student/reports',
      icon: '📋',
      color: 'from-blue-500/10 to-blue-500/5'
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center sm:text-left">
        <div className="text-3xl font-bold text-text-primary mb-2">
          {t('student.dashboard')}
        </div>
        <div className="text-text-secondary max-w-2xl">
          {t('student.readOnlyAccess')}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card, index) => (
          <div key={card.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
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
          </div>
        ))}
      </div>
    </div>
  )
}

