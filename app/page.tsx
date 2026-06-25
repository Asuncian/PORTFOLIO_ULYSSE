import dynamic from 'next/dynamic'
import Nav        from '@/components/Nav'
import Hero       from '@/components/Hero'
import Stats      from '@/components/Stats'
import ForWho     from '@/components/ForWho'
import Services   from '@/components/Services'
import Solutions  from '@/components/Solutions'
import Projects   from '@/components/Projects'
import QuoteBand  from '@/components/QuoteBand'
import Method     from '@/components/Method'
import Faq        from '@/components/Faq'
import Contact    from '@/components/Contact'
import Footer     from '@/components/Footer'
import ScrollAnimator from '@/components/ScrollAnimator'

// Three.js loads only after browser idle - avoids blocking first paint
const DeferredBackground = dynamic(() => import('@/components/DeferredBackground'), { ssr: false })
const Cursor             = dynamic(() => import('@/components/Cursor'),          { ssr: false })
const TechCarousel       = dynamic(() => import('@/components/TechCarousel'),    { ssr: false })

export default function Home() {
  return (
    <>
      <DeferredBackground />
      <Cursor />
      <ScrollAnimator />
      <Nav />
      <main>
        <Hero />
        <TechCarousel />
        <Stats />
        <div className="divider" />
        <ForWho />
        <div className="divider" />
        <Services />
        <div className="divider" />
        <Solutions />
        <div className="divider" />
        <Projects />
        <div className="divider" />
        <QuoteBand />
        <div className="divider" />
        <Method />
        <div className="divider" />
        <Faq />
        <div className="divider" />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
