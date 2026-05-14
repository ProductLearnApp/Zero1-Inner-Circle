import { PASS_ASSETS } from '@/lib/passAssets'
import { PassButton } from '@/components/ui/PassButton'
import styles from './PromptBlock.module.css'

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
  onGenerate: () => void
}

export function PromptBlock({ onGenerate }: Props) {
  return (
    <div className={styles.block}>
      <div className={styles.heading}>
        <TicketImage />
        <h2 className={styles.title}>Are you coming with a +1?</h2>
      </div>
      <p className={styles.subtitle}>Confirm their details to generate their free pass</p>
      <PassButton
        onClick={onGenerate}
        icon={<img src={PASS_ASSETS.userPlusIcon} alt="" width={16} height={16} />}
      >
        Generate +1 pass
      </PassButton>
    </div>
  )
}
