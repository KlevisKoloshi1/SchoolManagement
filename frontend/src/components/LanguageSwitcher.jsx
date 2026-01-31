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
    // Store language preference
    localStorage.setItem('preferred-language', languageCode)
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="flex gap-1 bg-surface/95 backdrop-blur-sm border border-border rounded-xl p-1 shadow-soft">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={currentLanguage.code === language.code ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleLanguageChange(language.code)}
            className={[
              'flex items-center gap-2 transition-all duration-200',
              compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2',
              'text-sm font-medium rounded-lg',
              currentLanguage.code === language.code 
                ? 'shadow-soft transform scale-105' 
                : 'hover:bg-surface-hover'
            ].join(' ')}
            title={language.name}
          >
            <span className="text-base leading-none">{language.flag}</span>
            <span className="text-xs font-semibold tracking-wide">
              {compact ? language.shortName : language.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}