# 내 onboarding PR 2개 통합 기록

2026-10-28 `dev-yunseong`의 [#37](https://github.com/project-artel/onboarding/pull/37)과 [#38](https://github.com/project-artel/onboarding/pull/38)을 최신 `main` 기준 통합 branch에 합쳤다. `main`에는 merge하지 않았고 원본 branch·commit·작성자를 유지했다.

- #37의 모바일 레이아웃과 화면 여백, 라이트·다크 캡처를 유지했다. 원본 캡처는 `.plan/assets/responsive-mobile-layout/`에 남아 있다.
- #38의 SDK 지원 범위 표와 CI batch build 안내를 유지했다.
- 두 PR은 충돌 없이 merge됐고 두 source head가 모두 통합 HEAD의 ancestor임을 확인했다.
- `npm run check`, `npm run check:docs`, `npm run build`, `npm run lint`, `git diff --check`가 통과했다. 문서 검사에서 locale별 15개 문서와 sitemap·내부 링크 일치를 확인했다.
- 원본 PR의 리뷰·기존 캡처·검증 기록은 각 원본 PR에 보존한다. 통합을 위해 새로운 화면이나 문구를 추가하지 않았다. 이번 통합에서 새 브라우저 캡처는 촬영하지 않았다.
- 다른 작성자 PR과 원본 branch는 변경하거나 종료하지 않는다. 통합 PR을 닫고 원본 PR을 reopen하면 이전 리뷰 구조로 복원할 수 있다.
