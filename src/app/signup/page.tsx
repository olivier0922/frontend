import Link from 'next/link'
import { signup } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, ArrowLeft } from 'lucide-react'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const message = (await searchParams).message

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="mesh-bg" />

      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Home
      </Link>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight">InternAI</span>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          <form action={signup}>
            <div className="space-y-1 mb-6">
              <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
              <p className="text-sm text-muted-foreground">
                Start discovering internships matched to your skills
              </p>
            </div>

            {message && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-red-400">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="glass-input h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="glass-input h-11"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full gradient-btn text-white font-semibold py-3 rounded-xl mt-6 text-sm"
            >
              Create account
            </button>

            <p className="text-sm text-center text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
