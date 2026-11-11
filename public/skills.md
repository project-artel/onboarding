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

[English installation guide](https://artel.kr/en/skills)
