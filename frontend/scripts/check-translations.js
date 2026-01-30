#!/usr/bin/env node

/**
 * Simple script to check for missing translations between language files
 */

import fs from 'fs'
import path from 'path'

const localesDir = path.join(process.cwd(), 'src/i18n/locales')

function flattenObject(obj, prefix = '') {
  const flattened = {}
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key], prefix + key + '.'))
    } else {
      flattened[prefix + key] = obj[key]
    }
  }
  
  return flattened
}

function checkTranslations() {
  const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'))
  
  if (files.length < 2) {
    console.log('Need at least 2 language files to compare')
    return
  }
  
  const translations = {}
  
  // Load all translation files
  for (const file of files) {
    const lang = path.basename(file, '.json')
    const content = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'))
    translations[lang] = flattenObject(content)
  }
  
  const languages = Object.keys(translations)
  const allKeys = new Set()
  
  // Collect all translation keys
  for (const lang of languages) {
    Object.keys(translations[lang]).forEach(key => allKeys.add(key))
  }
  
  console.log(`Checking translations for languages: ${languages.join(', ')}`)
  console.log(`Total translation keys: ${allKeys.size}`)
  console.log()
  
  // Check for missing translations
  let hasMissing = false
  
  for (const lang of languages) {
    const missing = []
    
    for (const key of allKeys) {
      if (!(key in translations[lang])) {
        missing.push(key)
      }
    }
    
    if (missing.length > 0) {
      hasMissing = true
      console.log(`❌ Missing translations in ${lang}.json:`)
      missing.forEach(key => console.log(`   - ${key}`))
      console.log()
    } else {
      console.log(`✅ ${lang}.json - All translations present`)
    }
  }
  
  if (!hasMissing) {
    console.log('🎉 All translations are complete!')
  }
}

checkTranslations()