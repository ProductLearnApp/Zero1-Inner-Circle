import { SectionTitle } from './SectionTitle'
import type { ActivityItem, LandingEvent } from './types'
import { ASSET_ICON_STACK_ALT, ASSET_ICON_BRAIN, ASSET_ICON_MONEY_ALT } from './assets'

const ICONS: Record<string, string> = {
  stack: ASSET_ICON_STACK_ALT,
  brain: ASSET_ICON_BRAIN,
  money: ASSET_ICON_MONEY_ALT,
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  { title: 'Portfolio Foundations', description: 'How to build strong long-term portfolios with solid foundations', icon: 'stack' },
  { title: 'Hidden Risks', description: 'Understand why some portfolios survive market crashes while others collapse', icon: 'stack' },
  { title: 'Costly Mistakes', description: 'Investigate real-world investing mistakes through interactive gameplay', icon: 'stack' },
  { title: 'Risk Analysis', description: 'Understand risk beyond just "high risk" and "low risk"', icon: 'brain' },
  { title: 'Decision Psychology', description: 'Detect behavioural traps while budgeting, saving, and investing', icon: 'money' },
]

function ActivityCard({ item, desktop }: { item: ActivityItem; desktop?: boolean }) {
  const iconSrc = item.icon?.startsWith('http')
    ? item.icon
    : (ICONS[item.icon] ?? ASSET_ICON_STACK_ALT)
  return (
    <div className="flex flex-col items-start" style={{ gap: desktop ? 8 : 18 }}>
      <img alt="" src={iconSrc} style={{ width: desktop ? 24 : 24, height: desktop ? 24 : 24 }} />
      <div className="flex flex-col" style={{ gap: desktop ? 8 : 4 }}>
        <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontSize: desktop ? 18 : 14, lineHeight: desktop ? '24px' : '24px', color: '#fff' }}>
          {item.title}
        </p>
        <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: desktop ? 13 : 12, lineHeight: desktop ? '24px' : '20px', color: '#b7b5bb' }}>
          {item.description}
        </p>
      </div>
    </div>
  )
}

export function ActivitiesGrid({ event }: { event: LandingEvent }) {
  const activities = event.settings?.activities?.length ? event.settings.activities : DEFAULT_ACTIVITIES
  const row1 = activities.slice(0, 3)
  const row2 = activities.slice(3, 5)

  return (
    <>
      {/* ── Mobile: "Skills you'll learn" vertical list ── */}
      <div className="flex flex-col md:hidden" style={{ gap: 32 }}>
        <SectionTitle>{`Skills you'll learn`}</SectionTitle>
        <div className="flex flex-col px-4" style={{ gap: 24 }}>
          {activities.map((item, i) => <ActivityCard key={i} item={item} />)}
        </div>
      </div>

      {/* ── Desktop: "Skills you'll learn" 3-col + 2-col grid ── */}
      <div className="hidden md:flex flex-col items-center w-full" style={{ gap: 56 }}>
        <SectionTitle>{`Skills you'll learn`}</SectionTitle>
        <div className="flex flex-col" style={{ gap: 60, width: 820 }}>
          {/* Row 1: 3 items */}
          <div className="flex" style={{ gap: 30 }}>
            {row1.map((item, i) => (
              <div key={i} style={{ width: i === 0 ? 190 : i === 1 ? 228 : 224 }}>
                <ActivityCard item={item} desktop />
              </div>
            ))}
          </div>
          {/* Row 2: 2 items centred */}
          {row2.length > 0 && (
            <div className="flex justify-center" style={{ gap: 51 }}>
              {row2.map((item, i) => (
                <div key={i} style={{ width: 203 }}>
                  <ActivityCard item={item} desktop />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
