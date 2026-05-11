'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardClient } from './DashboardClient'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [jobs, setJobs] = useState<any[]>([])
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set())
  const [userSkills, setUserSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch ALL jobs in batches to overcome Supabase 1000-row default limit
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      // Fetch user's saved job IDs
      const { data: savedApps } = await supabase
        .from('applications')
        .select('job_id')
        .eq('user_id', user.id)
      
      const savedIds = new Set(savedApps?.map(a => a.job_id) || [])

      // Fetch user's CV skills
      const { data: resumes } = await supabase
        .from('resumes')
        .select('extracted_skills')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        
      const userSkills = resumes?.[0]?.extracted_skills || []

      if (mounted) {
        setJobs(allJobs)
        setSavedJobIds(savedIds)
        setUserSkills(userSkills)
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 lg:p-8">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">Loading job database...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <DashboardClient 
        initialJobs={jobs} 
        savedJobIds={savedJobIds} 
        userSkills={userSkills} 
      />
    </div>
  )
}
