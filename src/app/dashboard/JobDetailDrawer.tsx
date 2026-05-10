'use client'

import { useEffect } from 'react'
import { X, MapPin, Globe, Building2, ExternalLink, Tag, Clock, Sparkles } from 'lucide-react'
import { JobCardActions } from './JobCardActions'
import type { ScoredJob } from './useJobFilters'

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export function JobDetailDrawer({ job, isSaved, onClose }: {
  job: ScoredJob | null; isSaved: boolean; onClose: () => void
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (job) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [job])

  if (!job) return null

  const initials = job.company.split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase()

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose} />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[560px] bg-[#0c0c16] border-l border-white/[0.08] z-[70] flex flex-col drawer-slide-in overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-white/[0.06]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                {initials}
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">{job.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{job.company}</span>
                  <span className="text-white/10">·</span>
                  <Clock className="w-3 h-3" />
                  <span>{timeAgo(job.created_at)}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Quick Info Chips */}
          <div className="flex flex-wrap gap-2">
            {job.location && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] text-muted-foreground border border-white/[0.06]">
                <MapPin className="w-3.5 h-3.5" />{job.location}
              </span>
            )}
            {job.remote && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-500/[0.08] text-indigo-300 border border-indigo-500/[0.15]">
                <Globe className="w-3.5 h-3.5" />Remote
              </span>
            )}
            {job.salary && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-500/[0.08] text-emerald-300 border border-emerald-500/[0.15]">
                💰 {job.salary}
              </span>
            )}
            {job.job_type && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-500/[0.08] text-amber-300 border border-amber-500/[0.15]">
                {job.job_type}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] text-muted-foreground border border-white/[0.06]">
              Source: {job.source}
            </span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Skills & Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map(tag => (
                  <span key={tag} className="chip">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Job Description</h4>
            <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap break-words">
              {job.description}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 p-6 border-t border-white/[0.06] bg-[#0c0c16]">
          <JobCardActions jobId={job.id} jobUrl={job.url} isSaved={isSaved} />
        </div>
      </div>
    </>
  )
}
