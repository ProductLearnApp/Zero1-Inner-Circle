'use client'

import { useState } from 'react'
import type { PassFlowState, PlusOneResult } from '@/types/pass'

export function usePassFlow(attendeeId: string, initialPlusOneName?: string | null, initialPlusOneQrPayload?: string | null) {
  const hasExistingPlusOne = !!(initialPlusOneName && initialPlusOneQrPayload)

  const [state, setState] = useState<PassFlowState>(
    hasExistingPlusOne ? 'confirmed' : 'initial'
  )
  const [plusOneData, setPlusOneData] = useState<PlusOneResult | null>(
    hasExistingPlusOne
      ? { plusOneName: initialPlusOneName!, plusOnePassValue: initialPlusOneQrPayload! }
      : null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function goToForm() {
    setState('form')
  }

  async function submitForm(name: string, mobile: string) {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/plusone/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendeeId, plusOneName: name, plusOnePhone: mobile }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error ?? 'Failed to generate +1 pass. Please try again.')
        return
      }
      setPlusOneData({
        plusOneName: data.attendee.plusOneName,
        plusOnePassValue: data.attendee.plusOneQrPayload,
      })
      setState('confirmed')
    } catch {
      setSubmitError('Failed to generate +1 pass. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { state, plusOneData, isSubmitting, submitError, goToForm, submitForm }
}
