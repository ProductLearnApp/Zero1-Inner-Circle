import { SectionTitle } from './SectionTitle'
import type { ActivityItem, LandingEvent } from './types'
import {
  ASSET_ICON_STACK_ALT, ASSET_ICON_MONEY_ALT, ASSET_ICON_BRAIN,
  ASSET_ICON_DIAGNOSTICS, ASSET_ICON_STRESS,
} from './assets'
import { sanitizeUrl } from './sanitizeUrl'
import { renderText } from './renderText'

const ICON_FALLBACKS = [ASSET_ICON_STACK_ALT, ASSET_ICON_MONEY_ALT, ASSET_ICON_BRAIN, ASSET_ICON_DIAGNOSTICS, ASSET_ICON_STRESS]

/*
 * Figma node 6055:4294 — "Skills you'll learn" section.
 *
 * Desktop grid (in an 841px container):
 *   Row 1: 3 cards, widths [251, 252, 231], gap 51px between items
 *   Row 2: 2 cards, widths [346, 281], gap 30px between items (justify-center)
 *
 * Each card:
 *   - flex-col, gap 18px between icon and text group
 *   - icon: 28×28px
 *   - text group: gap 8px (title 18px Satoshi Medium, desc 13px Satoshi Regular #b7b5bb)
 */

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    title: 'Risk Analysis',
    description: 'Analyse the difference between perceived risk and actual portfolio risk through evidence-based financial reasoning',
    icon: ASSET_ICON_STACK_ALT,
  },
  {
    title: 'Structural Risks',
    description: 'Investigate real investing mistakes using frameworks used in portfolio analysis, risk assessment, and behavioural finance',
    icon: ASSET_ICON_MONEY_ALT,
  },
  {
    title: 'Investor Psychology',
    description: 'Identify how investor behaviour changes under uncertainty, volatility, social influence, and performance pressure',
    icon: ASSET_ICON_BRAIN,
  },
  {
    title: 'Portfolio Diagnostics',
    description: 'Evaluate portfolios beyond returns by analysing diversification quality, concentration exposure, correlation between holdings, and other hidden structural weaknesses',
    icon: ASSET_ICON_DIAGNOSTICS,
  },
  {
    title: 'Stress Testing',
    description: 'Recognise how portfolio construction, liquidity planning, and investment decision-making interact during financial stress situations',
    icon: ASSET_ICON_STRESS,
  },
]

function ActivityCard({ item, index, desktop }: { item: ActivityItem; index: number; desktop?: boolean }) {
  const isUrl = item.icon?.startsWith('http') || item.icon?.startsWith('/')
  const iconSrc = isUrl ? (sanitizeUrl(item.icon) ?? ICON_FALLBACKS[index % 5]) : ICON_FALLBACKS[index % 5]

  return (
    <div className="flex flex-col items-start" style={{ gap: 18 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={iconSrc} style={{ width: desktop ? 28 : 24, height: desktop ? 28 : 24 }} />
      <div className="flex flex-col" style={{ gap: 8 }}>
        <p style={{
          fontFamily: 'Inter,sans-serif', fontWeight: 500,
          fontSize: desktop ? 18 : 14, lineHeight: '24px',
          color: '#fff', margin: 0,
        }}>
          {renderText(item.title)}
        </p>
        <p style={{
          fontFamily: 'Inter,sans-serif', fontWeight: 400,
          fontSize: desktop ? 13 : 12, lineHeight: desktop ? '24px' : '20px',
          color: '#b7b5bb', margin: 0,
        }}>
          {renderText(item.description, '#e0dfe3')}
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
      {/* ── Mobile: vertical list ── */}
      <div className="flex flex-col md:hidden" style={{ gap: 32 }}>
        <SectionTitle>{`Skills you'll learn`}</SectionTitle>
        <div className="flex flex-col px-4" style={{ gap: 24 }}>
          {activities.map((item, i) => <ActivityCard key={i} item={item} index={i} />)}
        </div>
      </div>

      {/* ── Desktop: 3-col then 2-col grid ── */}
      <div className="hidden md:flex flex-col items-center w-full" style={{ gap: 40 }}>
        <SectionTitle>{`Skills you'll learn`}</SectionTitle>
        <div className="flex flex-col" style={{ gap: 32, width: 841 }}>
          {/* Row 1: 3 equal cards, gap 51px */}
          <div className="flex" style={{ gap: 51 }}>
            {row1.map((item, i) => (
              <div key={i} style={{ flex: 1 }}>
                <ActivityCard item={item} index={i} desktop />
              </div>
            ))}
          </div>
          {/* Row 2: 2 equal cards, centred, gap 30px */}
          {row2.length > 0 && (
            <div className="flex justify-center" style={{ gap: 30 }}>
              {row2.map((item, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <ActivityCard item={item} index={i + 3} desktop />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
