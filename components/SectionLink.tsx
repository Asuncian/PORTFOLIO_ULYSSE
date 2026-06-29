'use client'

import { navigateToSection, sectionHref } from '@/lib/scroll-section'
import { usePathname } from 'next/navigation'
import type { ComponentProps, MouseEvent } from 'react'

type Props = Omit<ComponentProps<'a'>, 'href'> & {
  sectionId: string
}

export default function SectionLink({ sectionId, onClick, children, ...rest }: Props) {
  const pathname = usePathname()
  const onHome = pathname === '/'

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    e.preventDefault()
    navigateToSection(sectionId, onHome)
  }

  return (
    <a href={sectionHref(sectionId, onHome)} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
