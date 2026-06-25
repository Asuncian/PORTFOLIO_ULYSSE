type BrandNameProps = {
  variant?: 'nav' | 'footer'
  className?: string
}

/** Nom affiché : prénom en avant-plan, nom de famille en style secondaire. */
export default function BrandName({ variant = 'nav', className = '' }: BrandNameProps) {
  const rootClass = variant === 'nav' ? 'brand-name brand-name--nav' : 'brand-name brand-name--footer'
  return (
    <span className={`${rootClass}${className ? ` ${className}` : ''}`}>
      <span className="brand-first">Ulysse</span>
      <span className="brand-last"> Goming-Jobert</span>
    </span>
  )
}
