'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { trackEvent, trackMetaEvent } from '@/lib/analytics'
import { contato } from '@/lib/config'

type FormState = {
  firstName: string
  email: string
  mobile: string
  state: string
  workOn: string
  whyNow: string
  commitFourWeeks: string
  readyIn14Days: string
  ackAge18: boolean
  ackNonClinical: boolean
  phoneConsent: boolean
  website: string // honeypot — real applicants never see or fill this
}

const initialState: FormState = {
  firstName: '',
  email: '',
  mobile: '',
  state: '',
  workOn: '',
  whyNow: '',
  commitFourWeeks: '',
  readyIn14Days: '',
  ackAge18: false,
  ackNonClinical: false,
  phoneConsent: false,
  website: '',
}

const WORK_ON_OPTIONS = [
  'Emotional stability',
  'Repeating patterns',
  'Relationships or boundaries',
  'Confidence and self-trust',
  'Life direction or decisions',
  'Something else',
]

const WHY_NOW_MAX = 250

const inputClass =
  'w-full border border-charcoal/20 bg-offwhite px-4 py-3 font-body text-charcoal rounded-md focus:outline-none focus:ring-3 focus:ring-aqua focus:ring-offset-2 focus:ring-offset-offwhite'

function FieldLabel({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="font-body text-sm text-charcoal/90 block mb-2">
      {children} {required && <span className="text-orange">*</span>}
    </label>
  )
}

export default function FourWeekApplicationForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const hasStartedRef = useRef(false)
  const metaRef = useRef<{
    utm_source: string
    utm_medium: string
    utm_campaign: string
    utm_content: string
    fbclid: string
  } | null>(null)

  function getCampaignMeta() {
    if (metaRef.current) return metaRef.current
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
    metaRef.current = {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      fbclid: params.get('fbclid') || '',
    }
    return metaRef.current
  }

  function markStarted() {
    if (hasStartedRef.current) return
    hasStartedRef.current = true
    trackEvent('ApplicationStart')
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    markStarted()
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function getMissingFields(): string[] {
    const missing: string[] = []
    if (form.firstName.trim() === '') missing.push('First Name')
    if (!form.email.includes('@')) missing.push('Email Address')
    if (form.state.trim() === '') missing.push('State')
    if (!WORK_ON_OPTIONS.includes(form.workOn)) missing.push('What you would most like to work on')
    if (form.whyNow.trim() === '' || form.whyNow.length > WHY_NOW_MAX) missing.push('Why now feels like the right time')
    if (!['Yes', 'No', 'I am not sure'].includes(form.commitFourWeeks)) {
      missing.push('The four-week commitment question')
    }
    if (!['Yes', 'No'].includes(form.readyIn14Days)) missing.push('The 14-day readiness question')
    if (!form.ackAge18 || !form.ackNonClinical) missing.push('Both required acknowledgement checkboxes')
    return missing
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    const missing = getMissingFields()
    if (missing.length > 0) {
      setStatus('error')
      setErrorMessage(`Please complete before submitting: ${missing.join(', ')}.`)
      // Native browser validation pinpoints and scrolls to the first invalid
      // field with its own accessible tooltip — a second, more specific layer
      // on top of the summary message above.
      e.currentTarget.reportValidity()
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const meta = getCampaignMeta()

    try {
      const response = await fetch('/api/4-week-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          landing_page_url: window.location.href,
          submitted_at: new Date().toISOString(),
          ...meta,
        }),
      })
      const data = await response.json()

      if (!response.ok || !data.ok) {
        setStatus('error')
        setErrorMessage(data.error || 'We could not submit your application. Please try again in a moment.')
        return
      }

      setStatus('success')
      trackMetaEvent('Lead', {
        content_name: '4-Week Experience Application',
        utm_source: meta.utm_source || undefined,
        utm_medium: meta.utm_medium || undefined,
        utm_campaign: meta.utm_campaign || undefined,
        utm_content: meta.utm_content || undefined,
      })
    } catch {
      setStatus('error')
      setErrorMessage('We could not submit your application. Please check your connection and try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl text-charcoal mb-4">Your application has been received.</h2>
        <p className="font-body text-charcoal/85 leading-relaxed mb-4">
          Thank you for applying for the Private 4-Week Emotional &amp; Life Rebuilding Experience. SAL Ray reviews
          each application individually. If your application appears to be a strong fit, you will receive an email
          from {contato.email} within three business days with the next step. Please check your spam or promotions
          folder if you do not see it.
        </p>
        <p className="font-body text-sm text-charcoal/60">
          Only three participants will be selected, and submitting an application does not guarantee participation.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl grid gap-8">
      {/* Honeypot — hidden from real visitors, left visible to bots that fill every field */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
        />
      </div>

      <p className="font-body text-sm text-charcoal/70 leading-relaxed bg-pale-aqua rounded-lg p-5">
        <strong className="text-charcoal">Before you apply:</strong> This is non-clinical coaching, not therapy or
        crisis support. You must be at least 18 and available for one private online session each week for four
        consecutive weeks.
      </p>

      {status === 'error' && (
        <p role="alert" className="font-body text-sm text-orange bg-pale-orange rounded-md p-4">
          {errorMessage}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <FieldLabel htmlFor="firstName" required>
            First Name
          </FieldLabel>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel htmlFor="email" required>
            Email Address
          </FieldLabel>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <FieldLabel htmlFor="mobile">Mobile Number</FieldLabel>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            autoComplete="tel"
            value={form.mobile}
            onChange={(e) => update('mobile', e.target.value)}
            className={inputClass}
          />
          <p className="font-body text-xs text-charcoal/50 mt-1.5">Used only to reach you about this application.</p>
        </div>
        <div>
          <FieldLabel htmlFor="state" required>
            State
          </FieldLabel>
          <input
            id="state"
            name="state"
            type="text"
            required
            autoComplete="address-level1"
            value={form.state}
            onChange={(e) => update('state', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="workOn" required>
          What would you most like to work on right now?
        </FieldLabel>
        <select
          id="workOn"
          name="workOn"
          required
          value={form.workOn}
          onChange={(e) => update('workOn', e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            Select one
          </option>
          {WORK_ON_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <FieldLabel htmlFor="whyNow" required>
            In one or two sentences, why does now feel like the right time for you?
          </FieldLabel>
          <span className="font-body text-xs text-charcoal/40 shrink-0 ml-3">
            {form.whyNow.length}/{WHY_NOW_MAX}
          </span>
        </div>
        <textarea
          id="whyNow"
          name="whyNow"
          required
          maxLength={WHY_NOW_MAX}
          rows={2}
          value={form.whyNow}
          onChange={(e) => update('whyNow', e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </div>

      <fieldset>
        <legend className="font-body text-sm text-charcoal/90 mb-2">
          Can you commit to one private online session per week for four consecutive weeks?{' '}
          <span className="text-orange">*</span>
        </legend>
        <div className="flex flex-wrap gap-4">
          {['Yes', 'No', 'I am not sure'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 font-body text-sm text-charcoal/85">
              <input
                type="radio"
                name="commitFourWeeks"
                value={opt}
                required
                checked={form.commitFourWeeks === opt}
                onChange={(e) => update('commitFourWeeks', e.target.value)}
                className="accent-aqua"
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-body text-sm text-charcoal/90 mb-2">
          If selected, are you prepared to begin within the next 14 days? <span className="text-orange">*</span>
        </legend>
        <div className="flex flex-wrap gap-4">
          {['Yes', 'No'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 font-body text-sm text-charcoal/85">
              <input
                type="radio"
                name="readyIn14Days"
                value={opt}
                required
                checked={form.readyIn14Days === opt}
                onChange={(e) => update('readyIn14Days', e.target.value)}
                className="accent-aqua"
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-3 border-t border-charcoal/10 pt-6">
        <label className="flex items-start gap-3 font-body text-sm text-charcoal/85">
          <input
            type="checkbox"
            required
            checked={form.ackAge18}
            onChange={(e) => update('ackAge18', e.target.checked)}
            className="mt-1 accent-aqua"
          />
          I confirm that I am 18 years of age or older.
        </label>
        <label className="flex items-start gap-3 font-body text-sm text-charcoal/85">
          <input
            type="checkbox"
            required
            checked={form.ackNonClinical}
            onChange={(e) => update('ackNonClinical', e.target.checked)}
            className="mt-1 accent-aqua"
          />
          I understand that this is non-clinical coaching and is not therapy, medical care, or crisis support.
        </label>

        {form.mobile.trim() !== '' && (
          <label className="flex items-start gap-3 font-body text-sm text-charcoal/85">
            <input
              type="checkbox"
              checked={form.phoneConsent}
              onChange={(e) => update('phoneConsent', e.target.checked)}
              className="mt-1 accent-aqua"
            />
            I agree that SAL Ray may call or text me only about this application.
          </label>
        )}
      </div>

      <div>
        <p className="font-body text-xs text-charcoal/50 leading-relaxed mb-4">
          Applications are reviewed individually. Submitting an application does not guarantee selection.
        </p>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="font-body text-sm font-medium bg-orange text-offwhite px-8 py-3.5 rounded-md hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit My Application'}
        </button>
        <p className="font-body text-xs text-charcoal/50 leading-relaxed mt-4 max-w-lg">
          By submitting, you agree that SAL Ray may review your application and contact you about this experience.
          Your information will be handled according to the{' '}
          <Link href="/privacy-policy/" className="text-aqua underline underline-offset-2">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/disclaimer/" className="text-aqua underline underline-offset-2">
            Professional Disclaimer
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
