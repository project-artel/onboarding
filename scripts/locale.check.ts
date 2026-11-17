// 경로↔로케일 변환은 잘못되면 언어 전환이 홈으로 튀거나 영어 경로가 한국어로
// 열린다. 러너 없이 `npm run check` 한 줄로 돈다.
import assert from 'node:assert/strict'
import { localeFromPath, localizedHref, locales, pathWithLocale } from '../src/i18n/locale.ts'
import { messages } from '../src/i18n/messages.ts'
import { videoCategories, videos } from '../src/pages/landing/videos.ts'
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

// The landing videos region: at least one video, unique keys, a title and a one-line summary in both locales, a known
// category, a readable duration when one is given, and a usable source once a video is published.
assert.ok(videos.length >= 1, 'videos: at least one item')
assert.equal(new Set(videos.map((video) => video.key)).size, videos.length, 'videos: duplicate key')
for (const video of videos) {
  assert.ok(video.key, 'videos: empty key')
  assert.ok(video.category in videoCategories, `${video.key}: unknown category ${video.category}`)
  for (const locale of locales) {
    assert.ok(video.title[locale]?.trim(), `${video.key}: missing ${locale} title`)
    const summary = video.summary[locale]?.trim()
    assert.ok(summary, `${video.key}: missing ${locale} summary`)
    // Summaries are one-line noun phrases (user-copy.md), so no line breaks and no closing period.
    assert.doesNotMatch(summary, /\n|[.。]$/, `${video.key}: ${locale} summary must be one noun phrase`)
  }
  if (video.duration !== undefined) assert.match(video.duration, /^\d{1,2}:\d{2}(:\d{2})?$/, `${video.key}: duration ${video.duration}`)
  if (video.source?.kind === 'youtube') assert.match(video.source.id, /^[\w-]{6,}$/, `${video.key}: YouTube id`)
  if (video.source?.kind === 'file') assert.ok(video.source.src.trim(), `${video.key}: file src`)
}
for (const locale of locales) {
  for (const [key, label] of Object.entries(videoCategories)) assert.ok(label[locale], `${locale}: video category ${key}`)
  for (const [key, text] of Object.entries(messages[locale].videos)) assert.ok(text, `${locale}: videos.${key}`)
  // Frame and featured-screen button names put the video title into `{title}`.
  for (const key of ['show', 'play'] as const) assert.ok(messages[locale].videos[key].includes('{title}'), `${locale}: videos.${key} needs {title}`)
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
