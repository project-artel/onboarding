# 2026-11-17 — 랜딩 § 04 영상 영역 추가, 상단바 로그인 제거와 Wishlist 신청 추가

- Date: 2026-11-17
- GitHub Issue: None
- Status: Review

## Goal

owner 요청을 반영합니다. 뒤의 owner 방향(아래 Step 1의 4–6차 항목)이 앞의 요청을 고쳤습니다. 6차 방향에서 § 04는 평가 지표가 아니라 영상 영역이 되었습니다.

1. 랜딩 § 03 기능과 FAQ 사이에 § 04 영상 영역을 넣습니다. 큰 화면, 필름 띠, 재생 대화상자로 여러 영상을 넘겨 보고, 따로 페이지를 두지 않습니다. FAQ는 § 05가 됩니다.
2. 상단바에서 로그인, 회원가입, Console 링크를 없애고 그 자리에 `Wishlist` 버튼과 이메일 신청 대화상자를 둡니다.
3. 문의는 대화상자 없이 푸터에 `Contact Us contact@artel.kr` 글자로 보입니다.

## Non-goals

- 영상 제작과 호스팅 결정은 범위 밖입니다. 지금 다섯 영상은 모두 준비 중(`source: null`)입니다.
- `POST /wishlist` 엔드포인트는 orchestration 저장소에서 따로 만듭니다. 이 저장소는 그 계약을 따르는 화면만 만듭니다.
- `src/auth/`는 지우지 않고 나중에 다시 쓰도록 남깁니다. 로그인을 다시 붙이는 일은 범위 밖입니다.
- 라우트를 추가하지 않으므로 `public/sitemap.xml`과 `public/llms.txt`는 바꾸지 않습니다.

## Context / Constraints

- 랜딩의 § 01–§ 03은 한 판 위의 영역이고, 카메라가 섹션마다 그 영역으로 날아갑니다. 새 영역도 같은 `Region`, `data-sign`/`data-anchor`, `CAM`, 정지점(`data-station`) 구조를 따릅니다.
- `.agents/docs/DESIGN.md`: 상자 카드와 번진 그림자 없이 화면, 경로, 토큰, translateZ 깊이로 그립니다. 움직임 줄이기와 720px 이하에서는 정적인 지도 띠 위에 표지판을 쌓습니다.
- `.agents/docs/product-terminology.md`: Test Case는 줄이지 않고, Macro 같은 제품 용어는 영어로 둡니다.
- `.agents/docs/user-copy.md`: 독자에게 하는 말은 해요체, 느낌표와 이모지는 쓰지 않습니다. `Wishlist`와 `Contact Us`는 owner가 정한 표기라 두 언어에서 같게 둡니다.
- Wishlist 계약: `POST ${VITE_ORCHESTRATION_URL}/wishlist`, 본문 `{ "email": string, "locale": "ko" | "en", "consent": true }`, `credentials: 'omit'`. 2xx는 신청 완료, 400 `{ code: "invalid_email" }`은 입력란 오류, 429는 요청 과다, 나머지와 네트워크 오류는 일반 실패입니다.

## Approach (Checklist)

- [x] **Step 0: Recon** `Landing.tsx`, `scenes.tsx`, `sceneGeometry.ts`, `sceneLoops.ts`, `features.tsx`, `snap.ts`, `HeaderRoute.tsx`, `src/auth/`, `site-chrome.css`, `auth.css`를 읽고 영역·표지판·스냅 구조와 상단바 반응형 규칙을 확인했습니다.
- [x] **Step 1: Implementation**
  - `src/contact/`: `copy.ts`, `contactApi.ts`, `ContactDialog.tsx`. 사이트에는 메일 서버가 없어서, 보내기를 누르면 받는 주소·제목·본문이 채워진 Gmail 작성 창을 새 탭으로 엽니다. 창이 열리지 않을 때를 위해 문의 전문을 복사하는 버튼을 보여 줍니다. 기본 메일 앱이 없으면 `mailto:`는 아무 일도 하지 않아 쓰지 않습니다. owner가 2026-11-17에 이 방식으로 정했습니다.
  - `AuthControls.tsx`: `const showConsoleLink = false`로 Console 링크를 숨기고 `Contact Us` 버튼을 늘 붙입니다. `consoleUrl`은 그대로 둡니다.
  - `src/styles/contact.css`, `index.css`, `site-chrome.css`: 대화상자 입력란, 720px 이하에서 계정 버튼 줄 분리.
  - `.env.example`, `.agents/docs/DESIGN.md`, `scripts/locale.check.ts` 갱신.
  - 4차 owner 방향(이 항목이 위의 문의 내용을 대신합니다):
    - 상단바 로그인 제거: `SiteLayout`이 `AuthControls`를 붙이지 않아 로그인, 회원가입, Console 링크가 DOM에 없고 페이지를 열 때 세션 확인 요청(`/api/auth/me`, `/api/auth/providers`)도 보내지 않습니다. OAuth `?auth_error` 대화상자도 더 뜨지 않습니다. `src/auth/`와 `src/styles/auth.css`는 남겼지만 아무 곳에서도 가져오지 않습니다. `features.tsx`가 닫기 버튼 이름으로 `authCopy`를 쓰던 것은 `messages.ts`의 `dialog.close`로 옮겼습니다. `site-chrome.css`와 `responsive.css`의 `.auth-controls` 규칙은 지웠고, `responsive.css`의 `.auth-dialog input` 규칙은 `auth.css`로 옮겼습니다.
    - orchestration 주소 계산을 `src/lib/orchestration.ts`(`orchestrationOrigin`)로 옮기고 `authApi.ts`도 이것을 씁니다.
    - `src/wishlist/`: `wishlistApi.ts`(`joinWishlist`가 결과를 `joined`, `invalid_email`, `rate_limited`, `unavailable`로 돌려줍니다. 15초 안에 응답이 없으면 `unavailable`), `WishlistDialog.tsx`, `copy.ts`. 스타일은 `src/styles/wishlist.css`. 대화상자는 상단바 밖에 그려 상단바의 mono 글꼴과 `pointer-events: none`을 물려받지 않습니다. 480px 이하에서는 Wishlist 버튼이 내비 위에 한 줄을 따로 차지합니다.
    - 문의: `src/contact/`와 `contact.css`를 지우고 푸터에 `Contact Us` mono 이름표와 고를 수 있는 글자 `contact@artel.kr`를 둡니다(`messages.ts`의 `footer.contact`). `.env.example`은 바꾸지 않았습니다.
  - 5차 owner 방향(Wishlist 다시 그리기와 스크롤 버그):
    - 버그: 대화상자를 열고 닫을 때 브라우저가 포커스를 옮기며 뒤 페이지를 스크롤해 랜딩 카메라와 스냅 정지점이 § 03과 § 04 사이로 밀렸습니다. 대화상자가 연 순간의 스크롤 위치를 기억해 열려 있는 동안 `scroll`마다 되돌리고, 닫을 때 `focus({ preventScroll: true })`로 트리거에 돌아간 뒤 바로 한 번, 다음 프레임에 한 번 더 되돌립니다. `html`의 overflow는 건드리지 않습니다. 원인은 브라우저 안에서 확인하지 못했고, 증상이 나는 경로를 모두 막는 방식으로 고쳤습니다.
    - 상단바 `Wishlist` 버튼을 코랄 채움(`btn--primary`)으로 바꿨습니다.
    - 대화상자: 520px 판, 720px 이하 아래 시트, 모서리 표시와 오프셋 판. 위쪽에 `WishlistMap.tsx`(화면 프레임 두 개, 직각 경로, ARTEL 심볼이 든 출시 프레임, 7초 반복하는 코랄 점). 이메일 입력과 `신청하기`/`Join` 버튼이 한 줄에 서고 좁은 화면에서는 쌓입니다. 개인정보 수집·이용 동의 체크박스와 `자세히`/`Details` 접기, 동의 전에는 `aria-disabled` 버튼, 문의 주소 각주, 신청 뒤 `신청했어요`/`You're on the list` 화면과 체크, 숨긴 live region을 넣었습니다.
    - API: 본문에 `consent: true`를 싣고 400 `consent_required`를 동의 오류로 보입니다. 문의 주소는 `src/lib/contact.ts`로 옮겨 푸터와 대화상자가 같이 씁니다.
    - `locale.check.ts`: Wishlist 문구의 `{email}`, `{contact}` 자리가 두 언어에 있는지 확인합니다.
  - 6차 owner 방향(§ 04를 평가 지표에서 영상 영역으로 교체):
    - 평가 지표를 모두 지웠습니다. `metrics.ts`, `MetricsScenes`, `M4`, `introMetrics`와 `prime`, `--zk`, `landing.css`의 막대·행렬·표지판 규칙, `messages.metrics`, `locale.check.ts`의 지표 검사, DESIGN.md의 지표 설명입니다. `scenes.tsx`, `sceneLoops.ts`는 이 브랜치 이전 상태로 돌아갔습니다.
    - `src/pages/landing/videos.ts`: 영상 다섯 개(`sdk`, `first-qa`, `evidence`, `macro`, `ci`)와 분류(시작하기, QA 실행, 자동화). `source`는 YouTube id, 파일(`src`, `poster`), 준비 중(`null`) 중 하나입니다. 요약은 `src/docs/content.ts`와 기능 문구에서 가져온 명사구입니다. 장면 그림 종류(`art`)를 항목마다 둡니다.
    - `videoArt.tsx`: 포스터가 없을 때의 장면 그림 다섯 가지(에디터 로그인 창, 위에서 본 레벨과 에이전트 경로, 멈춘 화면과 실패 표시와 기록 줄, Macro 묶음과 반복 고리, 커밋에서 빌드·QA·결과로 가는 파이프라인).
    - `videoReel.tsx`: `VideoBlock`과 `VideoDialog`. 큰 화면은 `v-screen` 기준점에 아래 변을 대고 서는 표지판이고, 필름 띠는 판 위 `vr-strip`입니다. 이전·다음 버튼, 칸 누르기(지금 칸은 재생), 슬라이더 안에서 ←/→(전파를 끊음), 터치로 밀기로 넘깁니다. 점이 경로를 따라 가고 띠가 밀리는 데 0.6초(`expo.out`), 큰 화면의 주사선 효과는 0.32초입니다. 6초마다 저절로 넘기고 제목 막대의 코랄 줄로 남은 시간을 보입니다. 섹션이 화면을 60% 이상 덮고, 올려 두거나 포커스한 것이 없고, 대화상자가 닫혀 있을 때만 넘기며 움직임 줄이기에서는 넘기지 않습니다. 직접 바꿀 때만 live region이 제목을 읽습니다.
    - 재생 전에는 YouTube 스크립트, iframe, 썸네일을 불러오지 않습니다. 대화상자를 닫으면 플레이어가 사라져 재생이 멈춥니다.
    - `src/lib/useModalDialog.ts`: Wishlist 대화상자의 스크롤 위치 지키기, 포커스 복귀, 휠·이동 키 막기를 옮겨 두 대화상자가 함께 씁니다.
    - `sceneGeometry.ts`: `TILE_Y.videos = 8160`, `V4`, `thumbCenter`. 카메라 식을 그대로 옮긴 계산으로 1024×768–1920×1080에서 큰 화면 위 변이 상단바 아래에, 아래 변이 뜬 칸 위에 오는 값을 골랐습니다(`screenY` 820, `stripY` 1180).
    - `messages.ts`: `videos`(`영상`/`Videos`, `이전 영상`, `다음 영상`, `재생`, `준비 중`/`Coming soon`, `준비 중인 영상이에요.`/`This video is coming soon.`). 상단바 넷째 정거장 이름이 `영상`/`Videos`가 됩니다.
    - `locale.check.ts`: 영상이 하나 이상인지, key가 겹치지 않는지, 두 언어에 제목과 한 줄 요약이 있는지, 분류와 길이 형식, 올린 영상의 source를 확인합니다.
    - owner 추가 요청: 판 위 화면을 직접 누를 수 있게 했습니다. 필름 띠의 칸은 판 위의 진짜 버튼(`{title} 보기`/`Show {title}`, 지금 칸은 `{title} 재생`/`Play {title}`)이고, 큰 화면은 면 전체가 재생 버튼(`{title} 재생`/`Play {title}`)입니다. 올리거나 포커스하면 칸은 조금 뜨며 코랄 테두리가 되고, 큰 화면은 들리며 코랄 테두리가 됩니다. 그래서 § 04 영역만 `Region`의 `interactive`로 보조 기술에 열고 꾸밈 요소는 하나씩 숨겼습니다. 영역에는 `overflow: clip`을 줘 포커스가 고정 층을 스크롤하지 않게 했습니다. `messages.videos.play`는 `{title} 재생`으로 바뀌었고 `show`가 새로 생겼습니다.
- [x] **Step 2: Tests** 아래 다섯 명령을 통과했습니다. 4차 방향 뒤에도 다시 돌렸고, 빌드한 번들에 `authCopy` 문구(`로그인`, `Log in`)와 `/api/auth` 경로가 없음을 확인했습니다. 브라우저 화면 확인은 리드가 합니다.
- [ ] **Step 3: Rollout / Rollback** orchestration의 `POST /wishlist`가 배포되기 전에는 신청이 `신청하지 못했어요`로 끝납니다. 영상을 올리면 `videos.ts`의 항목에 `source`와 `duration`을 채웁니다.

## Validation

- **Commands to run:**
  - `npx eslint . --ignore-pattern 'mockups/**'`
  - `npm run typecheck`
  - `npm run check`
  - `npm run build`
  - `npm run check:docs`
- **Expected output:** 다섯 명령 모두 exit 0. `npm run check`는 `locale checks passed`, `npm run check:docs`는 `Documentation checks passed`를 출력합니다. 빌드는 500 kB 청크 크기 경고를 출력하지만 실패하지 않습니다.
- **Manual checks (리드):** 1440, 1100, 720, 390, 360px에서 라이트와 다크로 § 04 영상 영역(큰 화면, 필름 띠, 넘기기, 저절로 넘김, 재생 대화상자), 표지판 위치, 정지점 이동, 상단바 정거장 6개, 상단바 줄바꿈, Wishlist 대화상자의 신청·오류·Esc·닫기·포커스 복귀, 푸터의 문의 주소를 확인합니다. 움직임 줄이기에서 정적 띠를 확인합니다.

## Risks & Rollback

- **Risks:**
  - Wishlist는 orchestration 엔드포인트가 같은 계약으로 배포되어야 동작합니다. 사이트 출처가 서버의 CORS 허용 목록에 있어야 하고, 쿠키를 싣지 않으므로 서버는 자격 증명 없는 요청을 받아야 합니다.
  - 큰 화면은 표지판이라 카메라 배율을 받지 않습니다. 721–1000px 폭에서는 화면이 작아지고, 높이가 650px보다 낮은 창에서는 글 칸이 상단바에 가까워집니다. 화면에서 확인해야 합니다.
  - 영상이 많아지면 필름 띠 양 끝 칸은 화면 밖으로 나가고, 지금 칸 양옆 두 칸까지만 보입니다.
  - `src/auth/`와 `auth.css`는 쓰이지 않는 채로 남습니다. 다시 붙일 때 `index.css`에 `auth.css`를 다시 불러와야 합니다.
  - 480px 이하에서는 Wishlist 버튼이 한 줄을 따로 차지해 상단바가 한 줄 높아집니다. 480–720px 사이에서 첫 줄에 들어가는지는 글꼴 폭으로 어림했으므로 화면에서 확인해야 합니다.
- **Rollback steps:** 해당 커밋을 `git revert`합니다.

## Open Questions

- 영상 호스팅(YouTube 또는 직접 올린 파일)을 owner가 정해야 합니다.
- 좁은 화면에서도 저절로 넘기는지 owner 확인이 필요합니다. 지금은 움직임 줄이기만 아니면 넘깁니다.
- 푸터 주소를 `mailto:` 링크로 할지 owner 확인이 필요합니다. 지금은 글자만 둡니다.
- 개인정보 수집·이용 동의의 보유 기간(`신청을 취소할 때까지`)은 리드가 제안한 문구입니다. owner가 확정해야 합니다. 접기 이름 `자세히`/`Details`는 요청에 없어 이 작업에서 정했습니다.
- orchestration 엔드포인트가 `consent`를 필수로 받고 없으면 400 `consent_required`를 돌려주는지 맞춰야 합니다.
