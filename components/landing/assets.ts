import { BASE_PATH } from '@/lib/basePath'

const LA = BASE_PATH + '/landing-assets'

// ─── Hero background ──────────────────────────────────────────────────────────
export const ASSET_HERO_BG_MAIN     = '' // set via event.heroImageUrl in DB
export const ASSET_HERO_IMG1        = '' // set via event settings in DB
export const ASSET_HERO_IMG2        = '' // set via event settings in DB

// ─── Nav bar background ───────────────────────────────────────────────────────
export const ASSET_NAV_BAR          = ''

// ─── Zero1 brand logos ────────────────────────────────────────────────────────
export const ASSET_WORDMARK_DESKTOP = `${LA}/wordmark-white.svg`
export const ASSET_ZERO1_LOGO_NAV   = BASE_PATH + '/zero1-white-logo.svg'
export const ASSET_ZERO1_LOGO_FOOTER= BASE_PATH + '/zero1-white-logo.svg'
export const ASSET_ZERO1_BOLT_MOBILE= BASE_PATH + '/zero1-white-logo.svg'
export const ASSET_WORDMARK         = `${LA}/wordmark-white.svg`

// ─── Decorative section title elements ────────────────────────────────────────
export const ASSET_LINE             = `${LA}/connector-h.svg`
export const ASSET_DIAMOND_MASK     = '' // pending — provide SVG
export const ASSET_DIAMOND_FILL     = '' // pending — provide SVG

// ─── Event card info icons ─────────────────────────────────────────────────────
export const ASSET_CARD_ICON_DATE   = '' // pending — provide SVG
export const ASSET_CARD_ICON_PASSES = '' // pending — provide SVG
export const ASSET_INFO_ICON        = '' // pending — provide SVG

// ─── Skills / activity icons (one per default activity) ──────────────────────
export const ASSET_ICON_STACK_ALT   = '' // pending — provide SVG
export const ASSET_ICON_MONEY_ALT   = '' // pending — provide SVG
export const ASSET_ICON_BRAIN       = '' // pending — provide SVG
export const ASSET_ICON_DIAGNOSTICS = '' // pending — provide SVG
export const ASSET_ICON_STRESS      = '' // pending — provide SVG

// ─── Timeline card backgrounds ────────────────────────────────────────────────
export const ASSET_CARD_BG          = '' // pending — provide image
export const ASSET_CARD_BG2         = '' // pending — provide image
export const ASSET_CARD_BG3         = '' // pending — provide image
export const ASSET_CARD_BG4         = '' // pending — provide image

// ─── Timeline connectors ──────────────────────────────────────────────────────
export const ASSET_H_CONNECTOR      = `${LA}/connector-h.svg`
export const ASSET_V_CONNECTOR      = `${LA}/connector-v.svg`
export const ASSET_V_CONNECTOR_127  = `${LA}/connector-v.svg`
export const ASSET_V_CONNECTOR_129  = `${LA}/connector-h.svg`
export const ASSET_V_CONNECTOR_130  = `${LA}/connector-v.svg`

// ─── Timeline dots ────────────────────────────────────────────────────────────
export const ASSET_DOT_OUTER        = `${LA}/dot-combined.svg`
export const ASSET_DOT_INNER        = `${LA}/dot-inner.svg`

// ─── Selection criteria dots ──────────────────────────────────────────────────
export const ASSET_DOT_ACTIVE_OUTER = `${LA}/dot-combined.svg`
export const ASSET_DOT_ACTIVE_INNER = `${LA}/dot-inner.svg`
export const ASSET_DOT_IDLE_OUTER   = `${LA}/dot-combined.svg`
export const ASSET_DOT_IDLE_INNER   = `${LA}/dot-inner.svg`
export const ASSET_DOT_IDLE3_OUTER  = `${LA}/dot-combined.svg`
export const ASSET_DOT_IDLE4_OUTER  = `${LA}/dot-combined.svg`
export const ASSET_V_CONNECTOR_123  = `${LA}/connector-v.svg`
export const ASSET_V_CONNECTOR_124  = `${LA}/connector-v.svg`
export const ASSET_V_CONNECTOR_125  = `${LA}/connector-v.svg`
export const ASSET_V_CONNECTOR_131  = `${LA}/connector-v.svg`
export const ASSET_V_CONNECTOR_132  = `${LA}/connector-v.svg`
export const ASSET_V_CONNECTOR_133  = `${LA}/connector-v.svg`

// ─── Selection Process step icons ─────────────────────────────────────────────
export const ASSET_STEP_MISSION     = '' // pending — provide SVG
export const ASSET_STEP_REVIEW      = '' // pending — provide SVG
export const ASSET_STEP_PAYMENT     = '' // pending — provide SVG
export const ASSET_STEP_RSVP        = '' // pending — provide SVG

// ─── Things to know pen icons ─────────────────────────────────────────────────
export const ASSET_PEN_1            = '' // pending — provide SVG
export const ASSET_PEN_2            = '' // pending — provide SVG
export const ASSET_PEN_3            = '' // pending — provide SVG
export const ASSET_PEN_4            = '' // pending — provide SVG
export const ASSET_PEN_5            = '' // pending — provide SVG
export const ASSET_PEN_6            = '' // pending — provide SVG
export const ASSET_PEN_7            = '' // pending — provide SVG

// ─── Footer / social icons ────────────────────────────────────────────────────
export const ASSET_INSTAGRAM        = '' // pending — provide SVG
export const ASSET_EMAIL            = '' // pending — provide SVG

// ─── Partner logo ─────────────────────────────────────────────────────────────
export const ASSET_PARTNER_LOGO     = '' // pending — provide image

// ─── Aliases kept for backward compatibility ──────────────────────────────────
export const ASSET_LINE_LONG        = ASSET_LINE
export const ASSET_HERO_BG          = ASSET_HERO_BG_MAIN
export const ASSET_ZERO1_BOLT       = ASSET_ZERO1_LOGO_NAV

// EventDetails legacy icons (component unused but kept to avoid build errors)
export const ASSET_ICON_DATE        = ASSET_CARD_ICON_DATE
export const ASSET_ICON_TIME        = ASSET_INFO_ICON
export const ASSET_ICON_FLAT        = ASSET_INFO_ICON
export const ASSET_ICON_LOCATION    = ASSET_INFO_ICON
export const ASSET_ICON_MONEY       = ASSET_ICON_MONEY_ALT
export const ASSET_ICON_PASSES      = ASSET_CARD_ICON_PASSES
export const ASSET_ICON_STACK       = ASSET_ICON_STACK_ALT
