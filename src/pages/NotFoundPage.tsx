import { Link, useLocation } from 'react-router-dom'
import { localeFromPath } from '../i18n/locale'
import { messages } from '../i18n/messages'

export function NotFoundPage() {
  const { pathname } = useLocation()
  const locale = localeFromPath(pathname)
  const t = messages[locale].notFound

  return (
    <main>
      <div className="shell not-found">
        <h1 className="hero__title page-hero__title">{t.title}</h1>
        <p className="hero__lead">{t.body}</p>
        <Link className="btn btn--primary not-found__cta" to={locale === 'en' ? '/en' : '/'}>
          {t.back}
        </Link>
      </div>
    </main>
  )
}
