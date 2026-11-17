// 랜딩 § 04 영상의 목록. 화면, 필름 띠, 좁은 화면의 카드, 재생 대화상자가 모두 이 파일만 읽는다.
// 영상을 어디에 올릴지 아직 정하지 않았으므로 YouTube와 직접 올린 파일을 둘 다 받는다.
//
// 영상을 올리면 항목의 `source`를 채운다.
// - YouTube: `{ kind: 'youtube', id: 'dQw4w9WgXcQ' }`. 재생을 누르기 전에는 YouTube 스크립트나 iframe을
//   불러오지 않는다. `poster`를 주지 않으면 YouTube 썸네일도 불러오지 않고 아래의 장면 그림을 쓴다.
// - 파일: `{ kind: 'file', src: '/videos/first-qa.mp4', poster: '/videos/first-qa.jpg' }`.
// - `null`: 준비 중. 재생 버튼 대신 `준비 중` 표시가 붙고, 대화상자는 장면 그림과 안내 문구만 보인다.
// 길이를 알면 `duration`에 `3:20`처럼 적는다. 모르면 비워 두고, 그때는 길이를 보이지 않는다.
//
// 제목과 요약은 `.agents/docs/product-terminology.md`와 `user-copy.md`를 따른다. 요약은 한 줄의
// 명사구다. 개발자 문서(`src/docs/content.ts`)에 있는 흐름만 적는다.
import type { Locale } from '../../i18n/locale'

export type VideoSource =
  | { kind: 'youtube'; id: string; poster?: string }
  | { kind: 'file'; src: string; poster?: string }
  | null

export type VideoCategory = 'start' | 'qa' | 'automation'

export const videoCategories: Record<VideoCategory, Record<Locale, string>> = {
  start: { ko: '시작하기', en: 'Getting started' },
  qa: { ko: 'QA 실행', en: 'QA runs' },
  automation: { ko: '자동화', en: 'Automation' },
}

/** 장면 그림의 종류. 영상마다 다른 그림을 쓴다. `videoArt.tsx`가 그린다. */
export type VideoArtKind = 'sdk' | 'run' | 'evidence' | 'macro' | 'ci'

export type Video = {
  key: string
  title: Record<Locale, string>
  summary: Record<Locale, string>
  category: VideoCategory
  /** `m:ss` 또는 `h:mm:ss`. 모르면 비워 둔다. */
  duration?: string
  source: VideoSource
  art: VideoArtKind
}

export const videos: Video[] = [
  {
    key: 'sdk',
    title: { ko: 'SDK 연결과 첫 로그인', en: 'Connect the SDK and sign in' },
    summary: {
      ko: 'Package Manager로 SDK 추가, Play Mode에서 로그인과 프로젝트 연결',
      en: 'SDK added from Package Manager, then sign-in and project connection in Play Mode',
    },
    category: 'start',
    source: null,
    art: 'sdk',
  },
  {
    key: 'first-qa',
    title: { ko: '첫 QA 실행', en: 'Your first QA run' },
    summary: {
      ko: '에이전트가 게임을 조작하며 시나리오의 Test Case 검증',
      en: 'The agent playing the game to verify the Test Cases in a scenario',
    },
    category: 'qa',
    source: null,
    art: 'run',
  },
  {
    key: 'evidence',
    title: { ko: '실패한 순간의 기록 확인', en: 'Inspect the failing moment' },
    summary: {
      ko: '실패한 순간의 화면, 상태, 로그를 evidence로 확인',
      en: 'Screen, state, and logs of the failing moment, kept as evidence',
    },
    category: 'qa',
    source: null,
    art: 'evidence',
  },
  {
    key: 'macro',
    title: { ko: 'Macro로 반복 조작 저장', en: 'Save repeated actions as macros' },
    summary: {
      ko: '성공한 조작을 Macro로 저장해 다음 실행에서 재사용',
      en: 'Successful actions saved as macros and reused in later runs',
    },
    category: 'automation',
    source: null,
    art: 'macro',
  },
  {
    key: 'ci',
    title: { ko: 'GitHub Actions로 빌드마다 QA', en: 'QA on every build with GitHub Actions' },
    summary: {
      ko: '빌드 job 뒤에 qa-action을 붙여 빌드마다 QA 실행',
      en: 'qa-action after the build job, running QA on every build',
    },
    category: 'automation',
    source: null,
    art: 'ci',
  },
]

/** 재생할 수 있는 영상인지. `source`가 비어 있으면 준비 중이다. */
export const isReady = (video: Video) => video.source !== null

/** 화면에 깔 포스터 주소. 없으면 장면 그림을 그린다. */
export const posterOf = (video: Video) => video.source?.poster

/** YouTube 영상의 재생 주소. 쿠키를 덜 남기는 `youtube-nocookie.com`을 쓴다. */
export const youtubeEmbedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`
