import { useTranslation } from 'react-i18next'
import { Button } from './ui'

const languages = [
  { code: 'en', name: 'English', shortName: 'EN', flag: '🇺🇸' },
  { code: 'sq', name: 'Shqip', shortName: 'AL', flag: '🇦🇱' }
]

export function LanguageSwitcher({ className = '', compact = false }) {
  const { i18n } = useTranslation()

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode)
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="flex gap-1 bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-1 shadow-sm">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={currentLanguage.code === language.code ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-1.5 ${compact ? 'px-2 py-1' : 'px-3 py-1.5'} text-sm font-medium`}
            title={language.name}
          >
            <span className="text-base">{language.flag}</span>
            <span className="text-xs font-semibold">{compact ? language.shortName : language.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}