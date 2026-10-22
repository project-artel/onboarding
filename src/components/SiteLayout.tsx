import { Fragment, useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useCopy } from '../i18n/useCopy'
import { locales, pathWithLocale } from '../i18n/locale'
import { BrandMark } from './BrandMark'
import { InstallMenu, InstallTabs } from './InstallNav'
import { applyTheme, currentTheme } from '../theme'
import { AuthControls } from '../auth/AuthControls'
import { documentation } from '../docs/content'

const siteOrigin = 'https://artel.kr'

export function SiteLayout() {
  const { locale, t, href, swapTo } = useCopy()
  const { pathname, hash } = useLocation()
  const [theme, setTheme] = useState(currentTheme)

  const doc = documentation(locale).find(page => page.path === pathWithLocale(pathname, 'ko').replace(/\/$/, ''))
  const title = doc ? `${doc.title} · ARTEL Developer Docs` : t.meta.title
  const description = doc?.description ?? t.meta.description

  // 정적 `index.html`은 한국어를 실어 내보낸다. 로케일이 정해지면 스크린리더와
  // 검색엔진이 보는 값도 같이 맞춘다.
  useEffect(() => {
    document.documentElement.lang = locale
    document.title = title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description)

    // 같은 문서를 경로마다 다시 쓰므로 canonical 과 공유 미리보기 값도 경로를 따라간다.
    const url = siteOrigin + (pathname === '/' ? '/' : pathname.replace(/\/$/, ''))
    const set = (selector: string, attribute: string, value: string) =>
      document.querySelector(selector)?.setAttribute(attribute, value)
    set('link[rel="canonical"]', 'href', url)
    set('meta[property="og:url"]', 'content', url)
    set('meta[property="og:title"]', 'content', title)
    set('meta[property="og:description"]', 'content', description)
    set('meta[property="og:locale"]', 'content', locale === 'ko' ? 'ko_KR' : 'en_US')
    set('meta[property="og:locale:alternate"]', 'content', locale === 'ko' ? 'en_US' : 'ko_KR')
    set('meta[name="twitter:title"]', 'content', title)
    set('meta[name="twitter:description"]', 'content', description)
    for (const lang of locales) set(`link[rel="alternate"][hreflang="${lang}"]`, 'href', siteOrigin + pathWithLocale(pathname, lang))
    set('link[rel="alternate"][hreflang="x-default"]', 'href', siteOrigin + pathWithLocale(pathname, 'ko'))
  }, [locale, title, description, pathname])

  // 경로가 바뀌면 위에서부터 읽는다. 라우터 기본값은 스크롤 위치를 유지한다.
  useEffect(() => {
    if (hash) {
      const frame = window.requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
      return () => window.cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <>
      <a className="skip-link" href="#main">
        {t.nav.skipToContent}
      </a>
      <header className="site-header">
        <div className="shell site-header__inner">
          <Link aria-label="ARTEL" className="brand" to={href('/')}>
            <BrandMark size={24} />
            <span className="brand__word">ARTEL</span>
          </Link>
          <nav className="site-nav" aria-label={t.nav.home}>
            <InstallMenu />
            <Link to={href('/docs')} aria-current={doc ? 'page' : undefined}>{locale === 'ko' ? '개발자 문서' : 'Developer docs'}</Link>
          </nav>
          <div className="locale" role="group" aria-label={t.footer.language}>
            {locales.map((next, i) => (
              <Fragment key={next}>
                {i > 0 && (
                  <span aria-hidden="true" className="locale__sep">
                    /
                  </span>
                )}
                <Link
                  to={swapTo(next)}
                  aria-current={next === locale ? 'true' : undefined}
                  hrefLang={next}
                >
                  {next.toUpperCase()}
                </Link>
              </Fragment>
            ))}
          </div>
          <button
            aria-label={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
            className="theme-toggle"
            onClick={() => {
              const next = theme === 'dark' ? 'light' : 'dark'
              applyTheme(next)
              setTheme(next)
            }}
            type="button"
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
          <AuthControls />
        </div>
      </header>
      <InstallTabs />

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__inner">
          <span className="brand brand--footer">
            <BrandMark size={18} />
            <span className="brand__word">ARTEL</span>
          </span>
          <a href="https://github.com/project-artel" rel="noreferrer noopener" target="_blank">
            {t.footer.repository}
          </a>
          <span className="site-footer__copy">© 2026 ARTEL</span>
        </div>
      </footer>
    </>
  )
}
