import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'

export default async function ResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen">
      <Sidebar userEmail={user.email || ''} />
      <main className="flex-1 ml-[220px]">
        {children}
      </main>
    </div>
  )
}
