// 경로↔로케일 변환은 잘못되면 언어 전환이 홈으로 튀거나 영어 경로가 한국어로
// 열린다. 러너 없이 `npm run check` 한 줄로 돈다.
import assert from 'node:assert/strict'
import { localeFromPath, localizedHref, locales, pathWithLocale } from '../src/i18n/locale.ts'
import { messages } from '../src/i18n/messages.ts'
import {
  confusionCells,
  confusionCounts,
  confusionLayout,
  confusionRate,
  confusionRates,
  formatCount,
  formatMetricValue,
  formatRate,
  highlightedMetric,
  metrics,
  metricsStatus,
} from '../src/pages/landing/metrics.ts'
import { wishlistCopy } from '../src/wishlist/copy.ts'
import {
  selfHostingHubPath,
  selfHostingMethodIds,
  selfHostingMethodPath,
  selfHostingPaths,
} from '../src/i18n/selfHostingRoutes.ts'

assert.equal(localeFromPath('/'), 'ko')
assert.equal(localeFromPath('/sdk'), 'ko')
assert.equal(localeFromPath('/en'), 'en')
assert.equal(localeFromPath('/en/sdk'), 'en')
// 영어 프리픽스처럼 보이는 다른 경로가 영어로 오인되면 안 된다.
assert.equal(localeFromPath('/enterprise'), 'ko')

assert.equal(pathWithLocale('/sdk', 'en'), '/en/sdk')
assert.equal(pathWithLocale('/en/sdk', 'ko'), '/sdk')
assert.equal(pathWithLocale('/', 'en'), '/en')
assert.equal(pathWithLocale('/en', 'ko'), '/')
assert.equal(pathWithLocale('/en', 'en'), '/en')

assert.equal(localizedHref('/', 'en'), '/en')
assert.equal(localizedHref('/how-it-works', 'en'), '/en/how-it-works')
assert.equal(localizedHref('/how-it-works', 'ko'), '/how-it-works')

// Self-hosting routes: the hub and every method page exist under `/` and under `/en`.
assert.deepEqual(selfHostingPaths, [
  '/self-hosting',
  '/self-hosting/install-script',
  '/self-hosting/docker-compose',
  '/self-hosting/desktop-app',
])
for (const path of selfHostingPaths) {
  assert.equal(localeFromPath(localizedHref(path, 'en')), 'en')
  assert.equal(pathWithLocale(localizedHref(path, 'en'), 'ko'), path)
}

// Every hub card points at a registered route, every method has a page and a card, in both locales.
for (const locale of locales) {
  const { chooser, methods } = messages[locale].selfHosting
  assert.deepEqual(chooser.cards.map((card) => card.id).sort(), [...selfHostingMethodIds].sort())
  for (const card of chooser.cards) {
    assert.ok(selfHostingPaths.includes(selfHostingMethodPath(card.id)), `${locale}: ${card.id}`)
    assert.ok(card.name && card.audience && card.cta, `${locale}: ${card.id} card is incomplete`)
    assert.ok(methods[card.id].steps.length > 0, `${locale}: ${card.id} has no steps`)
  }
  assert.ok(selfHostingPaths.includes(selfHostingHubPath))
}

// Both locales carry the same page shape: same steps per method, same sections after install.
assert.equal(messages.ko.selfHosting.afterInstall.length, messages.en.selfHosting.afterInstall.length)
for (const id of selfHostingMethodIds) {
  assert.equal(messages.ko.selfHosting.methods[id].steps.length, messages.en.selfHosting.methods[id].steps.length)
}

// The landing map places features by key, so both locales list the same features in the same order.
assert.deepEqual(
  messages.ko.features.items.map((item) => item.key),
  messages.en.features.items.map((item) => item.key),
)

// The landing metrics region: every label exists in both locales, bars have a positive scale, the matrix layout
// uses each cell once, and the highlighted bar names a real metric.
assert.equal(new Set(metrics.map((metric) => metric.key)).size, metrics.length)
for (const metric of metrics) {
  for (const locale of locales) assert.ok(metric.label[locale], `${metric.key}: missing ${locale} label`)
  assert.ok(metric.max > 0, `${metric.key}: max must be positive`)
  assert.ok(['prefix', 'suffix'].includes(metric.unitPosition), `${metric.key}: unitPosition`)
}
assert.ok(metrics.some((metric) => metric.key === highlightedMetric), `highlighted metric ${highlightedMetric} has no bar`)
const cellKeys = ['tp', 'fp', 'fn', 'tn'] as const
assert.deepEqual(confusionLayout.flat().sort(), [...cellKeys].sort())
for (const key of cellKeys) {
  for (const locale of locales) assert.ok(confusionCells[key].label[locale], `${key}: missing ${locale} label`)
}
for (const rate of confusionRates) {
  for (const locale of locales) assert.ok(rate.label[locale], `${rate.key}: missing ${locale} label`)
}
for (const locale of locales) {
  for (const [key, text] of Object.entries(messages[locale].metrics.axes)) assert.ok(text, `${locale}: metrics.axes.${key}`)
  assert.ok(messages[locale].metrics.collecting, `${locale}: metrics.collecting`)
}

// While collecting, the region shows no number at all: every value is null and every sign reads as the placeholder.
// Once live, every count is a non-negative integer and every bar has a value, so the rates can be computed.
if (metricsStatus === 'collecting') {
  for (const key of cellKeys) assert.equal(confusionCounts[key], null, `${key}: collecting counts must be null`)
  for (const metric of metrics) assert.equal(metric.value, null, `${metric.key}: collecting values must be null`)
  for (const locale of locales) {
    const shown = [
      ...cellKeys.map((key) => formatCount(confusionCounts[key], locale)),
      ...confusionRates.map((rate) => formatRate(confusionRate(rate, confusionCounts), locale)),
      ...metrics.map((metric) => formatMetricValue(metric, locale)),
    ]
    for (const text of shown) assert.doesNotMatch(text, /\d/, `${locale}: collecting region shows a number (${text})`)
  }
} else {
  for (const key of cellKeys) {
    const count = confusionCounts[key]
    assert.ok(count !== null && Number.isInteger(count) && count >= 0, `${key}: count must be a non-negative integer`)
  }
  for (const metric of metrics) assert.ok(metric.value !== null && metric.value >= 0, `${metric.key}: live value is missing`)
  for (const rate of confusionRates) assert.notEqual(confusionRate(rate, confusionCounts), null, `${rate.key}: rate cannot be computed`)
}

// The wishlist dialog carries the same strings in both locales.
assert.deepEqual(Object.keys(wishlistCopy.ko).sort(), Object.keys(wishlistCopy.en).sort())
for (const locale of locales) {
  const copy = wishlistCopy[locale]
  for (const [key, text] of Object.entries(copy)) assert.ok(text, `${locale}: wishlist.${key}`)
  // The dialog swaps these tokens for the joined address and the contact address.
  assert.ok(copy.joinedBody.includes('{email}'), `${locale}: wishlist.joinedBody needs {email}`)
  assert.ok(copy.note.includes('{contact}'), `${locale}: wishlist.note needs {contact}`)
}

console.log('locale checks passed')
