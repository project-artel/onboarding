# 2026-11-19 — 시작하기 영상 안내 페이지 추가

- Date: 2026-11-19
- GitHub Issue: #49
- Status: In Progress

## Goal
내비게이션에서 시작하기 페이지를 열고 기존 영상 목록을 선택해 설명과 재생 영역을 확인한다.

## Non-goals
영상 제작과 업로드, 랜딩 영상 섹션 재설계는 포함하지 않는다.

## Context / Constraints
origin/main 기반 별도 worktree에서 기존 미커밋 변경을 보존한다. 랜딩의 videos 목록과 VideoArt, 기존 테마를 재사용한다. 사용자는 기존 목록으로 먼저 구성하기로 했다.

## Approach (Checklist)
- [x] **Step 0: Recon** — 배포 페이지와 영상 source, 공용 레이아웃 확인
- [x] **Step 1: Implementation** — 시작하기 경로, 내비게이션, 영상 선택과 설명, SEO 추가
- [x] **Step 2: Tests** — lint, locale, typecheck, build 및 실제 페이지의 양쪽 테마와 반응형 확인
- [ ] **Step 3: Rollout / Rollback** — draft PR과 최신 head CI 확인

## Validation
- **Commands to run:** npm run lint, npm run check, npm run check:docs, npm run typecheck, npm run build
- **Expected output:** 오류 없음. 한국어·영어 전환과 영상 선택, 모바일 overflow 확인

## Risks & Rollback
- **Risks:** source가 모두 null이어서 실제 영상 재생 검증은 영상 등록 이후 필요
- **Rollback steps:** 해당 commit revert

## Open Questions
없음. 기존 영상 목록 재사용으로 확인됨.

## 검증 결과

- lint, locale, docs/SEO 검사, typecheck, build 통과
- 1440px, 1280px, 1024px, 360px 화면과 라이트·다크 테마 확인
- 한국어·영어 전환, 영상 목록 전체 선택, 키보드 focus, 내비게이션 진입 확인
- source가 없어 실제 영상 재생은 미검증
- React best practices 점검: 파생 선택값, key로 player state 초기화, 사용자 입력 후에만 외부 iframe 로드, semantic heading과 focus 유지
