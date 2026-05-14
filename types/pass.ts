export type QRConfig = {
  value: string
  size?: number
  fgColor?: string
  bgColor?: string
  level?: 'L' | 'M' | 'Q' | 'H'
  logoUrl?: string
}

export type PassFlowState = 'initial' | 'form' | 'confirmed'

export type PlusOneResult = {
  plusOnePassValue: string
  plusOneName: string
}
