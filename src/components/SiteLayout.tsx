import { Fragment, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useCopy } from '../i18n/useCopy'
import { locales } from '../i18n/locale'
import { BrandMark } from './BrandMark'
import { applyTheme, currentTheme } from '../theme'

export function SiteLayout() {
  const { locale, t, href, swapTo } = useCopy()
  const { pathname } = useLocation()
  const [theme, setTheme] = useState(currentTheme)

  // SDK 페이지에서는 헤더 CTA를 생략한다. 이미 그 페이지가 목적지다.
  const onSdkPage = pathname === '/sdk' || pathname === '/en/sdk'

  // 정적 `index.html`은 한국어를 실어 내보낸다. 로케일이 정해지면 스크린리더와
  // 검색엔진이 보는 값도 같이 맞춘다.
  useEffect(() => {
    document.documentElement.lang = locale
    document.title = t.meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t.meta.description)
  }, [locale, t])

  // 경로가 바뀌면 위에서부터 읽는다. 라우터 기본값은 스크롤 위치를 유지한다.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

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
            <NavLink to={href('/sdk')}>{t.nav.sdk}</NavLink>
            <NavLink to={href('/how-it-works')}>{t.nav.how}</NavLink>
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
          {!onSdkPage && (
            <Link className="btn btn--sm btn--primary" to={href('/sdk')}>
              {t.hero.primaryCta}
            </Link>
          )}
        </div>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__inner">
          <span className="brand brand--footer">
            <BrandMark size={18} />
            <span className="brand__word">ARTEL</span>
          </span>
          <a href="mailto:contact@artel.dev">{t.footer.contact}</a>
          <a href="https://github.com/project-artel" rel="noreferrer noopener" target="_blank">
            {t.footer.repository}
          </a>
          <span className="site-footer__copy">© 2026 ARTEL</span>
        </div>
      </footer>
    </>
  )
}
