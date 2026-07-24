import type { Metadata } from 'next'
import Link from 'next/link'
import SchemaOrg from '@/components/SchemaOrg'
import ScrollDepthTrigger from '@/components/ScrollDepthTrigger'
import { getStableMethodSchema } from '@/lib/schema'
import { ctas, stableMethod, business, clinicalDisclaimer, crisisResource, SITE_URL } from '@/lib/config'

const title = 'The S.T.A.B.L.E. Method | Emotional & Life Rebuilding | Sal Ray'
const description =
  "Discover the S.T.A.B.L.E. Method, Sal Ray's structured two-phase framework for identifying emotional patterns, rebuilding internal stability, and supporting sustainable personal change."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/stable-method/` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/stable-method/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

const phaseOneLetters = stableMethod.letters.filter((l) => l.phase === 1)
const phaseTwoLetters = stableMethod.letters.filter((l) => l.phase === 2)

const differentiators = [
  {
    name: 'Pattern-Focused',
    copy: 'The method looks for recurring emotional structures rather than treating every difficulty as an unrelated event.',
  },
  {
    name: 'Structured but Personalized',
    copy: "The framework provides direction, while the application is adapted to the individual's circumstances, priorities, and pace.",
  },
  {
    name: 'Awareness Connected to Action',
    copy: 'Understanding is used as a foundation for developing healthier responses in everyday life.',
  },
  {
    name: 'Rebuilding-Oriented',
    copy: 'The process does not stop after identifying the problem. It moves toward strengthening internal stability and practical application.',
  },
  {
    name: 'Focused on Sustainability',
    copy: "The method emphasizes the person's ability to maintain progress, respond to future challenges, and continue developing beyond the initial work.",
  },
]

const applicationSteps = [
  {
    step: 'Step 1',
    name: 'Initial Consultation',
    copy: 'Clarify the current concern, begin identifying patterns, and determine the appropriate direction.',
  },
  {
    step: 'Step 2',
    name: 'Personalized Rebuilding Process',
    copy: "Apply the relevant elements of the S.T.A.B.L.E. Method according to the person's priorities and needs.",
  },
  {
    step: 'Step 3',
    name: 'Integration and Continuity',
    copy: 'Reinforce new responses and support the application of greater stability in everyday life.',
  },
]

const onThisPage = [
  { href: '#why-created', label: 'Why the Method Exists' },
  { href: '#six-elements', label: 'The Six Elements' },
  { href: '#two-phases', label: 'The Two Phases' },
  { href: '#how-applied', label: 'How It Is Applied' },
  { href: '#not', label: 'Professional Boundaries' },
]

export default function StableMethodPage() {
  const schema = getStableMethodSchema()

  return (
    <>
      <SchemaOrg data={schema} />
      <ScrollDepthTrigger threshold={0.75} event="stable_method_scroll_75" />

      <main className="max-w-content mx-auto px-6 py-16 md:py-24">
        {/* SECTION 1 — Hero */}
        <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-6 max-w-2xl">The S.T.A.B.L.E. Method</h1>
        <p className="font-body text-lg text-charcoal/85 leading-relaxed max-w-2xl mb-6">
          A structured framework for identifying emotional patterns, rebuilding internal stability, and creating
          sustainable change in daily life.
        </p>
        <p className="font-body text-charcoal/80 leading-relaxed max-w-2xl mb-4">
          Created by {business.nome}, the S.T.A.B.L.E. Method provides a clear process for understanding the
          emotional patterns that may be influencing your thoughts, decisions, relationships, and direction in life.
          The method moves beyond temporary motivation by helping you recognize what is happening internally,
          understand the structure behind recurring patterns, and begin rebuilding from a more stable foundation.
        </p>
        <p className="font-body text-sm uppercase tracking-widest text-aqua mb-8">
          A two-phase process for Emotional &amp; Life Rebuilding
        </p>

        <div className="flex flex-wrap items-center gap-6 mb-16">
          <Link
            href="/consultation/"
            data-event="stable_method_hero_consultation_click"
            className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
          >
            {ctas.primary}
          </Link>
          <a href="#six-elements" className="font-body text-sm text-aqua underline underline-offset-2 hover:text-orange">
            Explore the Six Elements
          </a>
        </div>

        {/* On this page */}
        <nav aria-label="On this page" className="mb-16 border border-charcoal/10 rounded-lg p-6 max-w-md">
          <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">On This Page</p>
          <ul className="font-body text-sm text-charcoal/80 space-y-2">
            {onThisPage.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-orange underline underline-offset-2">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* SECTION 2 — Why the method was created */}
        <section id="why-created" className="max-w-2xl mb-16 scroll-mt-24">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-4">
            Why I Created the S.T.A.B.L.E. Method
          </h2>
          <p className="font-body text-charcoal/85 leading-relaxed mb-4">
            Many people know that something in their life needs to change, but they do not always understand the
            emotional pattern beneath the problem. They may experience anxiety, emotional overload, overthinking,
            relationship difficulties, low confidence, repeated setbacks, or a persistent sense of being stuck. They
            often try to correct one behavior at a time without identifying the internal structure that keeps
            recreating the same experience.
          </p>
          <p className="font-body text-charcoal/85 leading-relaxed">
            I created the S.T.A.B.L.E. Method to bring greater clarity and structure to that process. Rather than
            focusing only on what is visible on the surface, the method helps identify recurring emotional patterns,
            understand how they influence daily life, and support the rebuilding of a more stable internal
            foundation. The goal is not simply to create a temporary emotional improvement. The goal is to help the
            person understand what is happening, develop healthier internal responses, and translate that work into
            sustainable changes in everyday life.
          </p>
        </section>

        {/* SECTION 3 — What the method is */}
        <section className="max-w-2xl mb-16">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-4">What Is the S.T.A.B.L.E. Method?</h2>
          <p className="font-body text-charcoal/85 leading-relaxed mb-4">
            The S.T.A.B.L.E. Method is a structured, non-clinical framework used to help individuals recognize
            emotional patterns, strengthen internal stability, and apply meaningful changes in their daily lives. It
            is organized around six interconnected elements. Each element represents an important part of the
            process, beginning with pattern recognition and progressing toward sustainable personal development.
          </p>
          <p className="font-body text-charcoal/85 leading-relaxed mb-4">
            The method is not applied as a rigid formula. Each person brings a different emotional history, current
            situation, set of priorities, and pace of development. The framework provides direction, while the
            application is adapted to the individual.
          </p>
          <p className="font-body text-lg text-charcoal italic border-l-2 border-orange pl-4">
            The structure remains consistent. The application remains personal.
          </p>
        </section>

        {/* SECTION 4 — The Six Elements */}
        <section id="six-elements" className="mb-16 scroll-mt-24">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-8">The Six Elements</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stableMethod.letters.map((item) => (
              <details
                key={item.letter}
                className="group border border-charcoal/10 rounded-lg p-5 open:bg-pale-aqua/40"
              >
                <summary className="cursor-pointer list-none flex flex-col gap-2">
                  <span className="flex items-center justify-between">
                    <span className="font-display text-3xl text-orange">{item.letter}</span>
                    <span
                      aria-hidden="true"
                      className="font-body text-aqua text-xl shrink-0 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                  <h3 className="font-display text-lg text-charcoal">{item.name}</h3>
                  <span className="font-body text-sm text-charcoal/70 leading-relaxed">{item.shortDescription}</span>
                </summary>
                <div className="mt-4 pt-4 border-t border-charcoal/10">
                  {item.expandedExplanation.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="font-body text-sm text-charcoal/80 leading-relaxed mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                  <p className="font-body text-sm text-aqua italic mt-3">{item.coreQuestion}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* SECTION 5 — How the elements connect */}
        <section className="max-w-2xl mb-16">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-4">How the Six Elements Connect</h2>
          <p className="font-body text-charcoal/85 leading-relaxed mb-6">
            The six elements are designed to build on one another. The process begins by recognizing what is
            happening and understanding the emotional structure beneath it. It then moves toward strengthening
            internal stability, applying healthier responses in daily life, and sustaining that development over
            time. Although the framework follows a logical progression, personal development is not always
            perfectly linear — some elements may need to be revisited as new situations, patterns, or priorities
            emerge.
          </p>
          <div className="flex flex-wrap items-center gap-2 mb-6" aria-label="See, Trace, Awaken, Build, Live, Evolve">
            {stableMethod.letters.map((item, index) => (
              <span key={item.letter} className="flex items-center gap-2">
                <span className="font-body text-sm border border-aqua/40 rounded-full px-3 py-1 text-charcoal/80">
                  {item.letter} — {item.name}
                </span>
                {index < stableMethod.letters.length - 1 && (
                  <span aria-hidden="true" className="text-charcoal/40">
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
          <p className="font-body text-charcoal italic border-l-2 border-orange pl-4">
            Recognition creates clarity. Stability creates the foundation. Application creates change.
          </p>
        </section>

        {/* SECTION 6 — Two-phase intro */}
        <section id="two-phases" className="mb-16 scroll-mt-24">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-4 max-w-2xl">
            The S.T.A.B.L.E. Method Is Applied in Two Phases
          </h2>
          <p className="font-body text-charcoal/85 leading-relaxed max-w-2xl mb-4">
            The six elements of the S.T.A.B.L.E. Method are applied through two primary phases. The first phase
            focuses on identifying and understanding the emotional patterns affecting the individual&apos;s current
            life. The second phase focuses on rebuilding the internal structure needed to create healthier and more
            sustainable responses. This distinction is important because it prevents the process from moving too
            quickly into solutions before the underlying pattern has been clearly understood.
          </p>
          <p className="font-body text-lg text-charcoal italic border-l-2 border-orange pl-4 max-w-2xl mb-8">
            First understand. Then rebuild.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-pale-aqua rounded-lg p-6">
              <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">Phase One</p>
              <h3 className="font-display text-xl text-charcoal">Emotional Pattern Identification</h3>
            </div>
            <div className="bg-pale-orange rounded-lg p-6">
              <p className="font-body text-xs uppercase tracking-widest text-orange mb-2">Phase Two</p>
              <h3 className="font-display text-xl text-charcoal">Emotional &amp; Life Rebuilding</h3>
            </div>
          </div>
        </section>

        {/* SECTION 7 — Phase One detail */}
        <section className="max-w-2xl mb-16">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-2">
            Phase One: Emotional Pattern Identification
          </h2>
          <p className="font-body text-charcoal/70 italic mb-4">
            Before a person can build a different emotional response, the existing pattern must be clearly
            recognized and understood.
          </p>
          <p className="font-body text-charcoal/85 leading-relaxed mb-4">
            Phase One focuses on identifying the emotional patterns, recurring reactions, internal conflicts, and
            behavioral cycles affecting the individual&apos;s current situation. During this phase, {business.nome}{' '}
            works to understand what the person is experiencing, how the difficulty appears in daily life, what
            tends to trigger it, and which patterns may be connecting different experiences. The objective is to
            create clarity — many people arrive knowing the symptom they want to change but not yet understanding
            the deeper emotional structure influencing it.
          </p>

          <h3 className="font-display text-lg text-charcoal mb-3">Phase One May Include</h3>
          <ul className="font-body text-charcoal/85 leading-relaxed list-disc list-inside space-y-1 mb-6">
            <li>Clarifying the person&apos;s current emotional challenge</li>
            <li>Identifying recurring triggers and reactions</li>
            <li>Recognizing behavioral or relational cycles</li>
            <li>Exploring the emotional meaning attached to specific situations</li>
            <li>Identifying internal beliefs and protective responses</li>
            <li>Understanding how the pattern affects decisions and daily life</li>
            <li>Establishing the person&apos;s most important priorities</li>
            <li>Determining whether {business.nome}&apos;s work is appropriate for the situation</li>
          </ul>

          <h3 className="font-display text-lg text-charcoal mb-3">Relationship With the Six Elements</h3>
          <p className="font-body text-charcoal/85 leading-relaxed mb-6">
            Phase One primarily emphasizes:{' '}
            {phaseOneLetters.map((l) => `${l.letter} — ${l.name}`).join(', ')}.
          </p>

          <p className="font-body text-charcoal/85 leading-relaxed">
            By the end of Phase One, the individual should have greater clarity about what is happening, what may
            be maintaining the pattern, and what needs to be rebuilt moving forward. The initial consultation
            begins this identification process.
          </p>
        </section>

        {/* SECTION 8 — Phase Two detail */}
        <section className="max-w-2xl mb-16">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-2">
            Phase Two: Emotional &amp; Life Rebuilding
          </h2>
          <p className="font-body text-charcoal/70 italic mb-4">
            Once the relevant patterns become clearer, the process moves from recognition into rebuilding.
          </p>
          <p className="font-body text-charcoal/85 leading-relaxed mb-4">
            Phase Two focuses on strengthening the person&apos;s internal foundation and translating new awareness
            into practical changes. Depending on the individual&apos;s needs, this may involve developing greater
            emotional stability, improving personal boundaries, strengthening confidence, changing habitual
            responses, approaching relationships differently, or making decisions with greater clarity. The work is
            adapted to the person&apos;s priorities and pace — the purpose is not to create a temporary motivational
            state, but to support the development of healthier and more sustainable emotional and behavioral
            patterns.
          </p>

          <h3 className="font-display text-lg text-charcoal mb-3">Phase Two May Include</h3>
          <ul className="font-body text-charcoal/85 leading-relaxed list-disc list-inside space-y-1 mb-6">
            <li>Strengthening emotional stability</li>
            <li>Developing greater self-awareness and self-trust</li>
            <li>Improving responses to emotional triggers</li>
            <li>Building healthier boundaries</li>
            <li>Supporting more intentional decisions</li>
            <li>Improving communication and relationship patterns</li>
            <li>Reinforcing confidence and personal direction</li>
            <li>Applying insights to everyday situations</li>
            <li>Establishing practices that support continuity</li>
            <li>Preparing for future challenges without returning automatically to old patterns</li>
          </ul>

          <h3 className="font-display text-lg text-charcoal mb-3">Relationship With the Six Elements</h3>
          <p className="font-body text-charcoal/85 leading-relaxed mb-6">
            Phase Two primarily emphasizes:{' '}
            {phaseTwoLetters.map((l) => `${l.letter} — ${l.name}`).join(', ')}.
          </p>

          <p className="font-body text-charcoal/85 leading-relaxed">
            The objective of Phase Two is to help the person move from understanding the pattern to living with
            greater stability, clarity, and alignment.
          </p>
        </section>

        {/* SECTION 9 — How the method is applied */}
        <section id="how-applied" className="mb-16 scroll-mt-24">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-4 max-w-2xl">How the Method Is Applied</h2>
          <p className="font-body text-charcoal/85 leading-relaxed max-w-2xl mb-4">
            The S.T.A.B.L.E. Method begins with the initial consultation. This conversation provides an opportunity
            to understand the person&apos;s current concerns, identify relevant emotional patterns, clarify
            priorities, and determine whether {business.nome}&apos;s approach is appropriate for the situation. When
            ongoing work is recommended and accepted, the method continues through a personalized process based on
            the patterns and priorities identified. The framework remains consistent, but the pace, emphasis, and
            application vary from person to person.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {applicationSteps.map((step) => (
              <div key={step.step} className="border border-charcoal/10 rounded-lg p-6">
                <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">{step.step}</p>
                <h3 className="font-display text-lg text-charcoal mb-2">{step.name}</h3>
                <p className="font-body text-sm text-charcoal/80 leading-relaxed">{step.copy}</p>
              </div>
            ))}
          </div>

          <p className="font-body text-sm text-charcoal/70 max-w-2xl italic">
            Each letter represents an essential element of the framework, not a predetermined number of sessions.
          </p>
        </section>

        {/* SECTION 10 — What makes it different */}
        <section className="mb-16">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-4 max-w-2xl">
            What Makes the S.T.A.B.L.E. Method Different?
          </h2>
          <p className="font-body text-charcoal/85 leading-relaxed max-w-2xl mb-8">
            The S.T.A.B.L.E. Method is designed to connect emotional understanding with practical rebuilding. It
            does not focus exclusively on discussing the past, providing temporary motivation, or addressing
            isolated symptoms without examining the pattern connecting them. Its structure helps keep the process
            focused while still allowing the work to remain personal and adaptable.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {differentiators.map((d, index) => (
              <div key={d.name} className="border border-charcoal/10 rounded-lg p-5">
                <h3 className="font-display text-lg text-charcoal mb-2">
                  {index + 1}. {d.name}
                </h3>
                <p className="font-body text-sm text-charcoal/80 leading-relaxed">{d.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 11 — What the method is not */}
        <section id="not" className="max-w-2xl mb-16 bg-pale-orange rounded-lg p-8 scroll-mt-24">
          <h2 className="font-display text-2xl text-charcoal mb-4">What the S.T.A.B.L.E. Method Is Not</h2>
          <p className="font-body text-charcoal/85 leading-relaxed mb-4">
            The S.T.A.B.L.E. Method is a non-clinical framework for emotional awareness, personal development, and
            life rebuilding. {clinicalDisclaimer}
          </p>
          <p className="font-body text-charcoal/85 leading-relaxed mb-4">
            No specific result, cure, or outcome is guaranteed. Individual experiences and outcomes vary.
          </p>
          <p className="font-body text-sm text-charcoal/70 leading-relaxed">{crisisResource}</p>
        </section>

        {/* SECTION 12 — FAQ transition */}
        <section className="max-w-2xl mb-16">
          <h2 className="font-display text-xl text-charcoal mb-3">Questions About the Method?</h2>
          <p className="font-body text-charcoal/80 leading-relaxed mb-3">
            The FAQ page explains what to expect from the initial consultation, how the process is structured, who
            the work may be appropriate for, and the professional boundaries of the service.
          </p>
          <Link
            href="/faq/"
            data-event="stable_method_faq_click"
            className="font-body text-sm text-aqua underline underline-offset-2 hover:text-orange"
          >
            Visit the FAQ Page
          </Link>
        </section>

        {/* SECTION 13 — Final CTA */}
        <section className="bg-pale-aqua rounded-lg p-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-4 max-w-xl mx-auto">
            Begin by Understanding the Pattern
          </h2>
          <p className="font-body text-charcoal/85 leading-relaxed max-w-xl mx-auto mb-8">
            Every rebuilding process begins with clarity. The initial consultation is the first step in
            understanding your current concern, identifying the emotional patterns that may be influencing it, and
            determining whether the S.T.A.B.L.E. Method is appropriate for your situation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/consultation/"
              data-event="stable_method_final_consultation_click"
              className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
            >
              {ctas.primary}
            </Link>
            <Link
              href="/community/"
              data-event="stable_method_community_click"
              className="inline-block font-body text-sm font-medium border border-aqua text-charcoal px-6 py-3 rounded-md hover:bg-aqua transition-colors"
            >
              {ctas.secondary}
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
