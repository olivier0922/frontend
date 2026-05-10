'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createApplication(jobId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase
      .from('applications')
      .update({ status })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        job_id: jobId,
        status,
      })
  }

  revalidatePath('/dashboard')
  revalidatePath('/applications')
}

export async function updateApplicationStatus(appId: string, status: string) {
  const supabase = await createClient()
  await supabase
    .from('applications')
    .update({ status })
    .eq('id', appId)
    
  revalidatePath('/applications')
}
