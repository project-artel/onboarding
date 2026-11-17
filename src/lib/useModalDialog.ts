// 네이티브 모달 `<dialog>`를 마운트 동안 연다. Wishlist와 랜딩 영상 대화상자가 함께 쓴다.
import { useEffect, type RefObject } from 'react'

const navKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])
const preventScroll = { preventScroll: true }

type Options = {
  /** 열 때 포커스를 줄 요소. 없으면 브라우저 기본값(첫 포커스 가능 요소)을 따른다. */
  initialFocus?: RefObject<HTMLElement | null>
  /** 대화상자 안에서 스크롤되는 상자. 휠을 막을지 정할 때 쓴다. 없으면 대화상자 자신이다. */
  scroller?: RefObject<HTMLElement | null>
}

/**
 * 마운트하면 `showModal()`로 열고, 언마운트하면 닫고 연 버튼으로 포커스를 돌려준다.
 *
 * 열고 닫을 때 브라우저가 포커스를 옮기며 뒤 페이지를 스크롤할 수 있다. 랜딩에서는 그 스크롤이 카메라와
 * 스냅 정지점을 함께 옮기므로, 열려 있는 동안 연 순간의 스크롤 위치를 지킨다. `html`의 overflow를 바꾸면
 * 랜딩의 ScrollTrigger가 다시 계산되므로 쓰지 않는다.
 *
 * 랜딩의 스냅은 window에서 휠과 이동 키를 듣는다. 대화상자 안의 입력이 뒤 페이지를 옮기지 않도록 여기서
 * 전파를 끊는다. 입력란 안의 커서 이동, 영상의 키 조작, 버튼·링크·접기의 Space는 그대로 둔다.
 */
export function useModalDialog(dialogRef: RefObject<HTMLDialogElement | null>, { initialFocus, scroller }: Options = {}) {
  useEffect(() => {
    const element = dialogRef.current
    if (!element) return
    const previousFocus = document.activeElement
    const x = window.scrollX
    const y = window.scrollY
    const hold = () => {
      if (window.scrollX !== x || window.scrollY !== y) window.scrollTo({ left: x, top: y, behavior: 'instant' })
    }

    element.showModal()
    initialFocus?.current?.focus(preventScroll)
    hold()
    window.addEventListener('scroll', hold)

    const onKey = (event: KeyboardEvent) => {
      if (!navKeys.has(event.key)) return
      event.stopPropagation()
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, video, [contenteditable]')) return
      if (event.key === ' ' && target?.closest('button, a, summary')) return
      event.preventDefault()
    }
    const onWheel = (event: WheelEvent) => {
      event.stopPropagation()
      const box = scroller?.current ?? element
      if (box.scrollHeight <= box.clientHeight) event.preventDefault()
    }
    element.addEventListener('keydown', onKey)
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('scroll', hold)
      element.removeEventListener('keydown', onKey)
      element.removeEventListener('wheel', onWheel)
      element.close()
      if (previousFocus instanceof HTMLElement) previousFocus.focus(preventScroll)
      hold()
      // 닫은 뒤 브라우저가 다음 프레임에 포커스를 다시 맞추며 스크롤하는 경우도 되돌린다.
      window.requestAnimationFrame(hold)
    }
  }, [dialogRef, initialFocus, scroller])
}
