import { createContext, useCallback, useContext, useState } from 'react'

const STORAGE_KEY = 'teacher_currentClassId'

const TeacherClassContext = createContext(null)

export function TeacherClassProvider({ children }) {
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
    <TeacherClassContext.Provider value={{ currentClassId, setCurrentClassId }}>
      {children}
    </TeacherClassContext.Provider>
  )
}

export function useTeacherClass() {
  const ctx = useContext(TeacherClassContext)
  if (!ctx) {
    throw new Error('useTeacherClass must be used within TeacherClassProvider')
  }
  return ctx
}
