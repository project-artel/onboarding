# onboarding 인증을 연결한다

기존 orchestration 인증 API로 이메일 로그인·회원가입과 GitHub OAuth를 처리한다.
로그인하면 보던 페이지에 머물며 헤더에 `Console로 이동` 버튼이 표시된다.
회원가입은 서버의 `signupOpen` 설정을 따른다. 한국어와 영어를 지원한다.

## 로컬 실행 환경을 설정한다

`.env.example`을 `.env.local`로 복사하고 다음 값을 설정한다.

| 변수 | 용도 |
| --- | --- |
| `VITE_ORCHESTRATION_URL` | console과 동일한 인증 서버 URL. 기본값 `http://localhost:8080` |
| `VITE_CONSOLE_URL` | 로그인 후 이동 버튼의 목적지. 기본값 `https://console.artel.kr` |

```sh
npm ci
npm run dev -- --port 5174
```

orchestration에는 `ARTEL_ONBOARDING_URL=http://localhost:5174`를 설정하고
`ARTEL_ALLOWED_ORIGINS`에도 같은 origin을 포함한다. console은 기존
`ARTEL_HOME_URL`을 유지한다. GitHub OAuth의 provider callback은 기존 서버 주소를 유지한다.

운영 빌드에서는 `VITE_ORCHESTRATION_URL`을 console이 쓰는 공개 API 주소로 지정한다.
서버의 `ARTEL_ONBOARDING_URL` 기본값은 `https://artel.kr`이며, 다른 origin에서
서비스하면 해당 값과 CORS 허용 목록을 함께 설정한다. OAuth의 `return_to`는
이 origin과 정확히 일치해야 한다. 쿠키는 인증 API가 관리하며 브라우저 저장소로 복사하지 않는다.

## 인증 흐름을 확인한다

- 비로그인: 로그인 버튼과 가입 허용 시 회원가입 버튼을 표시한다.
- 로그인·가입 성공: 모달을 닫고 Console 링크를 표시한다.
- GitHub 성공·실패: 보던 경로로 복귀하며 실패 이유는 모달에 표시한다.
- 세션 만료: refresh를 한 번 시도하고, 탭 복귀와 표시 중 주기적 확인으로 상태를 갱신한다.
- 세션 확인 실패: 헤더의 로그인 버튼을 유지한다. 클릭하면 로그인 모달을 열고 연결을 다시 확인한다. 연결 오류는 모달 안에서 안내하며 로그인 재제출을 허용한다.

`npm run build`, `npm run lint`, `npm run check`로 정적 검증을 실행한다.
