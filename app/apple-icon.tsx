import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{
        width: 180, height: 180,
        background: '#16a34a',
        borderRadius: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="120" height="120" viewBox="0 0 64 64" fill="none">
          <path d="M10 6H36C44.837 6 52 13.163 52 22C52 30.837 44.837 38 36 38H22L10 52V38C6 38 6 35 6 32V12C6 8.686 8.686 6 12 6H10Z"
            stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 18L28 26L40 18" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 18H40V32H16V18Z" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
    { ...size }
  )
}
