# Macro reference를 갱신한다

`/macro`에 Quick start, Language, Built-ins, Execution, Limits & errors를 제공한다.
영어 경로는 `/en/macro`이며 하위 경로도 같은 구조다.

## 문법 데이터와 예제를 검증한다

`src/macro/grammar.generated.json`은 직접 편집하지 않는다.
`scripts/sync-macro-reference.py`가 monorepo의
`artel-agent-server/app/agents/qa/macro/grammar.py`에서 타입, action과 reader
signature, operator, 실행 상한을 가져온다.

이 스크립트는 `src/macro/examples.json`의 모든 예제를 실제
`macro_definition_from_source`로 파싱하고 등록에 필요한 entry docstring도 확인한다.
import 예제의 dependency는 JSON에서 먼저 선언한다. 게임에 연결하거나 action을 실행하지는 않는다.

Python 3.11 이상과 Pydantic 2가 설치된 환경에서 다음을 실행한다.
agent-server의 Python 환경을 사용해도 된다. 별도 checkout에서는
`ARTEL_AGENT_SERVER` 환경 변수에 agent-server의 절대 경로를 지정한다. 일반 frontend 빌드는 Python을 요구하지 않는다.

```sh
npm run sync:macro
npm run check:macro
npm run build
npm run lint
npm run check
```

`python`이 다른 환경을 가리키면 해당 환경의 Python으로
`scripts/sync-macro-reference.py --check`를 직접 실행한다.
`--check`는 생성 파일이 현재 구현과 다르면 실패한다.

## 설명과 경로를 수정한다

사람이 읽는 한·영 설명은 `src/macro/content.ts`에 있다.
설명 변경 시 `reference.py`, `parser.py`, `runner.py`의 동작과 함께 확인한다.
예제의 selector, label, member key는 특정 게임을 보장하지 않는 예시 값이다.

새 페이지를 추가하면 `macroPages`, `macroPath`, `public/sitemap.xml`,
`public/llms.txt`를 함께 수정한다. 문서 route는 `App.tsx`에서 두 locale에 등록된다.
1440px, 1024px, 모바일에서 탐색·검색·목차·코드 복사·언어 전환을 확인한다.
