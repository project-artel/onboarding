import { useCopy } from '../i18n/useCopy'
import type { Availability } from '../i18n/messages'

export function StateBadge({ state }: { state: Availability }) {
  const { t } = useCopy()

  return (
    <span className={`badge badge--${state}`}>
      <span className="badge__dot" aria-hidden="true" />
      {t.availability[state]}
    </span>
  )
}
