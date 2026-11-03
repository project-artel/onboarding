import { useLayoutEffect } from 'react'
import { useCopy } from '../i18n/useCopy'
import { Landing } from './landing/Landing'

export function LandingPage() {
  const { locale } = useCopy()

  // 스크롤바 숨김과 상단바 투명 배경은 랜딩에서만 쓴다. 긴 문서는 기본 스크롤바를 둔다.
  useLayoutEffect(() => {
    document.documentElement.dataset.page = 'landing'
    return () => {
      delete document.documentElement.dataset.page
    }
  }, [])

  // 로케일이 바뀌면 SplitText가 쪼갠 DOM을 React가 다시 맞추지 못하므로 통째로 다시 마운트한다.
  return <Landing key={locale} />
}
