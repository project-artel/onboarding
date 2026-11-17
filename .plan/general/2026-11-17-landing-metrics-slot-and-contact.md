# 2026-11-17 — 랜딩 평가 지표 영역 추가, 상단바 로그인 제거와 Wishlist 신청 추가

- Date: 2026-11-17
- GitHub Issue: None
- Status: Review

## Goal

owner 요청을 반영합니다. 4차 owner 방향(아래 Step 1의 마지막 항목)이 앞의 요청을 고쳤습니다.

1. 랜딩 § 03 기능과 FAQ 사이에 § 04 평가 지표 영역을 넣습니다. 실제 값이 아직 없으므로 숫자 없이 `수집 중` 상태로 보이고, 값을 넣고 상태만 바꾸면 실제 지표가 되도록 만듭니다. FAQ는 § 05가 됩니다.
2. 상단바에서 로그인, 회원가입, Console 링크를 없애고 그 자리에 `Wishlist` 버튼과 이메일 신청 대화상자를 둡니다.
3. 문의는 대화상자 없이 푸터에 `Contact Us contact@artel.kr` 글자로 보입니다.

## Non-goals

- 실제 평가 지표의 정의, 계산, 서버 연동은 범위 밖입니다.
- `POST /wishlist` 엔드포인트는 orchestration 저장소에서 따로 만듭니다. 이 저장소는 그 계약을 따르는 화면만 만듭니다.
- `src/auth/`는 지우지 않고 나중에 다시 쓰도록 남깁니다. 로그인을 다시 붙이는 일은 범위 밖입니다.
- 라우트를 추가하지 않으므로 `public/sitemap.xml`과 `public/llms.txt`는 바꾸지 않습니다.

## Context / Constraints

- 랜딩의 § 01–§ 03은 한 판 위의 영역이고, 카메라가 섹션마다 그 영역으로 날아갑니다. 새 영역도 같은 `Region`, `data-sign`/`data-anchor`, `CAM`, 정지점(`data-station`) 구조를 따릅니다.
- `.agents/docs/DESIGN.md`: 상자 카드와 번진 그림자 없이 화면, 경로, 토큰, translateZ 깊이로 그립니다. 움직임 줄이기와 720px 이하에서는 정적인 지도 띠 위에 표지판을 쌓습니다.
- `.agents/docs/product-terminology.md`: 테스트 커버리지는 QA 통과율과 다른 지표입니다.
- `.agents/docs/user-copy.md`: 독자에게 하는 말은 해요체, 느낌표와 이모지는 쓰지 않습니다. `Wishlist`와 `Contact Us`는 owner가 정한 표기라 두 언어에서 같게 둡니다.
- Wishlist 계약: `POST ${VITE_ORCHESTRATION_URL}/wishlist`, 본문 `{ "email": string, "locale": "ko" | "en", "consent": true }`, `credentials: 'omit'`. 2xx는 신청 완료, 400 `{ code: "invalid_email" }`은 입력란 오류, 429는 요청 과다, 나머지와 네트워크 오류는 일반 실패입니다.

## Approach (Checklist)

- [x] **Step 0: Recon** `Landing.tsx`, `scenes.tsx`, `sceneGeometry.ts`, `sceneLoops.ts`, `features.tsx`, `snap.ts`, `HeaderRoute.tsx`, `src/auth/`, `site-chrome.css`, `auth.css`를 읽고 영역·표지판·스냅 구조와 상단바 반응형 규칙을 확인했습니다.
- [x] **Step 1: Implementation**
  - `src/pages/landing/metrics.ts`: `metricsSample = true`, 혼동 행렬 건수(`confusionCounts`, TP 42, FP 3, FN 5, TN 150)와 칸 이름, 건수에서 계산하는 오탐률·미탐률(`confusionRates`), 막대 지표 네 개(`key`, `label.{ko,en}`, `value`, `unit`, `unitPosition`, `max`), 강조 지표 `highlightedMetric`, 표시 함수.
  - `sceneGeometry.ts`: `TILE_Y.metrics = 8160`, 막대와 혼동 행렬 좌표 `M4`, `metricX`.
  - `scenes.tsx`: `MetricsScenes`. 뒤에 혼동 행렬(칸 380×230, 건수에 비례해 최대 24px 뜸)이 눕고, 앞줄 기준선 위에 가는 막대(66×66, 최대 180px) 네 개가 `--h`만큼 솟습니다. 면은 옅게 칠하고 모서리는 선으로 그으며 윗면만 채웁니다. 점선 뚜껑이 최댓값 자리이고, 강조 지표(결함 탐지율)의 막대는 코랄 윗면과 코랄 선으로 행렬에 이어집니다. 축 이름, 칸 글자, 오탐률·미탐률은 `Landing.tsx`의 `ConfusionSigns` 표지판입니다.
  - 3차 owner 방향: 추이 화면과 이전 지표(테스트 커버리지, QA 통과율, 발견한 이슈)를 없애고 혼동 행렬을 주 요소로 바꿨습니다. 막대는 결함 탐지율, Test Case 수행률, QA 1회 비용, 평균 QA 실행 시간이고 결함 탐지율을 강조합니다. 반복을 없애고 섹션이 처음 현재 섹션이 될 때 한 번만 재생합니다(`introMetrics`, `prime`). 미디어 조건이 바뀌어도 다시 재생하지 않습니다.
  - 2차 리드 확인 후 수정: 막대가 너무 크고 당시의 추이 화면을 가렸습니다. CSS 카메라의 `scale()`은 translateZ 높이를 줄이지 않으므로, 카메라 식을 그대로 옮긴 계산으로 1024–1920px 폭에서 막대가 화면을 가리지 않는 배치(`M4`, `CAM.metrics` tilt 40, s 0.6)를 골랐습니다. 정적 띠에서는 `--zk`로 솟는 높이를 판 축소 비율만큼 줄입니다.
  - `sceneLoops.ts`: 행렬 칸이 차고, 코랄 선이 그려지고, 막대가 솟는 한 번짜리 등장. 움직임 줄이기에서는 마지막 상태로 멈춥니다.
  - `Landing.tsx`: § 04 섹션, `CAM.metrics`, `REGIONS`, 상단바 정거장 이름, FAQ § 05. `metricsSample`이 true이면 제목 옆에 mono `예시`/`Sample` 표시.
  - `messages.ts`: `metrics.title`(`평가 지표`/`Evaluation metrics`), `metrics.sample`(`예시`/`Sample`), 혼동 행렬 축 이름 `metrics.axes`.
  - `landing.css`: 막대와 행렬 칸(`.mt-prism`), 행렬 표지판, 예시 표시, 무대가 없을 때의 행렬 격자.
  - `src/contact/`: `copy.ts`, `contactApi.ts`, `ContactDialog.tsx`. 사이트에는 메일 서버가 없어서, 보내기를 누르면 받는 주소·제목·본문이 채워진 Gmail 작성 창을 새 탭으로 엽니다. 창이 열리지 않을 때를 위해 문의 전문을 복사하는 버튼을 보여 줍니다. 기본 메일 앱이 없으면 `mailto:`는 아무 일도 하지 않아 쓰지 않습니다. owner가 2026-11-17에 이 방식으로 정했습니다.
  - `AuthControls.tsx`: `const showConsoleLink = false`로 Console 링크를 숨기고 `Contact Us` 버튼을 늘 붙입니다. `consoleUrl`은 그대로 둡니다.
  - `src/styles/contact.css`, `index.css`, `site-chrome.css`: 대화상자 입력란, 720px 이하에서 계정 버튼 줄 분리.
  - `.env.example`, `.agents/docs/DESIGN.md`, `scripts/locale.check.ts` 갱신.
  - 4차 owner 방향(이 항목이 위의 문의와 예시 값 내용을 대신합니다):
    - 상단바 로그인 제거: `SiteLayout`이 `AuthControls`를 붙이지 않아 로그인, 회원가입, Console 링크가 DOM에 없고 페이지를 열 때 세션 확인 요청(`/api/auth/me`, `/api/auth/providers`)도 보내지 않습니다. OAuth `?auth_error` 대화상자도 더 뜨지 않습니다. `src/auth/`와 `src/styles/auth.css`는 남겼지만 아무 곳에서도 가져오지 않습니다. `features.tsx`가 닫기 버튼 이름으로 `authCopy`를 쓰던 것은 `messages.ts`의 `dialog.close`로 옮겼습니다. `site-chrome.css`와 `responsive.css`의 `.auth-controls` 규칙은 지웠고, `responsive.css`의 `.auth-dialog input` 규칙은 `auth.css`로 옮겼습니다.
    - orchestration 주소 계산을 `src/lib/orchestration.ts`(`orchestrationOrigin`)로 옮기고 `authApi.ts`도 이것을 씁니다.
    - `src/wishlist/`: `wishlistApi.ts`(`joinWishlist`가 결과를 `joined`, `invalid_email`, `rate_limited`, `unavailable`로 돌려줍니다. 15초 안에 응답이 없으면 `unavailable`), `WishlistDialog.tsx`, `copy.ts`. 스타일은 `src/styles/wishlist.css`. 대화상자는 상단바 밖에 그려 상단바의 mono 글꼴과 `pointer-events: none`을 물려받지 않습니다. 480px 이하에서는 Wishlist 버튼이 내비 위에 한 줄을 따로 차지합니다.
    - 문의: `src/contact/`와 `contact.css`를 지우고 푸터에 `Contact Us` mono 이름표와 고를 수 있는 글자 `contact@artel.kr`를 둡니다(`messages.ts`의 `footer.contact`). `.env.example`은 바꾸지 않았습니다.
    - § 04: `metricsSample`을 `metricsStatus: 'collecting' | 'live'`로 바꾸고 예시 숫자를 모두 지웠습니다. 건수와 값은 `null`이고, 네 칸이 다 찼을 때만 오탐률과 미탐률을 계산합니다(`confusionRate`). 표지판 값은 모두 `—`, 제목 옆 표시는 `수집 중`/`Collecting`(`metrics.collecting`)입니다. 행렬 칸은 판에 붙은 점선 칸, 막대는 점선 바닥 칸과 점선 뚜껑만 남습니다. 코랄 선은 그대로이고, 한 번짜리 등장은 윤곽만 차례로 보여 줍니다. `locale.check.ts`는 `'collecting'`이면 값이 모두 `null`이고 보이는 글자에 숫자가 없는지, `'live'`이면 값이 다 찼는지 확인합니다. Wishlist 문구가 두 언어에 같은 키로 있는지도 확인합니다.
  - 5차 owner 방향(Wishlist 다시 그리기와 스크롤 버그):
    - 버그: 대화상자를 열고 닫을 때 브라우저가 포커스를 옮기며 뒤 페이지를 스크롤해 랜딩 카메라와 스냅 정지점이 § 03과 § 04 사이로 밀렸습니다. 대화상자가 연 순간의 스크롤 위치를 기억해 열려 있는 동안 `scroll`마다 되돌리고, 닫을 때 `focus({ preventScroll: true })`로 트리거에 돌아간 뒤 바로 한 번, 다음 프레임에 한 번 더 되돌립니다. `html`의 overflow는 건드리지 않습니다. 원인은 브라우저 안에서 확인하지 못했고, 증상이 나는 경로를 모두 막는 방식으로 고쳤습니다.
    - 상단바 `Wishlist` 버튼을 코랄 채움(`btn--primary`)으로 바꿨습니다.
    - 대화상자: 520px 판, 720px 이하 아래 시트, 모서리 표시와 오프셋 판. 위쪽에 `WishlistMap.tsx`(화면 프레임 두 개, 직각 경로, ARTEL 심볼이 든 출시 프레임, 7초 반복하는 코랄 점). 이메일 입력과 `신청하기`/`Join` 버튼이 한 줄에 서고 좁은 화면에서는 쌓입니다. 개인정보 수집·이용 동의 체크박스와 `자세히`/`Details` 접기, 동의 전에는 `aria-disabled` 버튼, 문의 주소 각주, 신청 뒤 `신청했어요`/`You're on the list` 화면과 체크, 숨긴 live region을 넣었습니다.
    - API: 본문에 `consent: true`를 싣고 400 `consent_required`를 동의 오류로 보입니다. 문의 주소는 `src/lib/contact.ts`로 옮겨 푸터와 대화상자가 같이 씁니다.
    - `locale.check.ts`: Wishlist 문구의 `{email}`, `{contact}` 자리가 두 언어에 있는지 확인합니다.
- [x] **Step 2: Tests** 아래 다섯 명령을 통과했습니다. 4차 방향 뒤에도 다시 돌렸고, 빌드한 번들에 `authCopy` 문구(`로그인`, `Log in`)와 `/api/auth` 경로가 없음을 확인했습니다. 브라우저 화면 확인은 리드가 합니다.
- [ ] **Step 3: Rollout / Rollback** orchestration의 `POST /wishlist`가 배포되기 전에는 신청이 `신청하지 못했어요`로 끝납니다. 실제 지표가 모이면 `metrics.ts`에 값을 넣고 `metricsStatus`를 `'live'`로 둡니다.

## Validation

- **Commands to run:**
  - `npx eslint . --ignore-pattern 'mockups/**'`
  - `npm run typecheck`
  - `npm run check`
  - `npm run build`
  - `npm run check:docs`
- **Expected output:** 다섯 명령 모두 exit 0. `npm run check`는 `locale checks passed`, `npm run check:docs`는 `Documentation checks passed`를 출력합니다. 빌드는 500 kB 청크 크기 경고를 출력하지만 실패하지 않습니다.
- **Manual checks (리드):** 1440, 1100, 720, 390, 360px에서 라이트와 다크로 § 04 수집 중 화면, 표지판 위치, 정지점 이동, 상단바 정거장 6개, 상단바 줄바꿈, Wishlist 대화상자의 신청·오류·Esc·닫기·포커스 복귀, 푸터의 문의 주소를 확인합니다. 움직임 줄이기에서 정적 띠를 확인합니다.

## Risks & Rollback

- **Risks:**
  - Wishlist는 orchestration 엔드포인트가 같은 계약으로 배포되어야 동작합니다. 사이트 출처가 서버의 CORS 허용 목록에 있어야 하고, 쿠키를 싣지 않으므로 서버는 자격 증명 없는 요청을 받아야 합니다.
  - 실제 값을 넣을 때 `metricsStatus`를 `'live'`로 바꾸지 않으면 `npm run check`가 실패합니다. 일부 값만 넣는 상태는 허용하지 않습니다.
  - `src/auth/`와 `auth.css`는 쓰이지 않는 채로 남습니다. 다시 붙일 때 `index.css`에 `auth.css`를 다시 불러와야 합니다.
  - 지표가 다섯 개 이상이 되면 표지판이 한 화면에 다 들어오지 않습니다. 그때는 `M4.gap`과 배치를 다시 정해야 합니다.
  - 480px 이하에서는 Wishlist 버튼이 한 줄을 따로 차지해 상단바가 한 줄 높아집니다. 480–720px 사이에서 첫 줄에 들어가는지는 글꼴 폭으로 어림했으므로 화면에서 확인해야 합니다.
- **Rollback steps:** 해당 커밋을 `git revert`합니다.

## Open Questions

- 실제 평가 지표의 항목과 값의 출처를 owner가 정해야 합니다.
- 푸터 주소를 `mailto:` 링크로 할지 owner 확인이 필요합니다. 지금은 글자만 둡니다.
- 개인정보 수집·이용 동의의 보유 기간(`신청을 취소할 때까지`)은 리드가 제안한 문구입니다. owner가 확정해야 합니다. 접기 이름 `자세히`/`Details`는 요청에 없어 이 작업에서 정했습니다.
- orchestration 엔드포인트가 `consent`를 필수로 받고 없으면 400 `consent_required`를 돌려주는지 맞춰야 합니다.
