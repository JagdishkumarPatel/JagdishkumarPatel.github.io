'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'

type FilterDropdownProps = {
  label: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function FilterDropdown({ label, options, selected, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggle(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option]
    )
  }

  function clearAll() {
    onChange([])
    setOpen(false)
  }

  const hasSelection = selected.length > 0

  return (
    <div className="flex items-center gap-3 mb-8" ref={ref}>
      {/* Dropdown trigger */}
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
            hasSelection
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
          }`}
        >
          {hasSelection ? (
            <span>
              {label}
              <span className="ml-1.5 rounded-full bg-primary text-primary-foreground text-xs px-1.5 py-0.5">
                {selected.length}
              </span>
            </span>
          ) : (
            label
          )}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="absolute left-0 top-full mt-1.5 z-50 min-w-[200px] max-h-72 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
            <div className="p-1">
              {options.map((option) => {
                const isSelected = selected.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => toggle(option)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-left ${
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{option}</span>
                    {isSelected && <Check size={13} className="shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Active selection pills */}
      {hasSelection && (
        <div className="flex flex-wrap items-center gap-2">
          {selected.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-2.5 py-1 font-medium"
            >
              {s}
              <button
                onClick={() => toggle(s)}
                className="hover:text-primary/60 transition-colors"
                aria-label={`Remove ${s}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
