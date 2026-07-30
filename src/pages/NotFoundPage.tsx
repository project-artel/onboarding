import { Link, useLocation } from 'react-router-dom'
import { localeFromPath } from '../i18n/locale'
import { messages } from '../i18n/messages'

export function NotFoundPage() {
  const { pathname } = useLocation()
  const locale = localeFromPath(pathname)
  const t = messages[locale].notFound

  return (
    <section className="section">
      <div className="container prose">
        <h1>{t.title}</h1>
        <p className="lead">{t.body}</p>
        <Link className="button button--primary" to={locale === 'en' ? '/en' : '/'}>
          {t.back}
        </Link>
      </div>
    </section>
  )
}
