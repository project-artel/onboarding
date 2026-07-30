# Project Context

Fill this document during project initialization. Agents must verify commands against repository configuration before running them.

## Overview

- Product: onboarding
- Primary users: 게임 QA 담당자와 개발자. ARTEL을 처음 도입하며 프로젝트 생성, SDK 연결, 첫 QA 실행까지 진행한다.
- Core domain: ARTEL 도입 온보딩 흐름 (가입·프로젝트 등록·Unity SDK 연결·기획서 업로드·첫 테스트 실행)
- Runtime environment: React, TypeScript, Vite로 빌드하는 브라우저 애플리케이션

## Architecture

- Entry points: `index.html`, `src/main.tsx`
- Main modules: 애플리케이션 루트 `src/App.tsx`; 공용 시맨틱 스타일 `src/styles/`
- Dependency direction: 화면 컴포넌트가 공용 스타일과 디자인 시스템 토큰에 의존한다. 역방향 의존은 두지 않는다.
- External systems: GitHub repository `project-artel/onboarding`; Jira project `ARTEL` via the `mcp-atlassian` MCP server; Notion workspace via the `ntn` CLI
- Persistent data: TODO

## Commands

| Purpose | Command |
|---|---|
| Install dependencies | `npm install` |
| Run locally | `npm run dev` |
| Format | Not configured |
| Lint | `npm run lint` |
| Type-check | `npm run typecheck` |
| Unit tests | Not configured |
| Integration tests | Not configured |
| Build | `npm run build` |
| Set up Jira credentials | `cp .jira.env.example .jira.env` |
| Install Notion CLI | `curl -fsSL https://ntn.dev \| bash` |
| Verify Notion CLI auth | `ntn whoami` |

### Jira
Jira access goes through the `mcp-atlassian` MCP server, declared in `.mcp.json`
at the repository root. Claude Code starts it on demand and asks for approval
the first time it connects.

Credentials live in `.jira.env`, which the server reads through `--env-file`.
Copy `.jira.env.example` and fill in `JIRA_URL`, `JIRA_USERNAME`, and
`JIRA_API_TOKEN`, issuing the token at
`https://id.atlassian.com/manage-profile/security/api-tokens`. `.gitignore`
excludes `.jira.env`; never commit it.

The server reads that file itself, so the setup does not depend on how Claude
Code was launched or on which shell exports the variables. Do not register a
`jira` server in user scope as well, or two copies start.

### Notion
Notion access goes through the `ntn` CLI. Agents follow
`.agents/skills/notion-cli/SKILL.md`, which is symlinked into
`.claude/skills/notion-cli` for Claude Code.

Authenticate with a token rather than `ntn login`: export `NOTION_API_TOKEN`
from your shell profile, using a token issued at
`https://www.notion.so/profile/integrations`. The integration must be connected
to each page and data source it needs, otherwise reads return 404. Never commit
the token.

Write operations (`ntn pages create`, `ntn files create`, `ntn workers deploy`)
are not pre-approved and require explicit confirmation.

## Constraints

- Supported platforms: Modern desktop and mobile browsers
- Compatibility requirements: Node.js 20.19 or newer for local tooling
- Performance constraints:
- Security or privacy requirements:

## Ownership

- Maintainers:
- Sensitive modules:
- Changes requiring explicit review:
