import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Card } from '../components/ui'
import { LanguageSwitcher } from '../components/LanguageSwitcher'

export default function NotFoundPage() {
  const { t } = useTranslation()
  
  return (
    <div className="flex h-full items-center justify-center p-6 relative">
      {/* Language Switcher - Top Right Corner */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher compact />
      </div>
      
      <div className="w-full max-w-md">
        <Card title={t('errors.pageNotFound')}>
          <div className="text-sm text-slate-700">{t('errors.pageNotFoundDescription')}</div>
          <div className="mt-4">
            <Link to="/">
              <Button>{t('errors.goHome')}</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}