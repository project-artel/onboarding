import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/index.css'
import './styles/responsive.css'
// 상단바·푸터와 설치·문서 페이지 스타일은 위 두 파일의 기본 규칙을 덮어쓴다. 같은 구체성에서
// 뒤에 온 규칙이 이기도록 마지막에 불러온다.
import './styles/site-chrome.css'
import './styles/pages.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element was not found')
}

createRoot(root).render(<App />)
