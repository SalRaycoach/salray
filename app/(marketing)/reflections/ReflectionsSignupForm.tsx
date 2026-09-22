'use client'

import { useId, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function ReflectionsSignupForm() {
  const uid = useId()
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    if (!email.includes('@')) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/reflections-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, pageUrl: window.location.href }),
      })
      const data = await response.json()

      if (!response.ok || !data.ok) {
        setStatus('error')
        setErrorMessage(data.error || 'We could not save your email. Please try again in a moment.')
        return
      }

      trackEvent('reflections_signup_submit')
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
      setErrorMessage('We could not save your email. Please check your connection and try again.')
    }
  }

  if (status === 'success') {
    return (
      <p className="font-body text-charcoal/80 leading-relaxed">
        You&apos;re on the list. New reflections arrive every Monday, Wednesday, and Friday.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-3 max-w-lg">
      {/* Honeypot — hidden from real visitors, left visible to bots that fill every field */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          type="text"
          id={`${uid}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <label htmlFor={`${uid}-email`} className="sr-only">
        Email address
      </label>
      <input
        id={`${uid}-email`}
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 border border-charcoal/20 bg-offwhite px-4 py-3 font-body text-charcoal rounded-md focus:outline-none focus:ring-3 focus:ring-aqua focus:ring-offset-2 focus:ring-offset-offwhite"
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="font-body text-sm font-medium bg-orange text-offwhite px-6 py-3 rounded-md hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {status === 'submitting' ? 'Sending...' : 'Send Me the Reflections'}
      </button>

      {status === 'error' && (
        <p role="alert" className="font-body text-sm text-orange basis-full">
          {errorMessage}
        </p>
      )}
    </form>
  )
}
