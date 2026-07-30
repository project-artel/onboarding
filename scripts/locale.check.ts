// 경로↔로케일 변환은 잘못되면 언어 전환이 홈으로 튀거나 영어 경로가 한국어로
// 열린다. 러너 없이 `npm run check` 한 줄로 돈다.
import assert from 'node:assert/strict'
import { localeFromPath, localizedHref, pathWithLocale } from '../src/i18n/locale.ts'

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

console.log('locale checks passed')
