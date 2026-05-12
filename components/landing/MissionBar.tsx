import type { LandingEvent } from './types'

/*
 * Figma specs:
 * - bg: #1c1a1f, rounded-tl-[24px] rounded-tr-[24px]
 * - shadow: 0px -26px 18.5px 0px rgba(255,255,255,0.08)
 * - height: 104px total
 * - button: #f5bd34, 328×42px, rounded-lg (8px), y=22 from top
 * - Home Indicator bar at very bottom: white, 134×5px, rounded-full
 */
export function MissionBar({ event }: { event: LandingEvent }) {
  const missionUrl = event.settings?.missionFormUrl || '#'

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden overflow-hidden"
      style={{
        height: 104,
        background: '#1c1a1f',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        boxShadow: '0px -26px 18.5px 0px rgba(255,255,255,0.08)',
      }}
    >
      {/* CTA button at y=22 */}
      <div className="absolute left-4 right-4" style={{ top: 22 }}>
        <a
          href={missionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-lg w-full"
          style={{
            height: 42,
            background: '#f5bd34',
            border: '1px solid #f5bd34',
          }}
        >
          <span
            style={{
              fontFamily: 'Satoshi, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: 1.3,
              color: '#000',
            }}
          >
            Start your mission
          </span>
        </a>
      </div>

      {/* iOS home indicator at very bottom */}
      <div
        className="absolute bottom-2 left-1/2 bg-white rounded-full"
        style={{ width: 134, height: 5, transform: 'translateX(-50%)' }}
      />
    </div>
  )
}
