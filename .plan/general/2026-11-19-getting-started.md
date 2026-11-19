# 2026-11-19 — 시작하기 단계별 안내 통합

- Date: 2026-11-19
- GitHub Issue: #49
- Status: In Progress

## Goal
기존 설치 진입점을 시작하기로 통합하고 직접 진행·coding agent 두 트랙으로 첫 QA와 결과 검토까지 안내한다.

## Non-goals
영상 제작과 영상 안내 페이지는 추가하지 않는다. 콘솔 동작과 실제 SDK·plugin 설치 절차 자체는 변경하지 않는다.

## Context / Constraints
origin/main 기반 별도 worktree로 기존 미커밋 변경을 보존한다. 사용자 요청으로 영상 안내를 취소하고 기존 설치 메뉴를 시작하기로 통합한다. 제품 화면의 Test Case·시나리오·테스트 런 용어를 따른다. 영어·한국어와 기존 테마를 유지한다.

## Approach (Checklist)
- [x] **Step 0: Recon** — 설치 메뉴, 설치 문서, 콘솔의 Test Case·시나리오·QA·판정 검토 문구와 경로 확인
- [x] **Step 1: Implementation** — 단일 시작하기 진입점과 상세 설치 탭. 직접 진행·coding agent 모두 이슈 관리까지 6단계. 각 화면의 진입 경로와 후속 행동 안내. 요청문 복사와 단계 anchor, locale·track 유지
- [x] **Step 2: Tests** — lint, locale, docs/SEO 검사, typecheck, build. 양쪽 트랙·테마·locale·반응형 화면과 링크·복사·키보드 확인. pair-review
- [ ] **Step 3: Rollout / Rollback** — 기존 draft PR #50 설명·화면을 최종 구현에 맞게 갱신하고 최신 head CI 확인

## Validation
- **Commands to run:** npm run lint, npm run check, npm run check:docs, npm run typecheck, npm run build
- **Expected output:** 오류 없음. 단계별 링크, anchor, query 기반 트랙 전환, 언어 전환과 복사 확인

## Risks & Rollback
- **Risks:** 실제 게임 SDK 설치·QA 실행 자체는 이 안내 UI 검증에 포함하지 않는다. 안내 동작은 콘솔·plugin 상세 문서의 현재 지원 범위에 맞춘다.
- **Rollback steps:** 해당 commit revert

## Open Questions
없음. 사용자가 제시한 두 트랙을 구현한다.

## 검증 결과
- lint, locale, docs/SEO·내부 링크 검사, typecheck, build 통과
- 1440px, 1280px, 1024px, 360px 반응형과 라이트·다크 테마 확인
- locale 전환 시 track·anchor 유지, 요청문 복사 내용, 확대 dialog의 키보드 스크롤·Escape·focus 복귀 확인
- SDK 기존 6장과 신규·제공 8장에 번호·박스·설명 적용. 기존 SDK 6장의 확대 이미지 로드 확인
- live 콘솔에서 Test Case 작성·테스트 런 생성·시나리오 유형과 구성·QA 설정 캡처. 데이터 저장과 QA 실행 없이 확보
- 자동화 포인터 overlay를 캡처 순간에만 숨기고 원래 표시 상태로 복구. Chrome UI는 캡처에 포함하지 않음
- pair-review PASS. 각 화면 진입 안내 누락과 박스 위치에 맞지 않던 저장 설명 수정
- MCP 승인 요청 modal은 사용자가 제공한 캡처 기준. live에 승인 대기 항목이 없어 재현하지 않음
- 실제 게임 SDK 설치·QA 실행은 검증 범위에서 제외
