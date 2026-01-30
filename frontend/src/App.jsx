import { RouterProvider } from 'react-router-dom'
import { makeRouter } from './router/router'

export default function App() {
  return <RouterProvider router={makeRouter()} />
}
