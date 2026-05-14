'use client'

import { useState } from 'react'
import { PASS_ASSETS } from '@/lib/passAssets'
import { PassInput } from '@/components/ui/PassInput'
import { PassButton } from '@/components/ui/PassButton'
import styles from './PlusOneFormV2.module.css'

function TicketImage() {
  return (
    <div className={styles.emojiWrap}>
      <div className={styles.emojiInner}>
        <div className={styles.emojiRotate}>
          <div className={styles.emojiFrame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PASS_ASSETS.ticketEmoji} alt="" className={styles.emojiImg} />
          </div>
        </div>
      </div>
    </div>
  )
}

type Props = {
  onSubmit: (name: string, mobile: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export function PlusOneFormV2({ onSubmit, isLoading, error }: Props) {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !mobile.trim()) return
    await onSubmit(name.trim(), mobile.trim())
  }

  return (
    <div className={styles.block}>
      <div className={styles.heading}>
        <TicketImage />
        <h2 className={styles.title}>Are you coming with a +1?</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.fields}>
          <PassInput
            label="Name"
            id="plus-one-name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
          />
          <PassInput
            label="Mobile Number"
            id="plus-one-mobile"
            placeholder="Enter your +1's number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            type="tel"
            required
            autoComplete="off"
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <PassButton type="submit" loading={isLoading} disabled={!name || !mobile}>
          Submit
        </PassButton>
      </form>
    </div>
  )
}
