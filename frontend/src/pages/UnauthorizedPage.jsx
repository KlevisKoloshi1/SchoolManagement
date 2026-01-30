import { Link } from 'react-router-dom'
import { Button, Card } from '../components/ui'

export default function UnauthorizedPage() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card title="Unauthorized">
          <div className="text-sm text-slate-700">You don’t have access to that page.</div>
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

