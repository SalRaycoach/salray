'use client'

/**
 * Escala de 0 a 10 como botões clicáveis (não campo de texto) — 44px de
 * lado, tamanho mínimo recomendado de toque confortável no mobile.
 */
export default function ScaleInput({
  value,
  onChange,
  label,
}: {
  value: number | null
  onChange: (valor: number) => void
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
