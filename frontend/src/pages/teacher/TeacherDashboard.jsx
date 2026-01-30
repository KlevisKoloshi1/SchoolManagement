import { Card } from '../../components/ui'

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Teacher Dashboard</div>
        <div className="text-sm text-slate-600">Manage your assigned subjects.</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Lessons">
          <div className="text-sm text-slate-700">Add lesson topics for your subjects.</div>
        </Card>
        <Card title="Records">
          <div className="text-sm text-slate-700">Add absences and grades.</div>
        </Card>
      </div>
    </div>
  )
}

