import { ASSET_LINE, ASSET_DIAMOND_MASK, ASSET_DIAMOND_FILL } from './assets'

/*
 * Decorative ——◆ TITLE ◆—— header
 * Mobile:  12px Satoshi Bold, letterSpacing 2.28px
 * Desktop: 32px Satoshi Bold, letterSpacing 6.08px, larger line/diamond
 */

interface Props {
  children: React.ReactNode
  /** If true, renders desktop-sized version */
  large?: boolean
}

function LineDiamond({ flip, large }: { flip?: boolean; large?: boolean }) {
  const w = large ? 89 : 61
  const lineW = large ? 81 : 53
  const dPos = large ? 78 : 50
  return (
    <div
      className="relative shrink-0"
      style={{ width: w, height: 11, transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <div className="absolute" style={{ left: 0, top: 5, width: lineW, height: 1 }}>
        <img alt="" className="block w-full h-full" src={ASSET_LINE} />
      </div>
      <div
        className="absolute overflow-hidden"
        style={{
          left: dPos, top: 0, width: 11, height: 11,
          WebkitMaskImage: `url('${ASSET_DIAMOND_MASK}')`,
          WebkitMaskSize: '11px 11px',
          WebkitMaskRepeat: 'no-repeat',
          maskImage: `url('${ASSET_DIAMOND_MASK}')`,
          maskSize: '11px 11px',
          maskRepeat: 'no-repeat',
        }}
      >
        <img alt="" className="block w-full h-full" src={ASSET_DIAMOND_FILL} />
      </div>
    </div>
  )
}

export function SectionTitle({ children, large }: Props) {
  return (
    <>
      {/* Mobile */}
      <div className="flex items-center justify-center w-full md:hidden" style={{ gap: 6 }}>
        <LineDiamond />
        <p className="shrink-0 whitespace-nowrap text-white uppercase"
          style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, fontSize: 12, lineHeight: 'normal', letterSpacing: '2.28px' }}>
          {children}
        </p>
        <LineDiamond flip />
      </div>
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center w-full" style={{ gap: 8 }}>
        <LineDiamond large />
        <p className="shrink-0 whitespace-nowrap text-white uppercase"
          style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, fontSize: 32, lineHeight: 'normal', letterSpacing: '6.08px' }}>
          {children}
        </p>
        <LineDiamond large flip />
      </div>
    </>
  )
}
