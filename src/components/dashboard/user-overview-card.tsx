import { Users, UserCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { UserStats } from '@/lib/actions/dashboard'

interface UserOverviewCardProps {
  stats: UserStats
}

export function UserOverviewCard({ stats }: UserOverviewCardProps) {
  const activePercentage = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Users</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {stats.total}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <UserCheck className="h-4 w-4" />
            {activePercentage}% Active
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          <span className="text-green-600">{stats.active} Active</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-red-600">{stats.inactive} Inactive</span>
        </div>
        <div className="text-muted-foreground">Team overview and status</div>
      </CardFooter>
    </Card>
  )
}
