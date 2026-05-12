import { ASSET_LINE, ASSET_DIAMOND_MASK, ASSET_DIAMOND_FILL } from './assets'
import type { LandingEvent } from './types'

const DEFAULT_ABOUT = [
  'Every quarter, the Zero1 Community hosts Inner Circle meetups to solve REAL personal finance problems. These are events crafted by the community, for the community.',
  'Unlike regular lectures, Inner Circle Meet ups focus on hands on learning, where every activity is specially designed to build technical skills. Imagine if you could engage with a Zero1 video in person – participate in the experiments, play out the scenarios, that\'s what these events feel like',
  'Inner Circle meet ups are exclusive paid events. And, all the earnings from the tickets are donated to charity',
]

function LineDiamond({ flip, size }: { flip?: boolean; size: 'sm' | 'lg' }) {
  const w = size === 'lg' ? 89 : 61
  const lw = size === 'lg' ? 81 : 53
  const dp = size === 'lg' ? 78 : 50
  return (
    <div className="relative shrink-0" style={{ width: w, height: 11, transform: flip ? 'scaleX(-1)' : undefined }}>
      <div className="absolute" style={{ left: 0, top: 5, width: lw, height: 1 }}>
        <img alt="" className="block w-full h-full" src={ASSET_LINE} />
      </div>
      <div className="absolute overflow-hidden" style={{
        left: dp, top: 0, width: 11, height: 11,
        WebkitMaskImage: `url('${ASSET_DIAMOND_MASK}')`, WebkitMaskSize: '11px 11px', WebkitMaskRepeat: 'no-repeat',
        maskImage: `url('${ASSET_DIAMOND_MASK}')`, maskSize: '11px 11px', maskRepeat: 'no-repeat',
      }}>
        <img alt="" className="block w-full h-full" src={ASSET_DIAMOND_FILL} />
      </div>
    </div>
  )
}

/* 3-layer stacked Gilroy title */
function StackedTitle({ size }: { size: 'sm' | 'lg' }) {
  const fs = size === 'lg' ? 32 : 16.715
  const offsets = size === 'lg' ? [4, 2, 0] : [2.09, 1.04, 0]
  const h = size === 'lg' ? 35 : 18
  return (
    <div className="relative" style={{ height: h, minWidth: size === 'lg' ? 280 : 147 }}>
      <p style={{ position: 'absolute', left: 0, top: offsets[0], fontFamily: '"Gilroy-ExtraBold","Gilroy","Satoshi",sans-serif', fontWeight: 800, fontSize: fs, lineHeight: 0.98, textTransform: 'uppercase', color: '#f57434', whiteSpace: 'nowrap', margin: 0 }}>
        Money Mixology
      </p>
      <p style={{ position: 'absolute', left: 0, top: offsets[1], fontFamily: '"Gilroy-ExtraBold","Gilroy","Satoshi",sans-serif', fontWeight: 800, fontSize: fs, lineHeight: 0.98, textTransform: 'uppercase', color: '#f5bd34', whiteSpace: 'nowrap', margin: 0 }}>
        Money Mixology
      </p>
      <p style={{ position: 'absolute', left: 0, top: offsets[2], fontFamily: '"Gilroy-ExtraBold","Gilroy","Satoshi",sans-serif', fontWeight: 800, fontSize: fs, lineHeight: 0.98, textTransform: 'uppercase', color: '#ffffff', whiteSpace: 'nowrap', margin: 0 }}>
        Money Mixology
      </p>
    </div>
  )
}

const DEFAULT_SESSION_DESC = 'In this session, we will figure out what a well-diversified portfolio looks like and figure out the money mistakes most of us make along the way'

export function AboutSection({ event }: { event: LandingEvent }) {
  const rawText = event.settings?.aboutText
  const paragraphs = rawText ? rawText.split('\n').filter(Boolean) : DEFAULT_ABOUT
  const sessionDesc = event.settings?.sessionDescription ?? DEFAULT_SESSION_DESC

  return (
    <>
      {/* ── Mobile: about paragraphs + Money Mixology ── */}
      <div className="flex flex-col items-center md:hidden" style={{ gap: 18 }}>
        {/* Inner Circle about paragraphs (shown below mobile hero) */}
        <div className="flex flex-col" style={{ gap: 12 }}>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-center" style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '20px', color: '#b7b5bb' }}>{p}</p>
          ))}
        </div>
        {/* Money Mixology */}
        <div className="flex flex-col items-center" style={{ gap: 12 }}>
          <div className="flex items-center justify-center" style={{ gap: 6 }}>
            <LineDiamond size="sm" />
            <div className="flex flex-col items-center" style={{ gap: 4 }}>
              <StackedTitle size="sm" />
              <p className="whitespace-nowrap" style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontStyle: 'italic', fontSize: 14, color: '#fff' }}>
                How to build the right portfolio?
              </p>
            </div>
            <LineDiamond size="sm" flip />
          </div>
          {sessionDesc && (
            <p className="w-full text-center" style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '20px', color: '#b7b5bb' }}>
              {sessionDesc}
            </p>
          )}
        </div>
      </div>

      {/* ── Desktop: Money Mixology only (about text is inside HeroSection) ── */}
      <div className="hidden md:flex flex-col items-center" style={{ gap: 19, width: 675 }}>
        <div className="flex items-center justify-center" style={{ gap: 8 }}>
          <LineDiamond size="lg" />
          <div className="flex flex-col items-center" style={{ gap: 4 }}>
            <StackedTitle size="lg" />
            <p className="whitespace-nowrap" style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontStyle: 'italic', fontSize: 28, color: '#fff' }}>
              How to build the right portfolio?
            </p>
          </div>
          <LineDiamond size="lg" flip />
        </div>
        {sessionDesc && (
          <p className="text-center w-full" style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 18, lineHeight: '24px', color: '#b7b5bb' }}>
            {sessionDesc}
          </p>
        )}
      </div>
    </>
  )
}

