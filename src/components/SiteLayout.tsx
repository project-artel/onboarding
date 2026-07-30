import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useCopy } from '../i18n/useCopy'
import { locales } from '../i18n/locale'
import { BrandMark } from './BrandMark'

export function SiteLayout() {
  const { locale, t, href, swapTo } = useCopy()
  const { pathname } = useLocation()

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
        <div className="container site-header__inner">
          <Link aria-label="ARTEL" className="brand-link" to={href('/')}>
            <BrandMark className="brand-mark" />
          </Link>
          <nav className="site-nav" aria-label={t.nav.home}>
            <NavLink to={href('/sdk')}>{t.nav.sdk}</NavLink>
            <NavLink to={href('/how-it-works')}>{t.nav.how}</NavLink>
          </nav>
          <div className="lang-switch" role="group" aria-label={t.footer.language}>
            {locales.map((next) => (
              <Link
                key={next}
                to={swapTo(next)}
                aria-current={next === locale ? 'true' : undefined}
                hrefLang={next}
              >
                {next.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <BrandMark className="brand-mark brand-mark--footer" />
          <span className="visually-hidden">ARTEL</span>
          <a href="mailto:contact@artel.dev">{t.footer.contact}</a>
          <a href="https://github.com/project-artel" rel="noreferrer noopener" target="_blank">
            {t.footer.repository}
          </a>
        </div>
      </footer>
    </>
  )
}
