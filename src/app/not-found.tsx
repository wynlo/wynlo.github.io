import Link from 'next/link'

export default function NotFound() {
  return <div className="container-page flex min-h-[65vh] flex-col justify-center py-20"><p className="eyebrow text-muted">404</p><h1 className="display mt-6 max-w-4xl text-4xl md:text-6xl">Page not found.</h1><Link href="/" className="text-link mt-10 self-start">Home <span>→</span></Link></div>
}
