# 2026-10-22 — ARTEL 개발자 문서 통합

- Date: 2026-10-22
- GitHub Issue: #35
- Status: Implemented; draft review pending

## Goal
설치부터 CI와 contribution까지 안내하는 ko/en 개발자 문서와 macro reference 통합.

## Non-goals
서버 배포, Action release, API 변경.

## Context / Constraints
origin/main의 macro와 로그인 UI를 유지한다. 기존 checkout의 미완료 변경은 별도 worktree로 보호한다.

## Approach (Checklist)
- [x] **Step 0: Recon** — CLI, console, agent, Action 구현 확인
- [x] **Step 1: Implementation** — /docs, 공통 탐색·검색, sitemap·llms
- [x] **Step 2: Tests** — build/lint/locale, route 검사, desktop/mobile light/dark
- [ ] **Step 3: Rollout / Rollback** — main 대상 draft PR, commit revert

## Validation
- **Commands to run:** npm run build, npm run lint, npm run check
- **Expected output:** 성공, 링크와 locale 일치, overflow 없음

## Risks & Rollback
- **Risks:** Action release와 모델 catalog 변동. 기본 release와 고급 commit 예시 구분.
- **Rollback steps:** 변경 commit revert.

## Open Questions
없음. 아키텍처와 API 설정은 사용자 요청 범위에 포함.

## Results
- `npm run build`, `npm run lint`, `npm run check`, `npm run check:docs`, `git diff --check`: PASS.
- `actionlint` (shellcheck disabled): PASS. Linux QA job를 placeholder build job과 합쳐 문법 확인; 실제 CI 실행 검증은 아님.
- 브라우저: 검색 결과/빈 결과, 결과 anchor 이동, ko/en 전환, 기존 Macro URL, light/dark, 모바일 목차 열기와 이동 후 닫기 확인.
- 360px/1024px에서 문서 전체의 가로 overflow 없음. 1440px desktop 화면 확인.
- 코드 복사 버튼의 완료 피드백 확인. IAB clipboard read가 빈 문자열을 반환해 clipboard 내용 일치 검증은 미완료.
- `pair-review`: Node.js 최소 버전 지적을 양쪽 언어에서 22.12로 수정.
- 화면: `.plan/assets/developer-docs/` (실제 로컬 사이트). API 인증, 모델 호출, TC 실행의 end-to-end 증거는 아님.