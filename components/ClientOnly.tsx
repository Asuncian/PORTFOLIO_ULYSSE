'use client'
import dynamic from 'next/dynamic'

// Browser-only pieces. Next 15 only allows `ssr: false` inside a Client Component.
// Three.js loads only after browser idle - avoids blocking first paint
export const DeferredBackground = dynamic(() => import('@/components/DeferredBackground'), { ssr: false })
export const Cursor             = dynamic(() => import('@/components/Cursor'),             { ssr: false })
export const TechCarousel       = dynamic(() => import('@/components/TechCarousel'),       { ssr: false })
