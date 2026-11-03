# 2026-11-02 — onboarding 컨테이너 이미지 CI/CD 추가

- Date: 2026-11-02
- GitHub Issue: None
- Status: Implemented; draft PR preparation; container execution pending CI

## Goal

onboarding을 Nginx 기반 이미지로 빌드하고 GitHub Actions에서 GHCR에 게시한다.

## Non-goals

운영 서버 배포, DNS 변경, 기존 화면 변경은 포함하지 않는다.

## Context / Constraints

console의 Node 빌드와 Nginx 실행 구성을 따른다. 기존 작업 중인 파일은 유지한다.
로그인 API와 console URL은 실행 시 환경변수로 전달한다. 로컬 비밀 파일은 이미지에서 제외한다.

## Approach (Checklist)
- [x] **Step 0: Recon** — console workflow, onboarding 빌드와 환경변수 확인
- [x] **Step 1: Implementation** — Dockerfile, nginx.conf, entrypoint, dockerignore, workflow 추가
- [x] **Step 2: Tests** — 앱 빌드와 lint 통과, Git Bash에서 shell 문법·환경변수 누락·치환·잘못된 URL 거부 검증 통과. CI 컨테이너 smoke check 추가. 로컬 Docker는 없어 컨테이너 실행 미검증.
- [x] **Step 3: Rollout / Rollback** — develop/main push 시 branch 및 SHA 태그를 게시하도록 구성. 실행 방법은 docs/container.md에 기록. 최신 origin/main에서 컨테이너 파일만 분리하여 draft PR로 제출한다. 실제 이미지 게시 및 운영 배포는 미실행.

## Validation
- **Commands to run:** `npm run build`, `npm run lint`, `sh -n docker-entrypoint.sh`, GitHub Actions의 이미지 빌드 및 HTTP smoke check
- **Expected output:** 빌드 성공, SPA 직접 접근과 정적 파일 응답 확인, 환경변수 치환 확인
- **2026-11-03:** 최신 origin/main 기반 별도 worktree에서 `npm ci --ignore-scripts`, `npm run build`, `npm run lint`, `npm run check:docs` 통과. 빌드 결과의 환경변수 placeholder 두 개 확인. lockfile은 변경하지 않았다.

## Risks & Rollback
- **Risks:** 로컬 Docker가 없어 컨테이너 검증은 GitHub Actions에서 실행해야 할 수 있다. GHCR 게시에는 packages write 권한이 필요하다.
- **Rollback steps:** workflow를 비활성화하거나 추가한 컨테이너 파일을 되돌린다. 운영 배포는 변경하지 않는다.

## Open Questions
- 없음
