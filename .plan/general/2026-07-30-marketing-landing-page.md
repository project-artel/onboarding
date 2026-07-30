# 2026-07-30 — 온보딩 홍보 페이지 기획

- Date: 2026-07-30
- GitHub Issue: None
- Jira Epic: ARTEL-199
- Status: Draft

## Goal

ARTEL을 처음 접한 사람이 "Unity 게임 QA를 AI 에이전트가 대신 돌린다"는 가치를 이해하고, 스스로 Unity SDK를 내려받아 설치 문서까지 도달하게 한다. 주 전환은 **SDK 다운로드**, 보조 전환은 **설치 문서 열람**이다. 한국어·영어를 함께 제공한다.

## Non-goals

- 회원가입·로그인 연동 (Auth API 미구현)
- 가격·결제 페이지
- 실제 게임을 붙인 라이브 데모
- CMS·블로그·사례 콘텐츠
- 제3 언어

## Context / Constraints

**제품 상태.** 2026-07-30 기준 Notion API 명세 99행 중 동작하는 경로는 `/health`, `POST /api/sdkId`, SDK WebSocket 연결(`ws://{serverAddress}/ws/sdk?sdkId=`), `POST /api/orchestration/action/{sdkId}`뿐이다. 즉 **SDK ↔ Orchestrator 실시간 제어만 실재**하고, 시나리오 생성·QA 실행·이슈 조회는 명세 단계다. 홍보 문구는 이 경계를 지켜야 한다. 되는 것은 단정하고, 나머지는 "개발 예정" 라벨을 붙인다.

**전환 목표의 의미.** CTA가 SDK 다운로드이므로 1차 독자는 Unity 개발자다. 카피는 마케팅 형용사보다 설치 절차·요구사항·연결 확인 방법이 먼저 보이게 쓴다. 의사결정자용 설명은 `/how-it-works`로 분리한다.

**디자인.** `.agents/docs/DESIGN.md` 토큰을 쓴다. 다만 그 문서는 Replay Studio(고밀도 다크 툴 UI) 기준이다. 홍보 페이지는 읽기 위한 화면이라 본문 14px·행간 21px을 그대로 쓰면 답답하다. 토큰은 유지하고 스케일만 한 단계 키운다(본문 16/26, Display 40/48 수준). 색은 그대로 쓴다 — 시안=액션, 바이올렛=에이전트 추론, 코랄=실패 증거. 강조색은 CTA와 상태 표시에만 쓰고 장식에는 쓰지 않는다.

**기술.** React 19 + Vite 8, `react-router-dom` 도입 예정, `vercel.json`에 SPA rewrite 이미 있음. 다국어는 `artel-home`의 `src/i18n`(`LocaleProvider`, `messages`) 구조를 옮긴다. 단, 홍보 페이지는 검색·공유가 중요하므로 로케일을 경로에 노출한다(`/`, `/en/...`).

## 페이지 구조 (IA)

### `/` 랜딩

| 순서 | 섹션 | 전달할 것 | 근거 |
|---|---|---|---|
| 1 | Hero | 한 줄 가치 제안 + SDK 다운로드(주 CTA) + 설치 문서(보조 CTA) | — |
| 2 | 문제 | 회귀 QA를 사람이 반복하는 비용, 빌드마다 같은 시나리오를 다시 도는 문제 | 제품 전제 |
| 3 | 작동 원리 3단계 | ① SDK를 게임에 임베드 ② 에이전트가 직접 플레이 ③ 리플레이·이슈 증거 확인 | SDK WebSocket, action 주입은 구현 완료 |
| 4 | 기능 카드 | 시나리오 자동 생성, 키·마우스 입력 주입, Scene 상태 스캔, 이슈 증거 기록, 테스트 런 구성 | Notion 명세 카테고리 |
| 5 | 요구사항 | Unity 버전, WebSocket 연결 조건, 서버 주소 설정 | SDK 연결 스펙 |
| 6 | CTA 반복 | Hero와 같은 두 버튼 | — |
| 7 | FAQ | 게임 소스가 필요한가 / 어떤 장르에 되는가 / 데이터는 어디에 남는가 / 지금 어디까지 되는가 | 미구현 범위를 여기서 정직하게 밝힌다 |
| 8 | 푸터 | 문의 메일, GitHub, 언어 전환 | — |

### `/sdk` — SDK 설치

단계별 안내: 패키지 추가 → `sdkId` 발급 → 서버 주소 설정 → 연결 확인. 각 코드 블록에 복사 버튼. 연결 실패 시 확인 항목(방화벽, ws 주소, `sdkId`). `artel-home`에 이미 있는 SDK 설치 가이드와 문구를 맞춘다.

### `/how-it-works` — 작동 원리 상세

구성 요소 4개(Unity SDK / Agent 서버 / Orchestrator / 대시보드)와 데이터 흐름: Scene 상태 보고 → 에이전트 판단 → 액션 주입 → 이슈·로그 기록. QA 수명주기(시나리오 생성 → 승인 → 테스트 런 → QA 실행 → 이슈 조회)와 기획서에서 `game_context`를 뽑는 흐름. 다이어그램은 인라인 SVG로 만들어 다국어 텍스트를 넣는다.

### 라우팅·로케일 규칙

- 한국어: `/`, `/sdk`, `/how-it-works`
- 영어: `/en`, `/en/sdk`, `/en/how-it-works`
- 최초 진입은 브라우저 언어로 판단, 이후 선택을 저장. 언어 전환 시 현재 경로를 유지한다.
- 없는 경로는 404 화면. `vercel.json` rewrite가 모든 경로를 `index.html`로 보낸다.

## Approach (Checklist)

- [ ] **Step 0: Recon** — `artel-home`의 `src/i18n`, `src/styles`, SDK 설치 가이드 화면 확인. 재사용 범위 확정
- [ ] **Step 1: 골격** (ARTEL-200) — `react-router-dom` 도입, 3개 경로 + `/en` 프리픽스, `LocaleProvider` 이식, 404
- [ ] **Step 2: 랜딩** (ARTEL-201) — 8개 섹션 구현, 반응형 375/768/1440
- [ ] **Step 3: 서브 페이지** (ARTEL-202, ARTEL-203) — SDK 설치 단계와 작동 원리 상세
- [ ] **Step 4: 카피·SEO** (ARTEL-204) — ko/en 문구, `hreflang`, Open Graph, `robots.txt`, `sitemap.xml`
- [ ] **Step 5: 배포·품질** (ARTEL-205) — Vercel 프리뷰에서 서브 경로 검증, 도메인 연결, Lighthouse 접근성·성능 90 이상

## Validation

- **Commands to run:** `npm run build`, `npm run lint`, `npm run typecheck`
- **Expected output:** 빌드·린트·타입 무오류. Vercel 프리뷰에서 `/sdk`, `/en/how-it-works` 직접 진입과 새로고침이 404 없이 열림. Lighthouse 접근성·성능 90 이상. 375px 폭에서 가로 스크롤 없음. 키보드 Tab만으로 모든 CTA 도달.

## 성과 측정

SDK 다운로드 클릭, 설치 스니펫 복사, `/sdk` 도달률을 본다. 분석 도구는 아직 없으므로 Vercel Analytics 수준에서 시작하고, 필요해지면 이벤트 추적을 붙인다.

## Risks & Rollback

- **과장 리스크:** 미구현 기능을 되는 것처럼 쓰면 도입 후 신뢰를 잃는다. FAQ에 현재 범위를 명시하고 "예정" 라벨을 강제한다.
- **디자인 불일치:** Replay Studio 다크 테마가 홍보 페이지로는 무거울 수 있다. 스케일만 키우고 색 체계는 유지해 본 서비스와의 연속성을 지킨다.
- **SEO 한계:** SPA라 프리렌더가 없다. 초기에는 메타·`hreflang`·`sitemap`으로 버티고, 검색 유입이 실제 목표가 되면 정적 생성으로 옮긴다.
- **Rollback steps:** 브랜치 되돌리기. 런타임 인프라나 데이터 마이그레이션 없음.

## Open Questions

- 도메인은 무엇으로 하나 (예: `artel.gg`, `artel.dev`)
- 로고·브랜드 자산(워드마크, og:image 원본)은 누가 주나
- SDK 배포 경로는 무엇인가 — 공개 GitHub 릴리스, Unity Package Manager URL, 아니면 직접 다운로드
- 문의 창구는 메일인가 별도 폼인가
- 지원 Unity 버전 범위 확정 필요
