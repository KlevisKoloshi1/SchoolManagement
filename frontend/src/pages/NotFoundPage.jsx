import { Link } from 'react-router-dom'
import { Button, Card } from '../components/ui'

export default function NotFoundPage() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card title="Not Found">
          <div className="text-sm text-slate-700">That page doesn’t exist.</div>
          <div className="mt-4">
            <Link to="/">
              <Button>Go home</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

