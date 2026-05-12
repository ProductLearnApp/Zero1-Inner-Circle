import type { LandingEvent } from './types'
import { ASSET_HERO_IMG1 } from './assets'

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

const BOLT_MOBILE    = 'https://www.figma.com/api/mcp/asset/881959a2-4b41-4f38-b15d-169bcda1e452'
const WORDMARK_MOBILE  = 'https://www.figma.com/api/mcp/asset/2d50166c-797c-4ca8-b463-4eb66d5fe206'
const WORDMARK_DESKTOP = 'https://www.figma.com/api/mcp/asset/59f6740d-7f96-4a31-bb60-87f92ec2834e'

const DEFAULT_ABOUT = [
  'Every quarter, the Zero1 Community hosts Inner Circle meetups to solve REAL personal finance problems. These are events crafted by the community, for the community.',
  'Unlike regular lectures, Inner Circle Meet ups focus on hands on learning, where every activity is specially designed to build technical skills. Imagine if you could engage with a Zero1 video in person – participate in the experiments, play out the scenarios, that\'s what these events feel likeInner Circle meet ups are exclusive paid events. And, all the earnings from the tickets are donated to charity',
]

export function HeroSection({ event }: { event: LandingEvent }) {
  const heroImage = event.heroImageUrl || ASSET_HERO_IMG1
  const rawText = event.settings?.aboutText
  const paragraphs = rawText ? rawText.split('\n').filter(Boolean) : DEFAULT_ABOUT

  return (
    <>
      {/* ── Mobile hero (420px) ── */}
      <div className="relative w-full overflow-hidden md:hidden" style={{ height: 420, background: '#0f071a' }}>
        {/* Hero photo */}
        <img
          alt=""
          src={heroImage}
          className="absolute w-full pointer-events-none object-cover"
          style={{ top: 0, left: 0, height: '100%' }}
        />
        {/* Orange tint */}
        <div className="absolute inset-0" style={{ background: 'rgba(242,186,48,0.39)' }} />
        {/* Bottom gradient fades into page bg */}
        <div className="absolute left-0 right-0 bottom-0" style={{
          height: 280,
          background: 'linear-gradient(0deg, #0f071a 0%, rgba(15,7,26,0.7) 50%, transparent 100%)',
        }} />

        {/* "Zero1 presents" + wordmark + subtitle */}
        <div className="absolute flex flex-col items-center w-full px-6" style={{ top: 200, gap: 12 }}>
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
      </div>

      {/* ── Desktop hero (690px, overflow visible so text group can extend below) ── */}
      <div className="relative w-full hidden md:block" style={{ height: 690, background: '#0f071a' }}>
        {/* Hero photo — full bleed, clipped to 690px */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            alt=""
            src={heroImage}
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
