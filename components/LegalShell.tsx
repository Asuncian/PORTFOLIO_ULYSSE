import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import ScrollAnimator from '@/components/ScrollAnimator'
import type { ReactNode } from 'react'

const DeferredBackground = dynamic(() => import('@/components/DeferredBackground'), { ssr: false })
const Cursor = dynamic(() => import('@/components/Cursor'), { ssr: false })

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
