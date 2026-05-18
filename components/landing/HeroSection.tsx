import Image from 'next/image'
import type { LandingEvent } from './types'
import { ASSET_HERO_BG_MAIN } from './assets'
import { resolveMediaUrl, isExternalUrl } from './sanitizeUrl'
import { BASE_PATH } from '@/lib/basePath'

/*
 * Figma node 5797:1357 — hero container: 690px tall
 * Figma node 5859:550  — text group at top: 346px, width: 708px
 *   "Zero1 presents" + bolt
 *   gap 24px
 *   flex-col gap-24:
 *     flex-col gap-12: wordmark (577×78.5) + subtitle (28px Inter Medium Italic white)
 *     gap 24px
 *     about paragraphs (18px #b7b5bb text-center)
 * Text overflows below the 690px image — page bg (#0f071a) = gradient end = seamless.
 *
 * Mobile: height 420px, text at top: 200px, bolt 65×13px, wordmark 176×24px, presents 16px
 *   subtitle at 14px below wordmark (gap 8px)
 */

const BOLT_MOBILE    = BASE_PATH + '/zero1-white-logo.svg'
const WORDMARK_MOBILE  = 'https://www.figma.com/api/mcp/asset/f05b23b1-bd08-488d-97a5-028d17e4f8a0' // Group8
const WORDMARK_DESKTOP = 'https://www.figma.com/api/mcp/asset/59f6740d-7f96-4a31-bb60-87f92ec2834e'

const DEFAULT_SUBTITLE = 'An offline community to solve REAL personal finance problems'

const DEFAULT_BULLETS = [
  'Quarterly meet-ups across up to 8 cities',
  'Topic-based events for focused learning',
  'Curated hands-on activities to build technical skills',
  'All earnings after covering event costs are donated to charity',
]

export function HeroSection({ event }: { event: LandingEvent }) {
  const heroImage = resolveMediaUrl(event.heroImageUrl) || ASSET_HERO_BG_MAIN
  const subtitle = event.settings?.heroSubtitle ?? DEFAULT_SUBTITLE
  const rawText = event.settings?.aboutText
  const bullets = rawText ? rawText.split('\n').filter(Boolean) : DEFAULT_BULLETS

  return (
    <>
      {/* ── Mobile hero — photo is absolutely positioned; text block drives height ── */}
      <div className="relative w-full md:hidden" style={{ background: '#0f071a' }}>
        {/* Photo — clipped to 377px, no orange tint (same as desktop) */}
        <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: 377 }}>
          <Image
            alt=""
            src={heroImage}
            fill
            priority
            unoptimized={isExternalUrl(heroImage)}
            sizes="100vw"
            className="pointer-events-none object-cover object-center"
          />
        </div>
        {/* Gradient — fades photo into page bg */}
        <div className="absolute left-0 right-0" style={{
          top: 97, height: 280,
          background: 'linear-gradient(0deg, #0f071a 0%, rgba(15,7,26,0.7) 50%, transparent 100%)',
        }} />

        {/* Text block — paddingTop positions it at y=136 (= Figma y=222 − nav 86px) */}
        <div className="relative flex flex-col items-center w-full px-4" style={{ paddingTop: 136, paddingBottom: 32, gap: 18 }}>
          {/* "Zero1 presents" + wordmark + subtitle */}
          <div className="flex flex-col items-center w-full" style={{ gap: 12 }}>
            {/*
              CSS-grid overlay: logo and "presents" share cell (1,1).
              Logo: 59.9×18.1px, mt:1.51px so its visual top aligns with presents glyph top.
              Presents: ml:62.15px so it starts right after the logo.
              Figma node 6120:7463
            */}
            <div style={{
              display: 'inline-grid',
              gridTemplateColumns: 'max-content',
              gridTemplateRows: 'max-content',
              placeItems: 'start',
              lineHeight: 0,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Zero1"
                src={BOLT_MOBILE}
                style={{ gridColumn: 1, gridRow: 1, width: 59.9, height: 18.1, marginTop: 1.51 }}
              />
              <p style={{
                gridColumn: 1, gridRow: 1,
                marginLeft: 62.15, marginTop: 0,
                fontFamily: 'Inter,sans-serif',
                fontStyle: 'italic',
                fontSize: 17.9,
                lineHeight: 1,
                color: '#fff',
                whiteSpace: 'nowrap',
              }}>
                presents
              </p>
            </div>
            <div className="flex flex-col items-center w-full" style={{ gap: 8 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="The Inner Circle" src={WORDMARK_MOBILE} style={{ height: 23.98, width: 176.27, display: 'block' }} />
              <p className="text-center w-full" style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontStyle: 'italic', fontSize: 14, lineHeight: '20px', color: '#fff' }}>
                {subtitle}
              </p>
            </div>
          </div>
          {/* Bullet list — list-disc, 13px, Figma node 6122:7572 */}
          <ul style={{ listStyleType: 'disc', margin: 0, padding: 0 }}>
            {bullets.map((b, i) => (
              <li key={i} style={{
                marginInlineStart: 19.5,
                fontFamily: 'Inter,sans-serif',
                fontWeight: 400,
                fontSize: 13,
                lineHeight: '20px',
                color: '#b7b5bb',
              }}>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Desktop hero (690px, overflow visible so text group can extend below) ── */}
      <div className="relative w-full hidden md:block" style={{ height: 690, background: '#0f071a' }}>
        {/* Hero photo — full bleed, clipped to 690px */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            alt=""
            src={heroImage}
            fill
            priority
            unoptimized={isExternalUrl(heroImage)}
            sizes="100vw"
            className="pointer-events-none object-cover object-center"
          />
        </div>
        {/* Bottom gradient — exact Figma 6055:4051 values */}
        <div className="absolute left-0 right-0" style={{
          top: 0,
          height: '100%',
          background: 'linear-gradient(0.57deg, #0f071a 3.59%, rgba(15,7,26,0.705) 40.26%, rgba(15,7,26,0) 99.71%)',
        }} />

        {/* Text group: "Zero1 presents" + wordmark + subtitle + about text, y=346, w=708 */}
        <div className="absolute flex flex-col items-center" style={{ top: 346, left: '50%', transform: 'translateX(-50%)', gap: 24, width: 708 }}>
          {/* "Zero1 presents" row — align tops, not centered */}
          <div className="flex items-start justify-center" style={{ gap: 4 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Zero1" src={BOLT_MOBILE} style={{ width: 119, height: 36, marginTop: 5 }} />
            <p className="text-white whitespace-nowrap" style={{ fontFamily: 'Inter,sans-serif', fontStyle: 'italic', fontSize: 35.5, lineHeight: 1 }}>
              presents
            </p>
          </div>
          {/* Inner flex-col gap-24 */}
          <div className="flex flex-col items-center w-full" style={{ gap: 24 }}>
            {/* Wordmark + subtitle (gap-12) */}
            <div className="flex flex-col items-center w-full" style={{ gap: 12 }}>
              <img alt="The Inner Circle" src={WORDMARK_DESKTOP} style={{ height: 78.5, width: 577, display: 'block' }} />
              <p style={{ fontFamily: '"Inter",sans-serif', fontWeight: 500, fontStyle: 'italic', fontSize: 27, lineHeight: 'normal', color: '#fff', whiteSpace: 'nowrap' }}>
                {subtitle}
              </p>
            </div>
            {/* Bullet list */}
            <ul style={{ listStyleType: 'disc', margin: 0, padding: 0 }}>
              {bullets.map((b, i) => (
                <li key={i} style={{ marginInlineStart: 24, fontFamily: 'Inter,sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '24px', color: '#b7b5bb', whiteSpace: 'nowrap' }}>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
