'use client'

import { useState, useEffect } from 'react'
import { Search, Globe, X, Briefcase, Calendar } from 'lucide-react'
import type { FilterState } from './useJobFilters'
import { DEFAULT_FILTERS } from './useJobFilters'

interface Props {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  totalResults: number
  availableSources: string[]
}

const POPULAR_SEARCHES = ['React', 'Python', 'DevOps', 'Machine Learning', 'Intern', 'Remote', 'Rust', 'Full Stack', 'Montreal', 'Toronto']
const JOB_TYPES = ['All', 'Full-time', 'Internship', 'New Grad', 'Contract']
const DATE_OPTIONS = [
  { value: 'all', label: 'Any time' },
  { value: '24h', label: '24h' },
  { value: '7d', label: 'Week' },
  { value: '30d', label: 'Month' },
]

export function HeroSearch({ filters, setFilters, totalResults, availableSources }: Props) {
  const [localWhat, setLocalWhat] = useState(filters.searchQuery)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchQuery: localWhat }))
    }, 300)
    return () => clearTimeout(timeout)
  }, [localWhat, setFilters])

  const hasActiveFilters = filters.remoteOnly || filters.jobType !== 'All' || filters.datePosted !== 'all' || filters.sources.length > 0

  const clearAllFilters = () => {
    setLocalWhat('')
    setFilters(DEFAULT_FILTERS)
  }

  return (
    <div className="w-full space-y-3">
      {/* Search Bar */}
      <div className="flex bg-[#0c0c16] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden glass-card">
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input type="text" placeholder="Job title, company, skill, or location..." value={localWhat} onChange={(e) => setLocalWhat(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-transparent text-base placeholder:text-muted-foreground/50 focus:outline-none focus:bg-white/[0.02] transition-colors" />
          {localWhat && <button onClick={() => setLocalWhat('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/[0.06]"><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <button onClick={() => setFilters(f => ({ ...f, remoteOnly: !f.remoteOnly }))}
          className={`h-14 px-6 font-semibold flex items-center justify-center gap-2 transition-all shrink-0 border-l border-white/[0.08] ${filters.remoteOnly ? 'bg-primary text-white' : 'hover:bg-white/[0.04] text-muted-foreground hover:text-foreground'}`}>
          <Globe className={`w-5 h-5 ${filters.remoteOnly ? 'text-white' : ''}`} />Remote
        </button>
      </div>

      {/* Quick Search Suggestions (only when no search query) */}
      {!localWhat && (
        <div className="flex items-center gap-2 px-1 flex-wrap">
          <span className="text-xs text-muted-foreground/50 mr-1">Popular:</span>
          {POPULAR_SEARCHES.map(term => (
            <button key={term} onClick={() => setLocalWhat(term)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-muted-foreground hover:text-foreground hover:bg-white/[0.06] hover:border-primary/20 transition-all">
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-3 px-1 flex-wrap">
        {/* Job Type Chips */}
        <div className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-muted-foreground mr-1" />
          {JOB_TYPES.map(type => (
            <button key={type} onClick={() => setFilters(f => ({ ...f, jobType: type }))}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all ${
                filters.jobType === type
                  ? 'bg-primary/15 text-primary border-primary/30'
                  : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-foreground hover:bg-white/[0.05]'
              }`}>
              {type}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/[0.08]" />

        {/* Date Filter Chips */}
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground mr-1" />
          {DATE_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setFilters(f => ({ ...f, datePosted: opt.value }))}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all ${
                filters.datePosted === opt.value
                  ? 'bg-primary/15 text-primary border-primary/30'
                  : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-foreground hover:bg-white/[0.05]'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Results + Clear */}
        <div className="flex items-center gap-2 ml-auto">
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-1">
              <X className="w-3 h-3" />Clear
            </button>
          )}
          <span className="text-sm font-medium text-muted-foreground">
            <span className="text-foreground font-semibold">{totalResults}</span> jobs
          </span>
        </div>
      </div>
    </div>
  )
}
