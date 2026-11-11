# 2026-11-11 — 에이전트별 ARTEL 플러그인 설치 안내 추가

- Date: 2026-11-11
- GitHub Issue: None
- Status: Review

## Goal

onboarding의 설치 메뉴와 home의 설치 안내에서 Codex, Claude Code, Cursor에 맞는 플러그인 절차를 찾을 수 있게 합니다.

## Non-goals

MCP 서버나 인증 설정, 플러그인 번들 변경은 이번 범위 밖입니다.

## Context / Constraints

기존 /skills, /en/skills, /skills.md와 home의 ?guide=skills 링크를 유지합니다. Cursor는 공식 문서에 있는 로컬 플러그인 방식으로 안내합니다. 공통 OAuth 절차에는 스테이징 연결을 명시합니다.

## Approach (Checklist)

- [x] **Step 0: Recon** 두 저장소의 기본 브랜치와 기존 설치 메뉴를 확인합니다.
- [x] **Step 1: Implementation** onboarding에 에이전트별 설치 절차를 작성하고 home의 같은 이름 링크를 연결합니다.
- [x] **Step 2: Tests** 두 빌드, 안내 테스트, 화면 내 링크와 복사 동작을 확인합니다.
- [x] **Step 3: Rollout / Rollback** onboarding PR부터 병합할 수 있게 home PR에 순서를 기록합니다.

## Validation

- **Commands to run:** npm run build, onboarding 문서 검사, home 가이드 테스트
- **Expected output:** 라이트·다크 및 모바일에서 설치 메뉴와 앵커가 동작합니다.

## Risks & Rollback

- **Risks:** home 먼저 배포 시 에이전트별 앵커를 찾을 수 없습니다.
- **Rollback steps:** home과 onboarding PR을 각각 revert합니다.

## Open Questions

- Cursor 클라이언트에서 스테이징 OAuth를 실제 계정으로 검증할 수 있는지 확인합니다.
