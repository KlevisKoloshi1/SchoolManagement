import { Card } from '../../components/ui'

export default function MainTeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-slate-900">Main Teacher Dashboard</div>
        <div className="text-sm text-slate-600">Manage your assigned class.</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Students">
          <div className="text-sm text-slate-700">Add students to your class.</div>
        </Card>
        <Card title="Records">
          <div className="text-sm text-slate-700">Add lesson topics, absences, and grades.</div>
        </Card>
      </div>
    </div>
  )
}

