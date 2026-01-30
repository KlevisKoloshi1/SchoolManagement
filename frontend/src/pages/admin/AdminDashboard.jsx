import { Card } from '../../components/ui'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Admin Dashboard</div>
        <div className="text-sm text-slate-600">Manage teachers, classes, and subjects.</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Teachers">
          <div className="text-sm text-slate-700">Create main teachers or teachers and show generated credentials.</div>
        </Card>
        <Card title="Assignments">
          <div className="text-sm text-slate-700">Assign main teacher to class and subjects to teachers.</div>
        </Card>
      </div>
    </div>
  )
}

