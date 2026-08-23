import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="max-w-content mx-auto px-6 py-24 text-center">
      <span className="font-body text-xs uppercase tracking-widest text-aqua">Error 404</span>
      <h1 className="font-display text-4xl text-charcoal mt-2 mb-6">Page not found</h1>
      <p className="font-body text-charcoal/80 leading-relaxed max-w-md mx-auto mb-8">
        The page you're looking for doesn't exist or has moved. You can head back home or explore the Resource
        Library.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/"
          className="font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/resources/"
          className="font-body text-sm font-medium border border-charcoal text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          Explore Resources
        </Link>
      </div>
    </main>
  )
}
