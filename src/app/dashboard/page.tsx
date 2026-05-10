import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch ALL jobs in batches to overcome Supabase 1000-row default limit
  let allJobs: any[] = []
  const batchSize = 1000
  let from = 0
  let hasMore = true

  while (hasMore) {
    const { data: batch } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, from + batchSize - 1)

    if (batch && batch.length > 0) {
      allJobs = allJobs.concat(batch)
      from += batchSize
      hasMore = batch.length === batchSize
    } else {
      hasMore = false
    }
  }

  // Fetch user's saved job IDs so we can show saved state
  const { data: savedApps } = await supabase
    .from('applications')
    .select('job_id')
    .eq('user_id', user.id)
  
  const savedJobIds = new Set(savedApps?.map(a => a.job_id) || [])

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <DashboardClient 
        initialJobs={allJobs} 
        savedJobIds={savedJobIds} 
      />
    </div>
  )
}
