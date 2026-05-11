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

      // 1. Fetch user's CV skills first
      const { data: resumes } = await supabase
        .from('resumes')
        .select('extracted_skills')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        
      const userSkills: string[] = resumes?.[0]?.extracted_skills || []

      // 2. Fetch jobs, applying Server-Side CV filtering if skills exist
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let allJobs: any[] = []
      
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
      
      // If user has skills, push the "Field of Work" strictness to the database level
      // to avoid downloading 50,000 irrelevant jobs to the browser.
      if (userSkills.length > 0) {
        // Create an OR string like: title.ilike.%react%,title.ilike.%node%
        const orConditions = userSkills.map(skill => `title.ilike.%${skill}%`).join(',')
        query = query.or(orConditions)
        query = query.limit(2000) // limit to top 2000 matched jobs
      } else {
        query = query.limit(1000) // fallback limit if no CV
      }

      const { data: batch } = await query
      if (batch) {
        allJobs = batch
      }

      // 3. Fetch user's saved job IDs
      const { data: savedApps } = await supabase
        .from('applications')
        .select('job_id')
        .eq('user_id', user.id)
      
      const savedIds = new Set(savedApps?.map(a => a.job_id) || [])

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
