import { useLocation } from 'react-router-dom'
import { messages } from './messages'
import { localeFromPath, localizedHref, pathWithLocale, type Locale } from './locale'

export function useCopy() {
  const { pathname } = useLocation()
  const locale = localeFromPath(pathname)

  return {
    locale,
    t: messages[locale],
    href: (to: string) => localizedHref(to, locale),
    swapTo: (next: Locale) => pathWithLocale(pathname, next),
  }
}
