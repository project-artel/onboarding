import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { LandingPage } from './pages/LandingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SdkPage } from './pages/SdkPage'

// 로케일별 경로를 같은 트리로 두 번 등록한다. 옵셔널 세그먼트 하나로 줄일 수는
// 있지만, 그러면 `/enterprise` 같은 미래 경로가 영어 프리픽스로 오인된다.
function localeRoutes() {
  return (
    <>
      <Route index element={<LandingPage />} />
      <Route path="sdk" element={<SdkPage />} />
      <Route path="how-it-works" element={<HowItWorksPage />} />
    </>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SiteLayout />}>
          {localeRoutes()}
        </Route>
        <Route path="/en" element={<SiteLayout />}>
          {localeRoutes()}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
