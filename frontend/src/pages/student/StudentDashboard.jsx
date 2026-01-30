import { Card } from '../../components/ui'

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Student Dashboard</div>
        <div className="text-sm text-slate-600">Read-only access to your records.</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Grades">
          <div className="text-sm text-slate-700">View your grades.</div>
        </Card>
        <Card title="Absences">
          <div className="text-sm text-slate-700">View your absences.</div>
        </Card>
      </div>
    </div>
  )
}

