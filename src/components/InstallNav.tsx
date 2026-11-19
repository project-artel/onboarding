import { NavLink, useLocation } from 'react-router-dom'
import { gettingStartedCopy } from '../i18n/gettingStarted'
import { isGettingStartedPath } from '../i18n/gettingStartedRoutes'
import { useCopy } from '../i18n/useCopy'

export function InstallTabs() {
  const { locale, t, href } = useCopy()
  const { pathname } = useLocation()
  if (!isGettingStartedPath(pathname)) return null
  const links = [
    { to: href('/getting-started'), label: gettingStartedCopy[locale].title },
    { to: href('/sdk'), label: t.nav.sdk },
    { to: href('/skills'), label: t.nav.skills },
    { to: href('/cli'), label: t.nav.cli },
    { to: href('/self-hosting'), label: t.nav.selfHosting },
  ]
  return (
    <nav className="install-tabs" aria-label={gettingStartedCopy[locale].title}>
      <div className="shell install-tabs__inner">
        {links.map(link => <NavLink key={link.to} to={link.to}>{link.label}</NavLink>)}
      </div>
    </nav>
  )
}
