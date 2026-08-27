import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import SchemaOrg from '@/components/SchemaOrg'
import TrackMetaEventOnMount from '@/components/TrackMetaEventOnMount'
import { getFourWeekExperienceSchema } from '@/lib/schema'
import { stableMethod, fourWeekExperience, fourWeekFaqs, SITE_URL } from '@/lib/config'

// Below-the-fold client components — code-split out of the main bundle so
// their JS ships as separate chunks instead of the main page bundle.
// ssr:true (default) keeps them in the initial HTML for SEO/no-JS visibility.
const FAQAccordion = dynamic(() => import('@/components/FAQAccordion'))
const FourWeekApplicationForm = dynamic(() => import('@/components/FourWeekApplicationForm'))

const title = 'Private 4-Week Emotional & Life Rebuilding Experience'
const description =
  'Apply for one of three selected participant places in a private four-week online coaching experience with SAL Ray and the S.T.A.B.L.E. Method.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/4-week-experience/` },
  openGraph: {
    title: 'Private 4-Week Emotional & Life Rebuilding Experience',
    description: 'Four private online sessions over four consecutive weeks for three selected participants.',
    url: `${SITE_URL}/4-week-experience/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  // Temporary, capacity-limited campaign page — see brief section 11. Stays
  // reachable via menu/ads/direct link without creating a stale search result
  // once the three places are filled.
  robots: 'noindex, follow',
}

const recognitionPoints = [
  'You keep thinking through the same issue without reaching clarity.',
  'You understand what should change but struggle to respond differently.',
  'You repeat the same boundary, relationship, or emotional cycle.',
  'You feel stuck between who you have been and how you want to live.',
  'You have been carrying too much internally for too long.',
]

const experienceCards = [
  { title: '4 Private Sessions', body: 'One private, one-to-one online coaching session each week.' },
  {
    title: '4 Consecutive Weeks',
    body: 'A continuous process designed to create focus, momentum, and accountability.',
  },
  {
    title: 'Personalized Focus',
    body: 'The work is shaped around the pattern, priority, and change you want to address.',
  },
  {
    title: 'Structured Framework',
    body: 'Sessions are guided by the S.T.A.B.L.E. Method rather than generic advice or temporary motivation.',
  },
]

const fourWeekPath = [
  {
    week: 'Week 1',
    title: 'Clarify what is happening now',
    body: 'Identify the current concern, the situations surrounding it, and the change you most want to create.',
  },
  {
    week: 'Week 2',
    title: 'Recognize the pattern beneath it',
    body: 'Explore what continues to repeat, what triggers it, and what may be reinforcing the same response.',
  },
  {
    week: 'Week 3',
    title: 'Build a more stable response',
    body: 'Strengthen awareness, boundaries, self-trust, and the internal structure needed to respond differently.',
  },
  {
    week: 'Week 4',
    title: 'Integrate the next steps',
    body: 'Translate what you have understood into practical choices, daily application, and a clearer direction forward.',
  },
]

const fitFor = [
  'You are 18 or older.',
  'You are continuing to function in daily life but feel internally stuck or unstable.',
  'You have one real issue, pattern, or area of life you want to work on.',
  'You are willing to examine your own responses, choices, and patterns honestly.',
  'You can attend one private online session each week for four consecutive weeks.',
  'You understand that coaching requires active participation, not passive advice.',
]

const notFitFor = [
  'You are in immediate crisis, in danger, or require emergency support.',
  'You are seeking diagnosis, psychotherapy, psychiatric care, or medical treatment.',
  'You are looking for a quick fix or a guaranteed result.',
  'You want one isolated session but cannot commit to the full four weeks.',
  'You cannot keep the same weekly time for four consecutive weeks.',
  'You are applying mainly because someone else wants you to participate.',
]

const commitmentItems = [
  'Schedule all four sessions before the experience begins.',
  'Join each session on time from a quiet, private place with reliable internet.',
  'Provide at least 24 hours’ notice if a schedule change is unavoidable.',
  'Understand that missed sessions and late cancellations are not automatically replaced and may end participation.',
  'Participate actively, reflect honestly, and apply what is discussed between sessions.',
  'Provide honest feedback after the fourth session. A public testimonial is never required.',
]

const selectionSteps = [
  {
    step: '1',
    title: 'Submit your application',
    body: 'Answer the short questions thoughtfully and confirm that you can make the four-week commitment.',
  },
  {
    step: '2',
    title: 'Application review',
    body: 'SAL Ray reviews each application personally. If your application appears to be a strong fit, you will be contacted by email within three business days.',
  },
  {
    step: '3',
    title: 'Brief fit conversation',
    body: 'Potential participants are invited to a short 15-minute video conversation to confirm fit, expectations, and scheduling.',
  },
  {
    step: '4',
    title: 'Final selection and scheduling',
    body: 'If selected, you will receive the participant agreement and schedule all four private sessions before beginning.',
  },
]

function ClosedState() {
  return (
    <main className="max-w-content mx-auto px-6 py-24 md:py-32 text-center bg-offwhite">
      <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-4">APPLICATIONS ARE CURRENTLY CLOSED</p>
      <h1 className="font-display text-4xl md:text-5xl leading-tight text-charcoal mb-6 max-w-2xl mx-auto">
        The three participant places have been filled.
      </h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-xl mx-auto mb-10">
        Applications for the current Private 4-Week Emotional &amp; Life Rebuilding Experience are now closed. If you
        would like to explore private coaching with SAL Ray outside this limited experience, you can schedule an
        initial consultation.
      </p>
      <Link
        href="/consultation/"
        className="inline-block font-body text-sm font-medium bg-orange text-offwhite px-8 py-3.5 rounded-md hover:bg-charcoal transition-colors"
      >
        Schedule an Initial Consultation
      </Link>
    </main>
  )
}

export default function FourWeekExperiencePage() {
  if (fourWeekExperience.status === 'closed') {
    return <ClosedState />
  }

  const schema = getFourWeekExperienceSchema(fourWeekFaqs)

  return (
    <>
      <SchemaOrg data={schema} />
      <TrackMetaEventOnMount event="ViewContent" />

      {/* 1. Hero */}
      <section className="bg-offwhite">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3">
              No cost &middot; Selecting 3 Participants
            </p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight text-charcoal mb-4">
              A Private 4-Week Emotional &amp; Life Rebuilding Experience
            </h1>
            <p className="font-body text-lg text-charcoal/80 leading-relaxed mb-6">
              You look fine on the outside. Inside, you feel stuck.
            </p>
            <p className="font-body text-charcoal/70 mb-8">
              Four private online sessions with SAL Ray. One each week, for four weeks. At no cost for the three
              people selected.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#application"
                data-event="four_week_apply_click"
                className="inline-block font-body text-sm font-medium bg-orange text-offwhite px-6 py-3.5 rounded-md hover:bg-charcoal transition-colors"
              >
                Apply for the 4-Week Experience
              </a>
              <a
                href="#how-it-works"
                className="inline-block font-body text-sm font-medium border border-orange text-orange px-6 py-3.5 rounded-md hover:bg-orange hover:text-offwhite transition-colors"
              >
                See How It Works
              </a>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/hero/hero-desktop.jpg"
              alt="SAL Ray, Emotional & Life Rebuilding Coach."
              width={800}
              height={960}
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* 2. Recognition */}
      <section className="bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-8 max-w-2xl">
            You are still functioning. But something inside may no longer feel steady.
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="font-body text-charcoal/85 leading-relaxed mb-5">
                You may be working, caring for others, meeting responsibilities, and doing what needs to be done. At
                the same time, your mind may feel overloaded, your direction may feel unclear, or the same emotional
                and relational patterns may continue to repeat.
              </p>
              <p className="font-body text-charcoal/85 leading-relaxed">
                This experience is for people who are ready to look beyond the surface-level problem and understand
                the pattern beneath what keeps happening.
              </p>
            </div>
            <ul className="grid gap-3">
              {recognitionPoints.map((point) => (
                <li key={point} className="font-body text-charcoal/85 leading-relaxed pl-5 border-l-2 border-aqua">
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <p className="font-body text-charcoal/70 leading-relaxed mt-10 max-w-2xl">
            You do not need to arrive with a perfect explanation. You do need one real area of your life that you are
            ready to examine and work on.
          </p>
        </div>
      </section>

      {/* 3. Experience overview */}
      <section id="how-it-works" className="bg-offwhite">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-4 max-w-2xl">
            Four weeks of focused, private coaching.
          </h2>
          <p className="font-body text-charcoal/80 leading-relaxed max-w-2xl mb-10">
            This is not a one-time motivational conversation. The four sessions are designed as one continuous
            process, allowing each week to build on what became clearer in the week before.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {experienceCards.map((card) => (
              <div key={card.title} className="border border-charcoal/10 rounded-lg p-6">
                <h3 className="font-display text-lg text-charcoal mb-2">{card.title}</h3>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 max-w-2xl">
            <p className="font-body text-charcoal/90 leading-relaxed">
              <strong className="text-orange">Selected participants will receive the complete four-week experience
              at no cost.</strong>
            </p>
            <p className="font-body text-charcoal/70 leading-relaxed text-sm">
              Because this is a limited experience, participation requires consistent attendance, active involvement,
              and honest feedback at the end of the four weeks. A testimonial is never required.
            </p>
          </div>
        </div>
      </section>

      {/* 4. The four-week path */}
      <section className="bg-pale-orange">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-4 max-w-2xl">
            What the four weeks may look like
          </h2>
          <p className="font-body text-charcoal/80 leading-relaxed max-w-2xl mb-10">
            The structure is consistent, but the application is personal. The exact emphasis will depend on your
            situation, your priorities, and what becomes clear during the process.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {fourWeekPath.map((item) => (
              <div key={item.week} className="border border-charcoal/10 rounded-lg p-6">
                <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">{item.week}</p>
                <h3 className="font-display text-xl text-charcoal mb-2">{item.title}</h3>
                <p className="font-body text-charcoal/70 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="font-body text-xs text-charcoal/50 leading-relaxed mt-8 max-w-2xl">
            This outline describes the direction of the work, not a guaranteed outcome or a rigid weekly formula.
          </p>
        </div>
      </section>

      {/* 5. The S.T.A.B.L.E. Method */}
      <section className="bg-offwhite">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-4 max-w-2xl">
            The S.T.A.B.L.E. Method
          </h2>
          <p className="font-body text-charcoal/80 leading-relaxed max-w-2xl mb-10">
            The S.T.A.B.L.E. Method is SAL Ray&apos;s structured, non-clinical framework for recognizing emotional
            patterns, rebuilding internal stability, and translating insight into sustainable changes in daily life.
          </p>
          <div className="grid gap-4 mb-10">
            {stableMethod.letters.map((item) => (
              <div key={item.letter} className="flex gap-5 border-b border-charcoal/10 pb-4">
                <span className="font-display text-3xl text-aqua w-10 shrink-0">{item.letter}</span>
                <div>
                  <h3 className="font-display text-lg text-charcoal mb-1">{item.name}</h3>
                  <p className="font-body text-charcoal/70 leading-relaxed text-sm">{item.shortDescription}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="font-body text-charcoal/70 leading-relaxed max-w-2xl">
            The method provides structure without forcing every person into the same process. The framework remains
            consistent. The application remains personal.
          </p>
        </div>
      </section>

      {/* 6. About SAL Ray */}
      <section className="bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24 grid md:grid-cols-[300px_1fr] gap-12 items-start">
          <Image
            src="/images/about/sal-ray-portrait.jpg"
            alt="SAL Ray in a private coaching setting."
            width={420}
            height={504}
            loading="lazy"
            className="w-full h-auto object-cover rounded-lg"
          />
          <div>
            <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-6">
              A calm, structured approach with SAL Ray.
            </h2>
            <p className="font-body text-charcoal/85 leading-relaxed mb-5">
              SAL Ray is an Emotional &amp; Life Rebuilding Coach who helps adults recognize the deeper patterns
              keeping them stuck. His work combines precise pattern recognition, structured personal development,
              and practical, non-clinical tools designed to support clarity, stability, and responsible forward
              movement.
            </p>
            <p className="font-body text-charcoal/85 leading-relaxed mb-6">
              He does not offer vague promises or one-size-fits-all advice. The work begins by understanding what is
              happening, then identifying what needs to be rebuilt so the person can move forward with greater
              clarity, stability, and responsibility.
            </p>
            <Link href="/about/" className="font-body text-sm text-aqua underline underline-offset-2">
              Learn More About SAL Ray
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Who it is for / not for */}
      <section className="bg-offwhite">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-10 max-w-2xl">
            Is this experience a fit for you?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-display text-xl text-charcoal mb-4">This experience may be right for you if:</h3>
              <ul className="grid gap-3">
                {fitFor.map((item) => (
                  <li key={item} className="font-body text-charcoal/85 leading-relaxed pl-5 border-l-2 border-aqua">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl text-charcoal mb-4">This experience is not appropriate if:</h3>
              <ul className="grid gap-3">
                {notFitFor.map((item) => (
                  <li key={item} className="font-body text-charcoal/85 leading-relaxed pl-5 border-l-2 border-orange">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Participant commitment */}
      <section className="bg-pale-orange">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-4 max-w-2xl">
            Four weeks means four weeks.
          </h2>
          <p className="font-body text-charcoal/80 leading-relaxed max-w-2xl mb-10">
            The continuity is part of the process. Selected participants must be able to attend one private session
            each week for four consecutive weeks.
          </p>
          <ul className="grid gap-3 max-w-2xl mb-10">
            {commitmentItems.map((item) => (
              <li key={item} className="font-body text-charcoal/85 leading-relaxed pl-5 border-l-2 border-aqua">
                {item}
              </li>
            ))}
          </ul>
          <p className="font-body text-charcoal bg-offwhite/40 border border-charcoal/15 rounded-lg p-6 max-w-2xl leading-relaxed">
            If you already know that you cannot protect one session each week, please do not apply for this round.
          </p>
        </div>
      </section>

      {/* 9. Selection process */}
      <section className="bg-offwhite">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-10 max-w-2xl">
            How selection works
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {selectionSteps.map((item) => (
              <div key={item.step}>
                <span className="font-display text-3xl text-aqua block mb-3">{item.step}</span>
                <h3 className="font-display text-lg text-charcoal mb-2">{item.title}</h3>
                <p className="font-body text-charcoal/70 leading-relaxed text-sm">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="font-body text-charcoal/70 leading-relaxed max-w-2xl">
            Only three participants will be selected. Selection is based on fit, readiness, availability, and whether
            the focus is appropriate for non-clinical coaching — not on the severity of a person&apos;s story.
          </p>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-10 max-w-2xl">
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={fourWeekFaqs} />
        </div>
      </section>

      {/* 11. Application form */}
      <section id="application" className="bg-offwhite">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-4 max-w-2xl">
            Apply for one of the 3 participant places
          </h2>
          <p className="font-body text-charcoal/80 leading-relaxed max-w-2xl mb-10">
            Take a few minutes to answer thoughtfully. Short, specific answers are more useful than polished answers.
            SAL Ray reviews applications personally. If your application appears to be a strong fit, you will be
            contacted by email within three business days.
          </p>
          <FourWeekApplicationForm />
        </div>
      </section>
    </>
  )
}
