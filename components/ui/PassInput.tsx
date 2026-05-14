import type { InputHTMLAttributes } from 'react'
import styles from './PassInput.module.css'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function PassInput({ label, id, className, ...rest }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={`${styles.field} ${className ?? ''}`}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input className={styles.input} id={inputId} {...rest} />
    </div>
  )
}
