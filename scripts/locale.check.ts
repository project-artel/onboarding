// 경로↔로케일 변환은 잘못되면 언어 전환이 홈으로 튀거나 영어 경로가 한국어로
// 열린다. 러너 없이 `npm run check` 한 줄로 돈다.
import assert from 'node:assert/strict'
import { localeFromPath, localizedHref, locales, pathWithLocale } from '../src/i18n/locale.ts'
import { messages } from '../src/i18n/messages.ts'
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
  '/self-hosting/docker',
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

console.log('locale checks passed')
