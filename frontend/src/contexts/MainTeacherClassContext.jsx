import { createContext, useCallback, useContext, useState } from 'react'

const STORAGE_KEY = 'mainTeacher_currentClassId'

const MainTeacherClassContext = createContext(null)

export function MainTeacherClassProvider({ children }) {
  const [currentClassId, setCurrentClassIdState] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? (Number(stored) || null) : null
  })

  const setCurrentClassId = useCallback((value) => {
    setCurrentClassIdState(value)
    if (value != null) {
      sessionStorage.setItem(STORAGE_KEY, String(value))
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  return (
    <MainTeacherClassContext.Provider value={{ currentClassId, setCurrentClassId }}>
      {children}
    </MainTeacherClassContext.Provider>
  )
}

export function useMainTeacherClass() {
  const ctx = useContext(MainTeacherClassContext)
  if (!ctx) {
    throw new Error('useMainTeacherClass must be used within MainTeacherClassProvider')
  }
  return ctx
}
