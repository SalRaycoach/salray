'use client'

/**
 * 0-10 scale as clickable buttons (not a text field) — English counterpart
 * of app/pt/reconstrucao-emocional/avaliacao/ScaleInput.tsx (identical
 * behavior, duplicated rather than shared so the two language tools can
 * evolve independently). 44px sides, the recommended comfortable minimum
 * touch target on mobile.
 */
export default function ScaleInput({
  value,
  onChange,
  label,
}: {
  value: number | null
  onChange: (value: number) => void
  label: string
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {Array.from({ length: 11 }, (_, n) => n).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-pressed={value === n}
          className={`w-11 h-11 rounded-md font-body text-sm font-medium transition-colors ${
            value === n
              ? 'bg-orange text-charcoal'
              : 'border border-charcoal/20 text-charcoal/70 hover:border-orange hover:text-orange'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
