'use client'

import { useState } from 'react'
import { contato } from '@/lib/config'
import { trackEvent } from '@/lib/analytics'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const canSubmit = name.trim().length > 1 && email.includes('@') && message.trim().length > 3

  function handleSend() {
    if (!canSubmit) return
    trackEvent('contact_form_submit')
    const subject = `Message from ${name} via salraycoach.com`
    const body = `${message}\n\nReply to: ${email}`
    window.location.href = `mailto:${contato.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="grid gap-5 max-w-lg">
      <label className="grid gap-2">
        <span className="font-body text-xs uppercase tracking-wide text-charcoal/60">Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-charcoal/20 bg-offwhite px-4 py-3 font-body text-charcoal rounded-md focus:outline-none focus:border-aqua"
          placeholder="Your name"
        />
      </label>

      <label className="grid gap-2">
        <span className="font-body text-xs uppercase tracking-wide text-charcoal/60">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-charcoal/20 bg-offwhite px-4 py-3 font-body text-charcoal rounded-md focus:outline-none focus:border-aqua"
          placeholder="you@example.com"
        />
      </label>

      <label className="grid gap-2">
        <span className="font-body text-xs uppercase tracking-wide text-charcoal/60">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="border border-charcoal/20 bg-offwhite px-4 py-3 font-body text-charcoal rounded-md focus:outline-none focus:border-aqua resize-none"
          placeholder="What would you like to share?"
        />
      </label>

      <button
        type="button"
        onClick={handleSend}
        disabled={!canSubmit}
        className="font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Send Message
      </button>

      <p className="font-body text-xs text-charcoal/50 leading-relaxed">
        This form is not monitored for emergencies. If you are in crisis, call or text 988 (Suicide &amp; Crisis
        Lifeline) or contact local emergency services.
      </p>
    </div>
  )
}
