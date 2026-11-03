# 2026-11-03 — onboarding Test Case 용어 통일

- Date: 2026-11-03
- GitHub Issue: None (Jira: ARTEL-1355)
- Status: Implemented and validated; draft PR preparation

## Goal

콘솔 PR #244와 같은 Test Case 용어를 onboarding 한국어·영어 사이트 및 coding agent 지시문에 적용한다.

## Non-goals

기능·경로·API·CLI 명령·샘플 코드·테스트 런 이름 변경, 배포 및 PR 병합. 기존 로컬 변경 포함.

## Context / Constraints

- onboarding 기본 브랜치는 main이다. origin/main 기반 독립 worktree에서 작업한다.
- 일반 명칭 Test Case, 목록·메뉴 Test Cases. 실제 TC-000 식별자는 유지한다.
- 문구가 실제로 존재하는 홈 기능 카드, 개발자 문서, HTML metadata, llms.txt를 수정한다. 시나리오 유형·QA 기록 등 사이트에 없는 개념을 설명하려고 새 섹션을 추가하지 않는다.
- AGENTS.md에서 직접 읽도록 연결하는 영어 용어 지침에는 콘솔과 같은 개념 정의와 표시 원칙을 기록한다.
- 예제 JSON·C#·명령·오류 인용, URL·id, localization key와 구조는 보존한다.

## Approach (Checklist)
- [x] **Step 0: Recon** — 최신 main과 실제 문구·사용 페이지 확인.
- [x] **Step 1: Implementation** — 일반 Test Case 명칭 및 사전 조건 표현 정리. metadata 동기화. agent 지침 연결.
- [x] **Step 2: Tests** — npm run check, npm run check:docs, npm run lint, npm run build 통과. 양쪽 언어·테마·1280px/360px 실제 페이지 56조합 및 기능 모달 확인.
- [ ] **Step 3: Rollout / Rollback** — main 대상 draft PR, Jira 링크 및 검증 근거. revert로 복구.

## Validation
- **Commands to run:** npm run check, npm run check:docs, npm run lint, npm run build, git diff --check.
- **Expected output:** locale·lint·build 통과. 긴 이름 잘림과 페이지 가로 넘침 없음. 코드·API 계약 변경 없음.

## Risks & Rollback
- **Risks:** 긴 영문 이름의 줄바꿈과 일반 설명 치환의 코드 예제 침범. 문자열의 사용 위치와 diff를 확인한다.
- **Rollback steps:** 이 PR의 commit을 revert한다.

## Open Questions

없음. 콘솔 PR은 별도 draft 상태이며 사이트 배포·PR 병합은 하지 않는다.

## Review and evidence

- FAST REVIEW: PASS. 문서 검사를 추가하라는 의견 반영.
- MEDIUM REVIEW: PASS, HEAVY REVIEW: PASS.
- Pair review VERDICT: PASS. 영문 메뉴 안내의 불필요한 관사 제거.
- [화면 검증과 한계](../assets/onboarding-terminology/README.md).
