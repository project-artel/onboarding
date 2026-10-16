import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useCopy } from '../i18n/useCopy'

// 설치 방법으로 가는 경로들. 상단 메뉴와 설치 페이지의 보조 탭이 같은 목록을 쓴다.
const installPaths = ['/sdk', '/cli', '/skills', '/self-hosting'] as const

function isInstallPath(pathname: string): boolean {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  return installPaths.some((path) => bare === path || bare.startsWith(`${path}/`))
}

function useInstallLinks() {
  const { t, href } = useCopy()
  return [
    { to: href('/sdk'), label: t.nav.sdk },
    { to: href('/cli'), label: t.nav.cli },
    { to: href('/skills'), label: t.nav.skills },
    { to: href('/self-hosting'), label: t.nav.selfHosting },
  ]
}

/** 상단 내비의 `설치` 항목. 버튼을 누르면 네 가지 설치 페이지 링크가 펼쳐진다. */
export function InstallMenu() {
  const { t } = useCopy()
  const { pathname } = useLocation()
  const links = useInstallLinks()
  // 메뉴를 연 경로를 기억해 두면 페이지를 옮기는 순간 자동으로 닫힌 상태가 된다.
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const open = openedAt === pathname
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpenedAt(null)
    }
    // Escape 로 닫으면 열었던 버튼으로 포커스를 돌려 키보드 사용자가 자리를 잃지 않게 한다.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpenedAt(null)
      button.current?.focus()
    }
    const onFocusIn = (event: FocusEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpenedAt(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [open])

  return (
    <div className="nav-menu" ref={root}>
      <button
        ref={button}
        type="button"
        className="nav-menu__button"
        aria-expanded={open}
        aria-controls="install-menu"
        data-active={isInstallPath(pathname) ? 'true' : undefined}
        onClick={() => setOpenedAt(open ? null : pathname)}
      >
        {t.nav.install}
        <span aria-hidden="true" className="nav-menu__caret" />
      </button>
      {open && (
        <ul id="install-menu" className="nav-menu__list" aria-label={t.nav.installMenu}>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to}>{link.label}</NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** 설치 페이지 헤더 아래의 보조 탭. 현재 페이지에 `aria-current="page"` 가 붙는다. */
export function InstallTabs() {
  const { t } = useCopy()
  const { pathname } = useLocation()
  const links = useInstallLinks()
  if (!isInstallPath(pathname)) return null
  return (
    <nav className="install-tabs" aria-label={t.nav.installMenu}>
      <div className="shell install-tabs__inner">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
