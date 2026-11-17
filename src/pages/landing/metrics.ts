// 랜딩 § 04 평가 지표의 데이터. 장면과 표지판은 이 파일만 읽는다. 축 이름(실제, ARTEL 판정)과 제목 옆
// 표시만 `messages.ts`의 `metrics`에 있다.
//
// 지금은 값을 모으는 중이라 숫자를 하나도 적지 않는다(`null`). 이때 장면은 칸과 막대의 빈 자리만 그리고,
// 표지판의 값은 `—`이며, 제목 옆에 `수집 중`/`Collecting` 표시가 붙는다.
//
// 실제 값으로 바꾸는 방법:
// 1. `confusionCounts`의 네 칸에 건수를, `metrics`의 `value`에 값을 넣는다. 네 칸이 모두 차야 오탐률과
//    미탐률을 계산한다.
// 2. `metricsStatus`를 `'live'`로 둔다. 제목 옆 표시가 사라지고 칸은 건수만큼 뜨며 막대는 `value / max`만큼
//    솟는다. `npm run check`가 `'live'`일 때 값이 다 찼는지, `'collecting'`일 때 값이 비었는지 확인한다.
//
// 용어는 `.agents/docs/product-terminology.md`를 따른다. Test Case는 줄이지 않는다.
import type { Locale } from '../../i18n/locale'

export type MetricsStatus = 'collecting' | 'live'

export const metricsStatus: MetricsStatus = 'collecting'

/** 값이 없을 때 표지판에 쓰는 자리 표시. */
export const emptyValue = '—'

/* ── 혼동 행렬 ─────────────────────────────────────────── */

export type ConfusionKey = 'tp' | 'fp' | 'fn' | 'tn'

/** 칸마다의 건수. 0 이상의 정수이거나, 아직 모으는 중이면 `null`이다. */
export type ConfusionCounts = Record<ConfusionKey, number | null>

export const confusionCounts: ConfusionCounts = { tp: null, fp: null, fn: null, tn: null }

export const confusionCells: Record<ConfusionKey, { code: string; label: Record<Locale, string>; error: boolean }> = {
  tp: { code: 'TP', label: { ko: '정탐', en: 'True positive' }, error: false },
  fp: { code: 'FP', label: { ko: '오탐', en: 'False positive' }, error: true },
  fn: { code: 'FN', label: { ko: '미탐', en: 'False negative' }, error: true },
  tn: { code: 'TN', label: { ko: '정상 판정', en: 'True negative' }, error: false },
}

// 일반적인 배치. 행은 실제(결함 있음, 결함 없음), 열은 ARTEL 판정(결함, 정상)이다.
export const confusionLayout: [[ConfusionKey, ConfusionKey], [ConfusionKey, ConfusionKey]] = [
  ['tp', 'fn'],
  ['fp', 'tn'],
]

type CompleteCounts = Record<ConfusionKey, number>

/** 네 칸이 모두 찼을 때만 건수를 돌려준다. 한 칸이라도 비면 비율을 계산하지 않는다. */
function completeCounts(counts: ConfusionCounts): CompleteCounts | null {
  const { tp, fp, fn, tn } = counts
  if (tp === null || fp === null || fn === null || tn === null) return null
  return { tp, fp, fn, tn }
}

/** 행렬 옆에 보이는 비율. 건수에서 계산하므로 직접 적지 않는다. */
export const confusionRates: { key: string; label: Record<Locale, string>; rate: (c: CompleteCounts) => number }[] = [
  { key: 'fpr', label: { ko: '오탐률', en: 'False positive rate' }, rate: (c) => c.fp / (c.fp + c.tn) },
  { key: 'fnr', label: { ko: '미탐률', en: 'False negative rate' }, rate: (c) => c.fn / (c.fn + c.tp) },
]

/** 비율 값. 건수가 다 차지 않았거나 분모가 0이면 `null`이다. */
export function confusionRate(rate: (typeof confusionRates)[number], counts: ConfusionCounts): number | null {
  const complete = completeCounts(counts)
  if (!complete) return null
  const value = rate.rate(complete)
  return Number.isFinite(value) ? value : null
}

/* ── 막대 지표 ─────────────────────────────────────────── */

export type Metric = {
  key: string
  label: Record<Locale, string>
  /** 아직 모으는 중이면 `null`이다. 막대는 솟지 않고 빈 자리와 점선 뚜껑만 그린다. */
  value: number | null
  /** 빈 문자열이면 숫자만 쓴다. */
  unit: string
  /** `prefix`는 `$1.8`처럼 앞에, `suffix`는 뒤에 붙인다. 뒤에 붙는 `%`만 띄우지 않는다. */
  unitPosition: 'prefix' | 'suffix'
  /** 막대가 가장 높이 솟는 값. 막대 높이는 `value / max`로 정한다. */
  max: number
}

// 판 위에 가로 한 줄로 놓는다. 표지판 폭 때문에 네 개까지가 한 화면에 들어온다.
export const metrics: Metric[] = [
  { key: 'detectionRate', label: { ko: '결함 탐지율', en: 'Defect detection rate' }, value: null, unit: '%', unitPosition: 'suffix', max: 100 },
  { key: 'executionRate', label: { ko: 'Test Case 수행률', en: 'Test Case execution rate' }, value: null, unit: '%', unitPosition: 'suffix', max: 100 },
  { key: 'costPerRun', label: { ko: 'QA 1회 비용', en: 'Cost per QA run' }, value: null, unit: '$', unitPosition: 'prefix', max: 5 },
  { key: 'runTime', label: { ko: '평균 QA 실행 시간', en: 'Average QA run time' }, value: null, unit: 'min', unitPosition: 'suffix', max: 10 },
]

/** 행렬과 코랄 선으로 이어지는 막대. 값이 있으면 윗면도 코랄이다. */
export const highlightedMetric = 'detectionRate'

/* ── 표시 ─────────────────────────────────────────────── */

const numberLocale = (locale: Locale) => (locale === 'ko' ? 'ko-KR' : 'en-US')

export function formatMetricValue(metric: Metric, locale: Locale): string {
  if (metric.value === null) return emptyValue
  const number = new Intl.NumberFormat(numberLocale(locale), { maximumFractionDigits: 1 }).format(metric.value)
  if (!metric.unit) return number
  if (metric.unitPosition === 'prefix') return `${metric.unit}${number}`
  return metric.unit === '%' ? `${number}%` : `${number} ${metric.unit}`
}

export function formatCount(count: number | null, locale: Locale): string {
  if (count === null) return emptyValue
  return new Intl.NumberFormat(numberLocale(locale)).format(count)
}

export function formatRate(rate: number | null, locale: Locale): string {
  if (rate === null) return emptyValue
  return new Intl.NumberFormat(numberLocale(locale), { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(rate)
}
