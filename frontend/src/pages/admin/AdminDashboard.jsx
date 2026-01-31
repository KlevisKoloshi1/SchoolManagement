import { Link } from 'react-router-dom'
import { Card } from '../../components/ui'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Admin Dashboard</div>
        <div className="text-sm text-slate-600">Manage teachers, classes, and subjects.</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/admin/teachers" className="block">
          <Card title="Teachers" className="hover:border-slate-400 transition-colors">
            <div className="text-sm text-slate-700">Create main teachers or teachers and show generated credentials.</div>
          </Card>
        </Link>
        <Card title="Assignments">
          <div className="text-sm text-slate-700">Assign main teacher to class and subjects to teachers.</div>
        </Card>
      </div>
    </div>
  )
}

