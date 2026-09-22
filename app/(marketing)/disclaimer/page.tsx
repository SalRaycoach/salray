import type { Metadata } from 'next'
import { contato, SITE_URL } from '@/lib/config'

const title = 'Professional Disclaimer'
const description = 'SAL Ray provides non-clinical coaching and personal development services. Read the full professional disclaimer.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/disclaimer/` },
  openGraph: {
    title: `${title} | SAL Ray`,
    description,
    url: `${SITE_URL}/disclaimer/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function DisclaimerPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl text-charcoal mb-2">Professional Disclaimer</h1>
      <p className="font-body text-sm text-charcoal/50 mb-8">Last updated: September 14, 2026</p>

      <section className="max-w-2xl space-y-6 font-body text-charcoal/85 leading-relaxed">
        <h2 className="font-display text-2xl text-charcoal">Non-Clinical Nature of Services</h2>
        <p>
          SAL Ray provides non-clinical coaching and personal development services. These services are educational
          and supportive in nature and do not diagnose, treat, cure, or prevent mental-health or medical conditions.
          They are not a substitute for psychotherapy, psychiatry, medical care, or emergency services.
        </p>
        <p>
          Coaching may help clients examine personal patterns, clarify priorities, strengthen self-trust, consider
          boundaries, and identify practical next steps. Individual experiences and results vary.
        </p>

        <h2 className="font-display text-2xl text-charcoal">What Our Services Do Not Include</h2>
        <p>Our services do not include, and should not be understood as providing:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Trauma treatment</li>
          <li>Depression treatment</li>
          <li>Anxiety treatment</li>
          <li>Medication guidance</li>
          <li>Psychiatric treatment</li>
          <li>Diagnosis of any medical or mental-health condition</li>
          <li>Clinical hypnotherapy</li>
          <li>Medical treatment</li>
          <li>Crisis counseling</li>
        </ul>
        <p>
          If you are experiencing a mental-health condition, medical concern, or crisis, please seek support from a
          licensed healthcare professional or the appropriate emergency service.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Non-Clinical Hypnosis and Guided Exercises</h2>
        <p>
          When appropriate and separately agreed upon, sessions may include non-clinical hypnosis, guided
          visualization, or focused-attention exercises solely for personal development, self-reflection, mindset,
          habits, beliefs, and goal clarity. These exercises are not clinical hypnosis, hypnotherapy, medical
          treatment, or mental-health treatment. Participation is voluntary, and you may decline or stop an exercise
          at any time.
        </p>

        <h2 className="font-display text-2xl text-charcoal">The S.T.A.B.L.E.™ Method</h2>
        <p>
          The S.T.A.B.L.E.™ Method is a proprietary, non-clinical framework created by SAL Ray for recognizing
          personal patterns, building internal stability, and translating insight into practical, sustainable
          changes. It is a coaching framework, not a clinical or medical protocol.
        </p>

        <h2 className="font-display text-2xl text-charcoal">No Guarantee of Outcome</h2>
        <p>
          Coaching outcomes depend on individual effort, circumstances, and participation. We do not promise or
          guarantee any specific result. Any description of the coaching process (including program structure, such
          as the four-week format) describes the general direction of the work, not a guaranteed outcome.
        </p>

        <h2 className="font-display text-2xl text-charcoal">In Case of Crisis</h2>
        <p>
          Our services are not appropriate for anyone in immediate crisis, in danger, or in need of emergency
          support. If you are experiencing a mental-health emergency or thoughts of harming yourself or others,
          please contact local emergency services or a crisis resource, such as the 988 Suicide &amp; Crisis Lifeline
          (United States), immediately.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Contact Us</h2>
        <p>If you have questions about this disclaimer, contact us at:</p>
        <p>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${contato.email}`} className="text-aqua underline underline-offset-2">
            {contato.email}
          </a>
          <br />
          <strong>Business:</strong> SAL Ray Coaching LLC
        </p>
      </section>
    </main>
  )
}
