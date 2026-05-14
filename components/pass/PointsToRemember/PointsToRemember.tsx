import styles from './PointsToRemember.module.css'

const DEFAULT_POINTS = [
  'Passes for Zero1 Inner Circle are non-transferable. Only the participant and their pre-invited +1 will be allowed into the venue',
  'Both the participant and their +1 must carry valid government issued IDs for verification',
  'People under the age of 18 will not be permitted inside the premises',
  'The event starts at 10:30 AM sharp. Please reach the venue at least 15 minutes before that',
  'Passes for Inner Circle events are non-cancellable and non-refundable',
  'Sharp objects, prohibited substances, lighters, e-cigarettes, food items, etc. are prohibited',
  'For any medication you wish to carry, please bring a doctor-signed prescription',
]

type Props = {
  points?: string[]
}

export function PointsToRemember({ points }: Props) {
  const items = points && points.length > 0 ? points : DEFAULT_POINTS
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Points to remember</h3>
      <ol className={styles.list}>
        {items.map((point) => (
          <li key={point} className={styles.item}>
            {point}
          </li>
        ))}
      </ol>
    </div>
  )
}
