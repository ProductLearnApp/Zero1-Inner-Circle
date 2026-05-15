import { SectionTitle } from './SectionTitle'
import type { LandingEvent, SelectionProcessItem } from './types'
import { ASSET_STEP_MISSION, ASSET_STEP_REVIEW, ASSET_STEP_PAYMENT, ASSET_STEP_RSVP } from './assets'

/*
 * Figma node 6070:4935 — "Selection Process" section.
 * 4 steps with dynamic-color icons (target, thumb-up, dollar, chat).
 * Full-width CTA button at bottom. Steps are configurable via admin.
 */

const DEFAULT_STEPS: SelectionProcessItem[] = [
  {
    icon: ASSET_STEP_MISSION,
    iconSize: 38,
    title: 'Mission Submission',
    body: "In true Zero1 fashion, every participant must submit a mission form. This is a series of objective and subjective questions that help us understand if you're a money nerd like us",
  },
  {
    icon: ASSET_STEP_REVIEW,
    iconSize: 32,
    title: 'Review',
    body: 'Every application will be personally reviewed by the Zero1 team. You can expect a response by 20th May, 2026',
  },
  {
    icon: ASSET_STEP_PAYMENT,
    iconSize: 32,
    title: 'Confirmation and Payment',
    body: 'You will receive an email confirming your selection, along with a payment link. The ticket price is ₹3,000 and includes the entry of a +1 (so, that is Rs. 1,500 each). Since there are only 15 slots available, the payment link will be active for 24 hours ONLY',
  },
  {
    icon: ASSET_STEP_RSVP,
    iconSize: 32,
    title: 'RSVP and +1',
    body: "Our team will reach out to confirm you and your +1's RSVP",
  },
]

export function SelectionCriteria({ event }: { event: LandingEvent }) {
  const missionUrl = event.settings?.missionFormUrl || '#'
  const steps = event.settings?.selectionProcess?.length
    ? event.settings.selectionProcess
    : DEFAULT_STEPS

  return (
    <>
      {/* ── Mobile ── */}
      <div className="flex flex-col px-4 md:hidden" style={{ gap: 24 }}>
        <SectionTitle>Selection Process</SectionTitle>
        <div className="flex flex-col" style={{ gap: 0 }}>
          {steps.map((step, i) => (
            <div key={i} className="flex items-start" style={{ gap: 16 }}>
              {/* Icon + vertical connector */}
              <div className="shrink-0 flex flex-col items-center" style={{ width: 40 }}>
                <div className="flex items-center justify-center" style={{ width: 40, height: 40 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" src={step.icon} style={{ width: (step.iconSize ?? 32) * 0.85, height: (step.iconSize ?? 32) * 0.85 }} />
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 1, flex: 1, minHeight: 24, background: 'linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)' }} />
                )}
              </div>
              {/* Text */}
              <div style={{ flex: 1, paddingBottom: i < steps.length - 1 ? 24 : 0 }}>
                <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 700, fontSize: 14, lineHeight: '20px', color: '#fff', marginBottom: 4 }}>{step.title}</p>
                <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '20px', color: '#807d85' }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
        <a href={missionUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center rounded-lg"
          style={{ width: '100%', padding: '14px 8px', background: '#f5bd34' }}>
          <span style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontSize: 14, color: '#000' }}>Start mission</span>
        </a>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex flex-col" style={{ gap: 40, width: 841 }}>
        <SectionTitle>Selection Process</SectionTitle>
        <div className="flex flex-col" style={{ gap: 0 }}>
          {steps.map((step, i) => (
            <div key={i} className="flex items-start" style={{ gap: 20 }}>
              {/* Icon + vertical connector */}
              <div className="shrink-0 flex flex-col items-center" style={{ width: 48 }}>
                <div className="flex items-center justify-center" style={{ width: 48, height: 48, marginTop: 2 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" src={step.icon} style={{ width: step.iconSize, height: step.iconSize }} />
                </div>
                {/* Vertical connector line — hidden after last step */}
                {i < steps.length - 1 && (
                  <div style={{ width: 1, flex: 1, minHeight: 32, background: 'linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)' }} />
                )}
              </div>
              {/* Text */}
              <div style={{ flex: 1, paddingBottom: i < steps.length - 1 ? 32 : 0 }}>
                <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 700, fontSize: 18, lineHeight: '24px', color: '#fff', marginBottom: 6 }}>{step.title}</p>
                <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '24px', color: '#807d85' }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Full-width CTA */}
        <a href={missionUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center rounded-lg"
          style={{ width: '100%', height: 53, background: '#f5bd34' }}>
          <span style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontSize: 18, color: '#000' }}>Start mission</span>
        </a>
      </div>
    </>
  )
}
