# ARTEL-211 — 브랜드 시스템 반영

## Goal

선택한 ARTEL 심볼과 coral 포인트 색을 onboarding 공용 UI와 브라우저 아이콘에 일관되게 적용한다.

## Scope

- 공용 브랜드 색 토큰 추가
- 공개 페이지에 light/dark theme과 반전 심볼 제공
- 헤더·푸터 심볼 배치
- CTA·브랜드 링크·장식 accent를 coral로 변경
- SVG favicon 추가
- 시스템 theme을 최초값으로 사용하고 사용자 선택 저장
- 심볼 링크와 푸터에 접근 가능한 ARTEL 이름 유지

## Constraints

- 기존 상태색 의미 유지
- Replay Studio와 SDK의 dark 작업 화면은 변경하지 않음
- agent action용 cyan과 브랜드 coral 의미 분리
- 한국어·영어 경로와 반응형 동작 유지
- 새 의존성 및 페이지 구조 변경 없음

## Validation

- `npm run lint`
- `npm run check`
- `npm run typecheck`
- `npm run build`
- 375px·1440px에서 헤더, CTA, favicon 수동 확인

## Risk / Rollback

Coral 대비와 작은 심볼 식별성이 주요 위험이다. 토큰·공용 컴포넌트·favicon 변경만 되돌리면 복구된다.
