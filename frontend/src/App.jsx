import { useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { makeRouter } from './router/router'

export default function App() {
  const router = useMemo(() => makeRouter(), [])
  return <RouterProvider router={router} />
}
