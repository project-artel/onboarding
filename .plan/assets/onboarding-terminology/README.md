# onboarding 용어 변경 화면 검증

2026-11-03, ARTEL-1355.

## 변경 범위

홈 기능 카드와 모달, 개발자 문서의 일반 명칭을 `Test Case`, 목록·메뉴 이름을 `Test Cases`로 맞췄다. HTML metadata·구조화 데이터·`llms.txt`의 같은 설명도 동기화했다. `artel case create`, 코드 예제, API·URL·locale key·feature id·테스트 런 이름은 유지했다.

## 검증 결과

- `npm run check`, `npm run check:docs`, `npm run lint`, `npm run build` 통과.
- 문서 검사는 locale당 15개 페이지의 구조·내부 링크·sitemap·llms URL 일치 확인.
- AST 비교에서 기존 key·feature id·경로·보간 구조·inline code 보존 확인. `examples.json`, App route, sitemap 변경 없음.
- 실제 홈 및 `/docs`, `/docs/qa`, `/docs/github-actions`, `/docs/cheats`, `/docs/behaviors`, `/docs/architecture`를 한국어·영어 × light·dark × 1280px·360px, 56개 페이지 조합으로 확인. runtime 오류와 문서 가로 넘침 없음.
- 홈의 Test Cases·시나리오 기능 모달을 열고 닫으며 변경 문구와 줄바꿈 확인. 모달 애니메이션 완료 후 대표 이미지 저장.
- 로그인하지 않은 공개 페이지를 확인했다. auth 조회는 401로 제한했으며 로그인·계정 기능·실제 게임 QA·배포 상태는 검증하지 않았다. reduced motion 설정으로 화면 캡처를 고정했다.
- 독립 검토 `VERDICT: PASS`. 전체 빌드에는 기존 bundle 크기 경고가 남는다.

## 이미지

대표 조합인 한국어 light 1280px와 영어 dark 360px의 이미지 18개를 포함한다. 파일명은 `<페이지·상태>-<locale>-<theme>-<width>[-text].png`이다. `-text`는 해당 페이지의 변경된 문구 위치이며, `feature`·`scenario`는 홈 기능 모달이다.
