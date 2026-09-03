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

const secondFoldSituations = [
  'You keep explaining your boundaries instead of simply holding them.',
  'You are tired of being the strong one while feeling uncertain inside.',
  'You keep repeating a relationship dynamic you promised yourself you would not repeat.',
  'You are entering a new chapter but do not yet know what you want.',
  'You second-guess decisions even after thinking about them carefully.',
  'You want to stop abandoning your own needs to keep peace with others.',
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
    title: 'Understand What Is Really Happening',
    body: 'Clarify the situation, the emotional pressure around it, and the change you most want to make.',
  },
  {
    week: 'Week 2',
    title: 'Identify the Pattern That Keeps Repeating',
    body: 'Recognize the triggers, reactions, relationship dynamics, and choices that keep taking you back to the same place.',
  },
  {
    week: 'Week 3',
    title: 'Practice a Steadier Way to Respond',
    body: 'Work on boundaries, emotional regulation, self-trust, and responding without automatically overgiving, withdrawing, or reacting.',
  },
  {
    week: 'Week 4',
    title: 'Move Forward With Clearer Choices',
    body: 'Turn the work into practical decisions, conversations, routines, and next steps for the life you are building.',
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
  'Participate actively, reflect honestly, and apply what is discussed between sessions.',
  'Provide honest feedback after the fourth session. A public testimonial is never required.',
]

const trustPoints = [
  {
    title: 'Private and one-to-one',
    body: 'Your experience is conducted privately with SAL Ray online.',
  },
  {
    title: 'No public testimonial required',
    body: 'Honest feedback is welcome, but a public testimonial is never required.',
  },
  {
    title: 'A fit conversation comes first',
    body: 'Selected applicants have a brief 15-minute conversation before any sessions are scheduled.',
  },
]

const afterApplySteps = [
  {
    step: '1',
    title: 'Submit your application',
    body: 'Answer a few short questions about your current focus, availability, and readiness for the four-week commitment.',
  },
  {
    step: '2',
    title: 'Application review',
    body: 'SAL Ray reviews each application personally. You will be contacted within three business days if your application appears to be a strong fit.',
  },
  {
    step: '3',
    title: 'Brief fit conversation',
    body: 'Potential participants are invited to a short 15-minute video conversation to confirm fit, expectations, scheduling, and next steps.',
  },
  {
    step: '4',
    title: 'Acceptance and scheduling',
    body: 'If selected, SAL Ray will contact you using the email address and mobile number provided in your application to confirm acceptance and schedule all four private sessions.',
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
              A Private 4-Week Experience for Women Ready to Stop Repeating the Same Patterns
            </h1>
            <p className="font-body text-lg text-charcoal/80 leading-relaxed mb-6">
              You may be functioning, caring for others, and keeping life moving — while privately feeling stuck in
              the same relationship, boundary, emotional, or decision-making patterns.
            </p>
            <p className="font-body text-charcoal/70 mb-8">
              This private online experience includes four focused sessions with SAL Ray to help you understand what
              keeps repeating, build a steadier response, and take practical next steps forward. Three participants
              will be selected at no cost.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#application"
                data-event="four_week_apply_click"
                className="inline-block font-body text-sm font-medium bg-orange text-offwhite px-6 py-3.5 rounded-md hover:bg-charcoal transition-colors"
              >
                See If This Experience Is a Fit
              </a>
              <a
                href="#how-it-works"
                className="inline-block font-body text-sm font-medium border border-orange text-orange px-6 py-3.5 rounded-md hover:bg-orange hover:text-offwhite transition-colors"
              >
                See How the Four Weeks Work
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

      {/* 1b. Second fold — identification copy (left) + application form
          (right on desktop, sequential on mobile). The form block is a
          duplicate of section 11 and must stay unchanged. */}
      <section className="bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-6">
                You May Be Functioning on the Outside — But Still Feeling Stuck Inside
              </h2>
              <p className="font-body text-charcoal/85 leading-relaxed mb-5">
                This experience may be especially relevant if you are in a season of life where you are questioning
                what comes next, re-evaluating your relationships, or realizing that years of putting everyone else
                first have made it difficult to hear your own needs.
              </p>
              <p className="font-body text-charcoal/85 leading-relaxed mb-6">
                You may be carrying responsibilities, showing up for work and family, and appearing strong to
                everyone around you. But privately, you may be tired of overthinking, overgiving, tolerating what no
                longer feels right, or repeating patterns you already understand.
              </p>
              <h3 className="font-display text-xl text-charcoal mb-4">This may be you if:</h3>
              <ul className="grid gap-3 mb-6">
                {secondFoldSituations.map((item) => (
                  <li key={item} className="font-body text-charcoal/85 leading-relaxed pl-5 border-l-2 border-aqua">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="font-body text-charcoal/70 leading-relaxed">
                You do not need to arrive with a perfect explanation. You do need one real area of your life that you
                are ready to examine and work on.
              </p>
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-4 max-w-2xl">
                Apply to Be Considered for the Private 4-Week Experience
              </h2>
              <p className="font-body text-charcoal/80 leading-relaxed max-w-2xl mb-4">
                Your answers do not need to be perfect or polished. They simply help SAL Ray understand whether this
                experience is appropriate for what you are currently facing.
              </p>
              <p className="font-body text-charcoal/70 leading-relaxed max-w-2xl mb-10">
                Applying does not commit you to coaching and does not guarantee selection. SAL Ray personally reviews
                each application. If your situation appears to be a fit, you will be invited to a brief 15-minute
                video conversation to discuss your focus, expectations, availability, and next steps.
              </p>
              <FourWeekApplicationForm />
            </div>
          </div>
        </div>
      </section>

      {/* 1d. What happens after you apply */}
      <section className="bg-offwhite">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-10 max-w-2xl">
            What Happens After You Apply?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {afterApplySteps.map((item) => (
              <div key={item.step}>
                <span className="font-display text-3xl text-aqua block mb-3">{item.step}</span>
                <h3 className="font-display text-lg text-charcoal mb-2">{item.title}</h3>
                <p className="font-body text-charcoal/70 leading-relaxed text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1c. Who this may serve */}
      <section className="bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-4 max-w-2xl">
            A Structured Experience for the Next Chapter of Your Life
          </h2>
          <p className="font-body text-charcoal/80 leading-relaxed max-w-2xl">
            This experience is open to adults, and it may be particularly meaningful for women in their 40s, 50s,
            and 60s who are ready to rebuild emotional steadiness, self-trust, healthier boundaries, and a clearer
            direction for the next chapter of life.
          </p>
        </div>
      </section>

      {/* 1e. The S.T.A.B.L.E. Method (moved up from its previous position
          further down the page, per Phase 4 — now sits right after the
          identification/application area instead of after the four-week
          path). */}
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

      {/* 3. Experience overview */}
      <section id="how-it-works" className="bg-pale-aqua">
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
            The structure is consistent, but the application is personal. Each week builds on the previous one,
            helping you move from understanding what keeps happening to making clearer, steadier choices in daily
            life.
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
            Because each session builds on the previous one, selected participants need to protect the same weekly
            time for four consecutive weeks. This commitment helps make the experience useful and respectful of
            everyone&apos;s time.
          </p>
          <ul className="grid gap-3 max-w-2xl mb-6">
            {commitmentItems.map((item) => (
              <li key={item} className="font-body text-charcoal/85 leading-relaxed pl-5 border-l-2 border-aqua">
                {item}
              </li>
            ))}
          </ul>
          <p className="font-body text-charcoal bg-offwhite/40 border border-charcoal/15 rounded-lg p-6 max-w-2xl leading-relaxed mb-10">
            Missed sessions and late cancellations may not be replaced and may end participation in the experience.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl">
            {trustPoints.map((point) => (
              <div key={point.title}>
                <h3 className="font-display text-lg text-charcoal mb-2">{point.title}</h3>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
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
            Apply to Be Considered for the Private 4-Week Experience
          </h2>
          <p className="font-body text-charcoal/80 leading-relaxed max-w-2xl mb-4">
            Your answers do not need to be perfect or polished. They simply help SAL Ray understand whether this
            experience is appropriate for what you are currently facing.
          </p>
          <p className="font-body text-charcoal/70 leading-relaxed max-w-2xl mb-10">
            Applying does not commit you to coaching and does not guarantee selection. SAL Ray personally reviews
            each application. If your situation appears to be a fit, you will be invited to a brief 15-minute video
            conversation to discuss your focus, expectations, availability, and next steps.
          </p>
          <FourWeekApplicationForm />
        </div>
      </section>
    </>
  )
}
