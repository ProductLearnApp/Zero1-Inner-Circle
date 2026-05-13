import type { LandingEvent } from './types'
import { ASSET_HERO_IMG1 } from './assets'
import { sanitizeUrl } from './sanitizeUrl'

/*
 * Figma node 5797:1357 — hero container: 690px tall
 * Figma node 5859:550  — text group at top: 346px, width: 708px
 *   "Zero1 presents" + bolt
 *   gap 24px
 *   flex-col gap-24:
 *     flex-col gap-12: wordmark (577×78.5) + subtitle (28px Satoshi Medium Italic white)
 *     gap 24px
 *     about paragraphs (18px #b7b5bb text-center)
 * Text overflows below the 690px image — page bg (#0f071a) = gradient end = seamless.
 *
 * Mobile: height 420px, text at top: 200px, bolt 65×13px, wordmark 176×24px, presents 16px
 *   subtitle at 14px below wordmark (gap 8px)
 */

const BOLT_MOBILE    = 'https://www.figma.com/api/mcp/asset/4c488797-49be-4926-9d2e-d65640022ae8' // Group48096174
const WORDMARK_MOBILE  = 'https://www.figma.com/api/mcp/asset/f05b23b1-bd08-488d-97a5-028d17e4f8a0' // Group8
const WORDMARK_DESKTOP = 'https://www.figma.com/api/mcp/asset/59f6740d-7f96-4a31-bb60-87f92ec2834e'

const DEFAULT_ABOUT = [
  'Every quarter, the Zero1 Community hosts Inner Circle meetups to solve REAL personal finance problems. These are events crafted by the community, for the community.',
  'Unlike regular lectures, Inner Circle Meet ups focus on hands on learning, where every activity is specially designed to build technical skills. Imagine if you could engage with a Zero1 video in person – participate in the experiments, play out the scenarios, that\'s what these events feel likeInner Circle meet ups are exclusive paid events. And, all the earnings from the tickets are donated to charity',
]

export function HeroSection({ event }: { event: LandingEvent }) {
  const heroImage = sanitizeUrl(event.heroImageUrl) || ASSET_HERO_IMG1
  const rawText = event.settings?.aboutText
  const paragraphs = rawText ? rawText.split('\n').filter(Boolean) : DEFAULT_ABOUT

  return (
    <>
      {/* ── Mobile hero — photo is absolutely positioned; text block drives height ── */}
      <div className="relative w-full md:hidden" style={{ background: '#0f071a' }}>
        {/* Photo — clipped to 377px, no orange tint (same as desktop) */}
        <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: 377 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={heroImage}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="absolute w-full h-full pointer-events-none object-cover object-center"
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
            <div className="flex items-center justify-center" style={{ gap: 2 }}>
              <img alt="Zero1" src={BOLT_MOBILE} style={{ height: 13.29, width: 64.8 }} />
              <p className="text-white whitespace-nowrap" style={{ fontFamily: '"Instrument Serif",serif', fontStyle: 'italic', fontSize: 16, lineHeight: 1 }}>
                presents
              </p>
            </div>
            <div className="flex flex-col items-center w-full" style={{ gap: 8 }}>
              <img alt="The Inner Circle" src={WORDMARK_MOBILE} style={{ height: 23.98, width: 176.27, display: 'block' }} />
              <p className="text-center w-full" style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontStyle: 'italic', fontSize: 14, lineHeight: '20px', color: '#fff' }}>
                Honest money conversations, so you can stop chasing
              </p>
            </div>
          </div>
          {/* About paragraphs — same overlay, gap-18 below header */}
          <div className="flex flex-col w-full" style={{ gap: 0 }}>
            {paragraphs.map((p, i) => (
              <p key={i} className="text-center" style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '20px', color: '#b7b5bb' }}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ── Desktop hero (690px, overflow visible so text group can extend below) ── */}
      <div className="relative w-full hidden md:block" style={{ height: 690, background: '#0f071a' }}>
        {/* Hero photo — full bleed, clipped to 690px */}
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={heroImage}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="absolute w-full h-full pointer-events-none object-cover object-center"
          />
        </div>
        {/* Bottom gradient — fades from page bg (#0f071a) to transparent */}
        <div className="absolute left-0 right-0" style={{
          top: 85,
          height: 690,
          background: 'linear-gradient(0.63deg, rgb(15,7,26) 6.76%, rgba(15,7,26,0.705) 45.87%, rgba(15,7,26,0) 99.66%)',
        }} />

        {/* Text group: "Zero1 presents" + wordmark + subtitle + about text, y=346, w=708 */}
        <div className="absolute flex flex-col items-center" style={{ top: 346, left: '50%', transform: 'translateX(-50%)', gap: 24, width: 708 }}>
          {/* "Zero1 presents" row */}
          <div className="flex items-center justify-center" style={{ gap: 4 }}>
            <img alt="Zero1" src={BOLT_MOBILE} style={{ height: 29.54, width: 144.06 }} />
            <p className="text-white whitespace-nowrap" style={{ fontFamily: '"Instrument Serif",serif', fontStyle: 'italic', fontSize: 35.5, lineHeight: 1 }}>
              presents
            </p>
          </div>
          {/* Inner flex-col gap-24 */}
          <div className="flex flex-col items-center w-full" style={{ gap: 24 }}>
            {/* Wordmark + subtitle (gap-12) */}
            <div className="flex flex-col items-center w-full" style={{ gap: 12 }}>
              <img alt="The Inner Circle" src={WORDMARK_DESKTOP} style={{ height: 78.5, width: 577, display: 'block' }} />
              <p className="text-center w-full" style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontStyle: 'italic', fontSize: 28, lineHeight: 'normal', color: '#fff' }}>
                Honest money conversations, so you can stop chasing
              </p>
            </div>
            {/* About paragraphs */}
            <div className="text-center w-full" style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 18, lineHeight: '24px', color: '#b7b5bb' }}>
              {paragraphs.map((p, i) => (
                <p key={i} style={{ marginBottom: i < paragraphs.length - 1 ? 24 : 0 }}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
