# onboarding 컨테이너 빌드와 이미지 게시

Node에서 `npm ci`와 `npm run build`를 실행한 뒤, Nginx가 빌드 결과를 8080 포트로 제공한다.
앱 경로에 직접 접근하면 `index.html`을 반환한다. `/assets/`의 파일은 1년간 캐시하고,
`index.html`은 사용 전에 재검증한다.

## 로컬 실행

```sh
docker build -t artel-onboarding .
docker run --rm -p 8082:8080 \
  -e VITE_ORCHESTRATION_URL=https://orch.example.com \
  -e VITE_CONSOLE_URL=https://example.com/console \
  artel-onboarding
```

두 환경변수는 필수이며 브라우저에서 접근할 수 있는 HTTP(S) URL이어야 한다.
`VITE_ORCHESTRATION_URL`은 로그인 API 서버 주소이고 `VITE_CONSOLE_URL`은 로그인 후 이동할 console 주소다.
컨테이너가 시작할 때 빌드 결과의 주소를 치환하므로 환경마다 이미지를 다시 빌드하지 않아도 된다.
환경을 바꿀 때는 새 컨테이너를 만든다. 이 값은 브라우저에 공개되므로 비밀값을 넣지 않는다.
서로 다른 origin으로 API에 접근한다면 서버의 CORS 및 인증 cookie 설정도 해당 배포에 맞아야 한다.

## GitHub Actions

`.github/workflows/publish-container.yml`은 다음 조건에서 실행된다.

- PR: 이미지를 빌드하고 Nginx 응답, SPA 경로, 캐시 헤더, 환경변수 치환을 검증한다. 이미지는 게시하지 않는다.
- `develop` 또는 `main` push: 검증 후 GHCR에 이미지를 게시한다.
- `workflow_dispatch`: 선택한 branch를 수동으로 빌드하고 게시한다.

이미지 이름은 `ghcr.io/project-artel/onboarding`이다. branch 이름과 전체 commit SHA를 태그로 붙인다.
예를 들어 `:develop`, `:main`, `:<40자리 commit SHA>`로 받을 수 있다.
게시에는 `GITHUB_TOKEN`의 `packages: write` 권한을 사용하며 별도 registry 비밀값은 필요하지 않다.
GitHub 조직에서 package 생성과 Actions의 게시를 허용해야 한다.

이 workflow는 이미지 게시까지 담당한다. 운영 서버의 컨테이너 교체와 도메인 연결은 별도다.
