// 랜딩이 아닌 페이지(설치·문서)에 덧붙이는 장식. `SiteLayout`이 랜딩 밖에서만 마운트한다.
// - 뜬 상단바 높이를 `--header-h`로 알려 고정 목록과 앵커가 그 아래에 오게 한다.
// - 설치 페이지: 상단바 아래쪽 가장자리가 경로가 되어, 섹션마다 정거장 칸이 있고 읽은 만큼 코랄로 찬다.
// - 문서: 오른쪽 목차에 지금 읽는 절을 표시한다. 문서에는 움직임을 더하지 않는다.
// - 설치 페이지를 옮겨 다닐 때만 히어로가 가볍게 올라온다.
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { HeaderRoute } from './HeaderRoute'

const isDocs = (path: string) => /^\/(docs|macro)(\/|$)/.test(path)

export function PageChrome() {
  const { pathname } = useLocation()
  const route = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  const docs = isDocs(route)
  const first = useRef(true)

  /* 상단바 높이 */
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header')
    const root = document.documentElement
    if (!header) return
    const sync = () => root.style.setProperty('--header-h', `${header.offsetHeight}px`)
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(header)
    return () => {
      ro.disconnect()
      root.style.removeProperty('--header-h')
    }
  }, [])

  /* 설치 페이지를 옮길 때 히어로가 올라온다. 첫 로드에는 이미 그려진 화면을 다시 숨기지 않는다. */
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (docs || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = document.querySelectorAll('main .hero__copy > *')
    if (!items.length) return
    const tween = gsap.from(items, { y: 16, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07 })
    return () => {
      tween.revert()
    }
  }, [pathname, docs])

  /* 문서 목차의 현재 절 */
  useEffect(() => {
    if (!docs) return
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.macro-docs__section'))
    if (!sections.length) return
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.macro-docs__toc a, .macro-docs__mobile-toc a'))
    let current = ''
    const mark = () => {
      const line = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64) + 32
      let id = sections[0].id
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) id = s.id
        else break
      }
      if (id === current) return
      current = id
      links.forEach((a) => {
        if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'location')
        else a.removeAttribute('aria-current')
      })
    }
    let frame = 0
    const queue = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        mark()
      })
    }
    mark()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      links.forEach((a) => a.removeAttribute('aria-current'))
    }
  }, [pathname, docs])

  if (docs) return null

  // 설치 페이지의 섹션이 정거장이다. 칸은 문서 안 위치 비율대로 놓인다.
  const stops = () => {
    const hdr = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 64
    return Array.from(document.querySelectorAll('main > section')).map((el) =>
      Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - hdr)),
    )
  }
  return <HeaderRoute stops={stops} spacing="proportional" layoutKey={pathname} />
}
