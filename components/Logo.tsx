// LokalProfil logo – SVG recreation of the provided logo
// Icon: chat bubble with envelope/checkmark inside
// Colors: icon #16a34a gradient, text black

export default function Logo({ size = 'md', dark = false }: { size?: 'sm' | 'md' | 'lg' | 'xl'; dark?: boolean }) {
  const sizes = {
    sm: { icon: 24, text: 13, gap: 6 },
    md: { icon: 32, text: 17, gap: 8 },
    lg: { icon: 44, text: 24, gap: 10 },
    xl: { icon: 64, text: 34, gap: 14 },
  }
  const s = sizes[size]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      {/* Icon */}
      <svg width={s.icon} height={s.icon} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lp-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22c55e"/>
            <stop offset="100%" stopColor="#16a34a"/>
          </linearGradient>
        </defs>
        {/* Outer D-shape / chat bubble */}
        <path
          d="M10 6C10 6 10 6 10 6H36C44.837 6 52 13.163 52 22C52 30.837 44.837 38 36 38H22L10 52V38C10 38 6 38 6 32V12C6 8.686 8.686 6 12 6H10Z"
          stroke="url(#lp-grad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        />
        {/* Envelope flap */}
        <path
          d="M16 18L28 26L40 18"
          stroke="url(#lp-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        />
        {/* Envelope body */}
        <path
          d="M16 18H40V32H16V18Z"
          stroke="url(#lp-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"
        />
      </svg>
      {/* Text */}
      <span style={{
        fontSize: s.text,
        fontWeight: 700,
        color: dark ? '#fff' : '#0f172a',
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        LokalProfil
      </span>
    </div>
  )
}

// Icon only version for favicons, small spaces
export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="lp-icon-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22c55e"/>
          <stop offset="100%" stopColor="#16a34a"/>
        </linearGradient>
      </defs>
      <path
        d="M10 6H36C44.837 6 52 13.163 52 22C52 30.837 44.837 38 36 38H22L10 52V38C6 38 6 35 6 32V12C6 8.686 8.686 6 12 6H10Z"
        stroke="url(#lp-icon-grad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <path d="M16 18L28 26L40 18" stroke="url(#lp-icon-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 18H40V32H16V18Z" stroke="url(#lp-icon-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}
