import styles from './ConfirmedBlock.module.css'

type Props = {
  plusOneName: string
}

function TicketIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
      <line x1="9" y1="2" x2="9" y2="22" strokeDasharray="1 3" />
    </svg>
  )
}

export function ConfirmedBlock({ plusOneName }: Props) {
  return (
    <div className={styles.block}>
      <div className={styles.inner}>
        <div className={styles.titleRow}>
          <span className={styles.emoji}>🎉</span>
          <h2 className={styles.title}>Passes confirmed</h2>
        </div>
        <p className={styles.subtitle}>
          We can&apos;t wait to see You and {plusOneName} at the Inner Circle
        </p>
        <div className={styles.hint}>
          <span className={styles.ticketIcon}>
            <TicketIcon />
          </span>
          <span className={styles.hintText}>Swipe the QR to see you and your +1&apos;s passes</span>
        </div>
      </div>
    </div>
  )
}
