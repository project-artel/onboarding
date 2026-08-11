export type Theme = 'light' | 'dark'

const COOKIE_NAME = 'artel-theme'

/**
 * 이 페이지(artel.kr)와 console.artel.kr, admin.artel.kr은 사용자에게 한 제품이므로 선택을
 * origin이 아니라 부모 도메인에 남긴다. localStorage로는 그 경계를 넘지 못한다. apex에서 쓴
 * `Domain=.artel.kr` 쿠키는 하위 서브도메인이 모두 읽는다.
 *
 * artel.kr이 아닌 호스트(localhost, Vercel 프리뷰)에서는 Domain 없이 host-only로 남는다.
 * 쿠키는 포트를 구분하지 않아 로컬에서는 그래도 서로 공유된다.
 *
 * 이름과 속성은 artel-home·admin-page의 `src/theme.ts`, 그리고 세 레포 `index.html`의 부트
 * 스크립트와 같아야 한다.
 */
const SHARED_DOMAIN = 'artel.kr'

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content',
    theme === 'dark' ? '#14161c' : '#F7F4EE',
  )
  document.querySelector<HTMLLinkElement>('#app-favicon')?.setAttribute(
    'href',
    theme === 'dark' ? '/favicon-dark.svg' : '/favicon.svg',
  )
  persistTheme(theme)
}

export function persistTheme(theme: Theme) {
  const { hostname, protocol } = window.location
  const onSharedDomain = hostname === SHARED_DOMAIN || hostname.endsWith(`.${SHARED_DOMAIN}`)
  const domain = onSharedDomain ? `; Domain=.${SHARED_DOMAIN}` : ''
  const secure = protocol === 'https:' ? '; Secure' : ''

  document.cookie =
    `${COOKIE_NAME}=${theme}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${domain}${secure}`
}
