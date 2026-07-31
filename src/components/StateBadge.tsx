import { useCopy } from '../i18n/useCopy'
import type { Availability } from '../i18n/messages'

// 도트만 flare(동작 중) / ink-3(개발 예정)로 갈린다. 테두리·글자색은 같으므로
// 색약 대응은 텍스트 라벨이 담당한다.
export function StateBadge({ state }: { state: Availability }) {
  const { t } = useCopy()

  return (
    <span className={state === 'planned' ? 'state state--planned' : 'state'}>
      {t.availability[state]}
    </span>
  )
}
