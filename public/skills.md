# ARTEL 플러그인 설치

ARTEL 플러그인은 스킬과 스테이징 MCP를 함께 설치합니다.

## Codex

```sh
codex plugin marketplace add project-artel/artel-plugins
```

Codex 데스크톱 앱을 다시 열고 Plugins에서 ARTEL 마켓플레이스의 ARTEL 플러그인을 설치합니다. MCP 연결 화면에서 로그인을 시작합니다.

## Claude Code

```sh
claude plugin marketplace add project-artel/artel-plugins
claude plugin install artel@artel-plugins
```

Claude Code에서 `/mcp`를 열고 `plugin:artel:artel-macro`를 선택합니다.

## Cursor

로컬 플러그인 가져오기가 허용된 Cursor에서 [ARTEL 플러그인 ZIP](https://github.com/project-artel/artel-plugins/archive/refs/heads/main.zip)을 풉니다. `plugins/artel` 폴더를 `~/.cursor/plugins/local/artel`로 복사하고 `plugin.json`이 그 폴더 바로 아래에 있는지 확인합니다. Cursor를 다시 열거나 `Developer: Reload Window`를 실행한 뒤 Customize에서 `artel-macro` 연결을 시작합니다.

## 스테이징 MCP 로그인

연결을 시작하면 사용자가 브라우저에서 스테이징 ARTEL에 로그인하고 권한을 승인합니다.
에이전트는 `list_projects`를 호출해 스테이징 프로젝트가 표시되는지 확인할 수 있습니다.

## VS Code

[ARTEL 플러그인 ZIP](https://github.com/project-artel/artel-plugins/archive/refs/heads/main.zip)을 풉니다. Agent Customizations의 Plugins에서 사용자 또는 워크스페이스 옆 +를 선택하고 로컬 폴더 경로로 `plugins/artel`을 지정합니다. 설치된 스킬과 `artel-macro` 연결을 확인하고 로그인합니다.

## OpenCode 등 기타 코딩 에이전트

아래 프롬프트를 에이전트에 붙여 넣습니다.

```text
https://github.com/project-artel/artel-plugins 의 plugins/artel을 이 코딩 에이전트에 설치해 줘.
번들을 직접 불러올 수 있으면 그 방식으로 설치하고, 지원하지 않으면 skills/의 각 스킬 폴더를 현재 프로젝트에서 인식하는 스킬 경로에 등록해. SKILL.md와 references를 함께 보존해.
번들을 직접 불러올 수 없는 경우에만 mcp.json을 읽고 artel-macro를 이 에이전트의 MCP 설정 형식으로 등록해. 기존 설정과 같은 이름의 항목을 확인해서 중복 없이 갱신해.
연결 대상은 https://stage-mcp.artel.kr/mcp 스테이징 서버야. OAuth 절차를 시작해 내가 브라우저에서 로그인하고 권한을 승인할 수 있게 해 줘.
스킬이 인식되는지 확인하고 로그인 후 list_projects를 호출해 결과를 알려 줘. 지원하지 않는 기능과 남은 수동 단계가 있으면 구체적으로 알려 줘.
```

[English installation guide](https://artel.kr/en/skills)
