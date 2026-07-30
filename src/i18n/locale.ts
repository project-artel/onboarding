export type Locale = 'ko' | 'en'

export const locales: Locale[] = ['ko', 'en']

// 로케일은 경로가 진실이다. 홍보 페이지는 공유·검색으로 들어오므로 저장된
// 선택보다 URL이 우선해야 링크가 보낸 사람 의도대로 열린다.
export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ko'
}

/** 같은 화면의 다른 로케일 경로. 언어를 바꿔도 보던 페이지에 머문다. */
export function pathWithLocale(pathname: string, locale: Locale): string {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  if (locale === 'ko') return bare
  return bare === '/' ? '/en' : `/en${bare}`
}

/** 현재 로케일을 유지한 내부 링크 경로. */
export function localizedHref(to: string, locale: Locale): string {
  if (locale === 'ko') return to
  return to === '/' ? '/en' : `/en${to}`
}
