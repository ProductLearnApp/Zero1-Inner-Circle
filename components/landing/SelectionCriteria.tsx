import { SectionTitle } from './SectionTitle'
import type { LandingEvent } from './types'
import {
  ASSET_DOT_ACTIVE_OUTER, ASSET_DOT_ACTIVE_INNER,
  ASSET_DOT_IDLE_OUTER, ASSET_DOT_IDLE_INNER,
  ASSET_DOT_IDLE3_OUTER,
} from './assets'

const STEPS = [
  {
    title: 'Mission Submission',
    body: "In true Zero1 fashion, every participant must submit a mission form. This is a series of objective and subjective questions that help us understand if you're a money nerd like us",
    active: true,
  },
  {
    title: 'Video application',
    body: 'Every application will be personally reviewed by the Zero1 team. You can expect a response by 20th May, 2026',
    active: false,
  },
  {
    title: 'Confirmation and Payment',
    body: 'You will receive an email confirming your selection, along with a payment link. The ticket price is ₹3,000 and includes the entry of a +1 (so, that is Rs. 1,500 each). Since there are only 15 slots available, the payment link will be active for 24 hours ONLY',
    active: false,
  },
  {
    title: 'RSVP and +1',
    body: "Our team will reach out to confirm you and your +1's RSVP",
    active: false,
  },
]

/* Desktop connector heights */
const D_CONNECTORS = [103, 80, 104]

function Dot({ active, size }: { active: boolean; size: 'sm' | 'lg' }) {
  const s = size === 'lg' ? 25 : 14
  if (size === 'lg') {
    return (
      <div className="relative shrink-0" style={{ width: s, height: s }}>
        <img alt="" src={active ? ASSET_DOT_ACTIVE_OUTER : ASSET_DOT_IDLE3_OUTER} className="absolute inset-0 w-full h-full" />
        <img alt="" src={active ? ASSET_DOT_ACTIVE_INNER : ASSET_DOT_IDLE_INNER}
          className="absolute" style={{ left: Math.round(s * 0.214), top: Math.round(s * 0.214), width: Math.round(s * 0.572), height: Math.round(s * 0.572) }} />
      </div>
    )
  }
  return (
    <div className="relative shrink-0" style={{ width: 14, height: 14 }}>
      <img alt="" src={active ? ASSET_DOT_ACTIVE_OUTER : ASSET_DOT_IDLE_OUTER} className="absolute inset-0 w-full h-full" />
      <img alt="" src={active ? ASSET_DOT_ACTIVE_INNER : ASSET_DOT_IDLE_INNER}
        className="absolute" style={{ left: 3, top: 3, width: 8, height: 8 }} />
    </div>
  )
}

export function SelectionCriteria({ event }: { event: LandingEvent }) {
  const missionUrl = event.settings?.missionFormUrl || '#'

  return (
    <>
      {/* ── Mobile ── */}
      <div className="flex flex-col px-4 md:hidden" style={{ gap: 18 }}>
        <SectionTitle>Selection criteria</SectionTitle>
        {/* Inline per-row: dot + connector stretch to match text height */}
        <div className="flex flex-col" style={{ gap: 0 }}>
          {STEPS.map((step, i) => (
            <div key={i} className="flex" style={{ gap: 22 }}>
              {/* Dot + stretching connector */}
              <div className="flex flex-col items-center shrink-0" style={{ width: 14, paddingBottom: i < STEPS.length - 1 ? 18 : 0 }}>
                <Dot active={step.active} size="sm" />
                {i < STEPS.length - 1 && (
                  <div className="flex-1 mt-1" style={{ width: 1, background: 'rgba(255,255,255,0.15)', minHeight: 12 }} />
                )}
              </div>
              {/* Text */}
              <div style={{ flex: 1, paddingBottom: i < STEPS.length - 1 ? 18 : 0 }}>
                <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 700, fontSize: 14, lineHeight: '20px', color: '#fff' }}>{step.title}</p>
                <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '20px', color: '#b7b5bb', marginTop: 4 }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <a href={missionUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center rounded-lg"
            style={{ width: 312, padding: '12px 8px', background: '#f5bd34', border: '1px solid #f5bd34' }}>
            <span style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontSize: 14, lineHeight: 1.3, color: '#000' }}>Start your mission</span>
          </a>
        </div>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex flex-col" style={{ gap: 40, width: 650 }}>
        <SectionTitle>Selection criteria</SectionTitle>
        <div className="flex flex-col" style={{ gap: 60 }}>
          <div className="flex" style={{ gap: 18 }}>
            {/* dots column */}
            <div className="flex flex-col items-center shrink-0" style={{ width: 25 }}>
              {STEPS.map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Dot active={step.active} size="lg" />
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 1, height: D_CONNECTORS[i], marginTop: 4, marginBottom: 4, background: 'rgba(255,255,255,0.2)' }} />
                  )}
                </div>
              ))}
            </div>
            {/* text column */}
            <div className="flex flex-col" style={{ gap: 32, flex: 1 }}>
              {STEPS.map((step, i) => (
                <div key={i} className="flex flex-col" style={{ gap: 4 }}>
                  <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 700, fontSize: 18, lineHeight: '20px', color: '#fff' }}>{step.title}</p>
                  <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '24px', color: '#807d85' }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
          {/* CTA */}
          <a href={missionUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center rounded-lg"
            style={{ width: '100%', height: 53, background: '#f5bd34', border: '1px solid #f5bd34' }}>
            <span style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontSize: 18, lineHeight: 1.3, color: '#000' }}>Start your mission</span>
          </a>
        </div>
      </div>
    </>
  )
}
