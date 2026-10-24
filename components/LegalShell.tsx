import { Cursor, DeferredBackground } from '@/components/ClientOnly'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import ScrollAnimator from '@/components/ScrollAnimator'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function LegalShell({ children }: Props) {
  return (
    <>
      <DeferredBackground />
      <Cursor />
      <ScrollAnimator />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
