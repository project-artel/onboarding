# 2026-11-03 — 랜딩 Screen Map 디자인과 설치·문서 스타일 적용

- Date: 2026-11-03
- GitHub Issue: None (Jira MCP 연결 실패로 이슈 없이 진행, owner 확인)
- Status: Implemented

## Goal

owner가 시안 3종 중 고른 C(Screen Map)를 실제 사이트에 옮긴다.

- 랜딩: 기울어진 화면 지도 위를 카메라가 섹션마다 이동하는 구성. 휠 한 번에 섹션 하나씩 이동하고, 스크롤바 대신 상단바 아래쪽 가장자리에 진행 경로를 표시한다.
- 상단바·푸터: 떠 있는 뷰파인더형 바. 모든 페이지에 같은 모양을 적용한다.
- 설치 페이지(SDK, CLI, Skill, 셀프 호스팅, 방식별 페이지): 단계는 세로 경로 위 정거장, 스크린샷과 코드는 화면 프레임. 상단바 가장자리를 읽기 진행 표시로 쓴다.
- 개발자 문서·Macro reference: 레이아웃은 그대로 두고 폰트, 강조, 글자색, 목차 현재 위치만 바꾼다.
- 로고: 헤더·푸터와 히어로에 owner의 PNG 심볼을 테마별로 쓴다.
- 기능 목록: 화면 지도와 지식 그래프를 빼고 시나리오 생성, QA 실행, MCP 지원을 넣어 7개로 만든다. 항목마다 상세 모달을 둔다.

## Non-goals

- favicon, OG 이미지, console·admin 쪽 로고 교체
- 경로 추가·삭제(sitemap.xml, llms.txt 경로 목록은 그대로)
- 시안 A·B, `mockups/` 하네스 커밋
- 문서 본문 내용 변경

## Context / Constraints

- 시안 원본: `mockups/c/`(Variant, scenes, features, geom, route, pages, theme.css, pages.css, variant.css), `mockups/shared/{snap.ts,mark.tsx}`, `mockups/switcher.css`의 랜딩 스크롤바 규칙, `mockups/assets/logo-{light,dark}.png`. 하네스 전용 선택자 `:root[data-mockup="c"]`는 옮길 때 지운다.
- 시안의 `html[data-page="landing"]`, `html[data-route]`, `--smc-hdr`는 하네스(`mockups/main.tsx`)와 `pages.tsx`가 설정했다. 실제 코드에서는 `LandingPage`와 `SiteLayout`이 맡는다.
- 새 의존성은 `gsap`(ScrollTrigger, SplitText, ScrollToPlugin) 하나다. 시안 C는 three와 lenis를 쓰지 않는다.
- 폰트 교체(Unbounded, Wanted Sans Variable)는 owner 요청이다. `DESIGN.md`의 "대체 폰트 스택 금지" 규칙과 충돌하므로 `DESIGN.md`를 새 방향에 맞게 고친다.
- 문구는 `user-copy.md`를 따른다. 새 문구는 기능 3개의 제목·본문과 7개 항목의 상세 줄뿐이고, owner와 대화에서 정했다. `messages.ts`의 ko·en을 함께 바꾸고 `npm run check`를 통과시킨다.
- 히어로 h1에 `ARTEL` 줄을 owner 요청으로 넣는다. 화면 읽기 순서는 "ARTEL Unity 게임 QA Agent"가 된다.

## Approach (Checklist)
- [x] **Step 0: Recon** — 시안 C 파일과 실제 `LandingPage`, `SiteLayout`, `BrandMark`, `messages.ts`, `marketing.css`, `macro-reference.css`, `responsive.css`의 대응 관계를 확인한다.
- [x] **Step 1: 의존성과 폰트** — `npm install gsap`. `index.html`에 Unbounded(Google Fonts)와 Wanted Sans Variable(jsdelivr) 링크 추가, 쓰지 않게 된 Space Grotesk 정리. `tokens.css`의 `--font-display`·`--font-body` 교체.
- [x] **Step 2: 로고** — PNG 두 장을 `src/assets/brand/`로 옮긴다. 헤더·푸터 심볼을 테마별 PNG로 바꾸고, 벡터가 필요한 장면용 좌표(`mark.tsx`)는 `src/components/ArtelMark.tsx`로 옮긴다. `BrandMark.tsx`를 지우거나 새 심볼로 대체한다.
- [x] **Step 3: 상단바·푸터·진행 표시** — `theme.css`를 `src/styles/site-chrome.css`(가칭)로 옮긴다. `route.tsx`(HeaderRoute)와 `pages.tsx`(상단바 높이 `--smc-hdr`, 설치 페이지 진행, 문서 목차 현재 위치)를 `src/components/`로 옮겨 `SiteLayout`에서 경로에 맞게 마운트한다.
- [x] **Step 4: 랜딩** — `Variant.tsx`, `scenes.tsx`, `features.tsx`, `geom.ts`, `variant.css`를 `src/pages/landing/`(가칭)으로 옮겨 `LandingPage`를 대체한다. `snap.ts`는 `src/lib/snap.ts`로 옮긴다. 랜딩 마운트 동안 `data-page="landing"`과 스크롤바 숨김 규칙을 적용한다.
- [x] **Step 5: 문구** — `messages.ts`의 `features` 타입에 `details` 추가, ko·en 7개 항목으로 교체. `features.tsx`의 로컬 덮어쓰기 제거. `public/llms.txt`에 기능 목록이 있으면 같은 내용으로 맞춘다.
- [x] **Step 6: 설치·문서 스타일** — `pages.css`를 `src/styles/pages.css`(가칭)로 옮기고 `data-mockup` 선택자를 걷어 낸다. 문서는 폰트·강조·색 규칙만 남았는지 확인한다.
- [x] **Step 7: 문서** — `DESIGN.md`에 새 폰트, 상단바, 랜딩 동작(스냅, 진행 경로, 지도), reduced motion 규칙을 반영한다.
- [ ] **Step 8: 검증** — 아래 명령과 Chrome 육안 확인. `typecheck`·`check`·`build`·`check:docs` 통과. `npm run lint`는 로컬에만 있는 `mockups/`의 오류로 실패하고, 그 밖(`src`, `scripts`)은 오류·경고 0. Chrome 육안 확인은 남음.

## Validation
- **Commands to run:** `npm run lint`, `npm run typecheck`, `npm run check`, `npm run build`, `npm run check:docs`
- **Expected output:** 모두 오류 없이 종료
- **Manual (Chrome, 로컬 dev 서버):**
  - 랜딩 ko·en, 라이트·다크, 1440·1024·390px
  - 휠·PageDown 스냅, 상단바 진행 경로, 기능 모달(hover, 클릭, Esc)
  - 설치 4페이지와 셀프 호스팅 방식 페이지
  - 문서 한 페이지와 Macro 한 페이지
  - reduced motion

## Risks & Rollback
- **Risks:**
  - 랜딩 JS가 크다(시안 약 2,000줄). 저사양 기기에서 CSS 3D와 상시 애니메이션 부담이 생길 수 있다. 화면 밖 장면의 반복 애니메이션은 멈춘다.
  - 휠 가로채기(스냅)는 트랙패드 관성과 충돌할 수 있다. 데스크톱 정밀 포인터에서만 켜고 모바일·reduced motion에서는 끈다.
  - 기능 상세 문구 중 시나리오 생성의 챗봇 관련 줄은 owner 확인이 필요하다.
  - 작은 코랄 라벨의 명도 대비는 기존과 같이 AA 미만으로 남는다.
- **Rollback steps:** 이 브랜치 merge commit을 `git revert`.

## Open Questions
- 시나리오 생성 상세 "챗봇이 시나리오 초안과 케이스 순서 제안"이 실제 기능과 맞는지
