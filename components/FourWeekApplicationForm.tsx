'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { trackEvent, trackMetaEvent } from '@/lib/analytics'

type FormState = {
  firstName: string
  lastName: string
  email: string
  mobile: string
  location: string
  currentSituation: string
  desiredChange: string
  howLong: string
  whyNow: string
  commitFourWeeks: string
  activeParticipation: string
  readyIn14Days: string
  ackAge18: boolean
  ackNonClinical: boolean
  ackNoGuarantee: boolean
  ackAttendance: boolean
  ackPrivacy: boolean
  phoneConsent: boolean
  website: string // honeypot — real applicants never see or fill this
}

const initialState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  location: '',
  currentSituation: '',
  desiredChange: '',
  howLong: '',
  whyNow: '',
  commitFourWeeks: '',
  activeParticipation: '',
  readyIn14Days: '',
  ackAge18: false,
  ackNonClinical: false,
  ackNoGuarantee: false,
  ackAttendance: false,
  ackPrivacy: false,
  phoneConsent: false,
  website: '',
}

const HOW_LONG_OPTIONS = ['Less than 3 months', '3-12 months', '1-3 years', 'More than 3 years']

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

  const canSubmit =
    form.firstName.trim() !== '' &&
    form.lastName.trim() !== '' &&
    form.email.includes('@') &&
    form.location.trim() !== '' &&
    form.currentSituation.trim() !== '' &&
    form.currentSituation.length <= 1500 &&
    form.desiredChange.trim() !== '' &&
    form.desiredChange.length <= 1000 &&
    HOW_LONG_OPTIONS.includes(form.howLong) &&
    form.whyNow.trim() !== '' &&
    form.whyNow.length <= 750 &&
    ['Yes', 'No', 'I am not sure'].includes(form.commitFourWeeks) &&
    ['Yes', 'No'].includes(form.activeParticipation) &&
    ['Yes', 'No'].includes(form.readyIn14Days) &&
    form.ackAge18 &&
    form.ackNonClinical &&
    form.ackNoGuarantee &&
    form.ackAttendance &&
    form.ackPrivacy

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || status === 'submitting') return

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
          from hello@salraycoach.com within three business days with the next step. Please check your spam or
          promotions folder if you do not see it.
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
          <FieldLabel htmlFor="lastName" required>
            Last Name
          </FieldLabel>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
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
      </div>

      <div>
        <FieldLabel htmlFor="location" required>
          Where are you located? (City, State, and Time Zone)
        </FieldLabel>
        <input
          id="location"
          name="location"
          type="text"
          required
          value={form.location}
          onChange={(e) => update('location', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <FieldLabel htmlFor="currentSituation" required>
            What are you currently experiencing or repeatedly dealing with that you would like to work on?
          </FieldLabel>
          <span className="font-body text-xs text-charcoal/40 shrink-0 ml-3">{form.currentSituation.length}/1,500</span>
        </div>
        <textarea
          id="currentSituation"
          name="currentSituation"
          required
          maxLength={1500}
          rows={4}
          value={form.currentSituation}
          onChange={(e) => update('currentSituation', e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <FieldLabel htmlFor="desiredChange" required>
            What would you most like to understand, change, or begin rebuilding during these four weeks?
          </FieldLabel>
          <span className="font-body text-xs text-charcoal/40 shrink-0 ml-3">{form.desiredChange.length}/1,000</span>
        </div>
        <textarea
          id="desiredChange"
          name="desiredChange"
          required
          maxLength={1000}
          rows={3}
          value={form.desiredChange}
          onChange={(e) => update('desiredChange', e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <FieldLabel htmlFor="howLong" required>
          How long has this been affecting you?
        </FieldLabel>
        <select
          id="howLong"
          name="howLong"
          required
          value={form.howLong}
          onChange={(e) => update('howLong', e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            Select one
          </option>
          {HOW_LONG_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <FieldLabel htmlFor="whyNow" required>
            Why does now feel like the right time to work on this?
          </FieldLabel>
          <span className="font-body text-xs text-charcoal/40 shrink-0 ml-3">{form.whyNow.length}/750</span>
        </div>
        <textarea
          id="whyNow"
          name="whyNow"
          required
          maxLength={750}
          rows={3}
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
          Are you prepared to participate actively, reflect honestly, and apply what is discussed between sessions?{' '}
          <span className="text-orange">*</span>
        </legend>
        <div className="flex flex-wrap gap-4">
          {['Yes', 'No'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 font-body text-sm text-charcoal/85">
              <input
                type="radio"
                name="activeParticipation"
                value={opt}
                required
                checked={form.activeParticipation === opt}
                onChange={(e) => update('activeParticipation', e.target.value)}
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
        <label className="flex items-start gap-3 font-body text-sm text-charcoal/85">
          <input
            type="checkbox"
            required
            checked={form.ackNoGuarantee}
            onChange={(e) => update('ackNoGuarantee', e.target.checked)}
            className="mt-1 accent-aqua"
          />
          I understand that applying does not guarantee selection and that only three participants will be chosen.
        </label>
        <label className="flex items-start gap-3 font-body text-sm text-charcoal/85">
          <input
            type="checkbox"
            required
            checked={form.ackAttendance}
            onChange={(e) => update('ackAttendance', e.target.checked)}
            className="mt-1 accent-aqua"
          />
          I understand that selected participants are expected to attend all four sessions and provide honest
          feedback at the end. A testimonial is not required.
        </label>
        <label className="flex items-start gap-3 font-body text-sm text-charcoal/85">
          <input
            type="checkbox"
            required
            checked={form.ackPrivacy}
            onChange={(e) => update('ackPrivacy', e.target.checked)}
            className="mt-1 accent-aqua"
          />
          I have read and agree to the{' '}
          <Link href="/privacy-policy/" className="text-aqua underline underline-offset-2">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/disclaimer/" className="text-aqua underline underline-offset-2">
            Professional Disclaimer
          </Link>
          .
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
        <button
          type="submit"
          disabled={!canSubmit || status === 'submitting'}
          className="font-body text-sm font-medium bg-orange text-offwhite px-8 py-3.5 rounded-md hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit My Application'}
        </button>
        <p className="font-body text-xs text-charcoal/50 leading-relaxed mt-4 max-w-lg">
          By submitting, you agree that SAL Ray may review your application and contact you about this experience.
          Your information will be handled according to the{' '}
          <Link href="/privacy-policy/" className="text-aqua underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
