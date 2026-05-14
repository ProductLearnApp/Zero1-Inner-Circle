import type { ButtonHTMLAttributes } from 'react'
import styles from './PassButton.module.css'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  icon?: React.ReactNode
}

export function PassButton({ children, loading, icon, className, disabled, ...rest }: Props) {
  return (
    <button
      className={`${styles.btn} ${className ?? ''}`}
      disabled={disabled ?? loading}
      {...rest}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <>
          {icon && <span className={styles.icon}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
