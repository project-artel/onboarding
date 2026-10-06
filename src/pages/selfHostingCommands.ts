// Commands and slug lists on the self-hosting pages. They are identical in every locale, so they live
// here once instead of inside each translation. Source of truth: deploy/README.md,
// deploy/install.sh and deploy/docker-compose.yml in https://github.com/project-artel/artel.

export const installCommand =
  'curl -fsSL https://raw.githubusercontent.com/project-artel/artel/main/deploy/install.sh | sh'

export const installWithFlagsCommand = `${installCommand} -s -- --dir /opt/artel --port 8088`

export const installAfterCommand = 'cd $HOME/artel\ndocker compose ps'

export const generateSecretCommand = 'openssl rand -hex 32'

export const composeUpCommands = 'docker compose up -d\ndocker compose ps'

export const composeLogsCommand = 'docker compose logs -f orchestration'

export const composeUpgradeCommands = 'docker compose pull && docker compose up -d'

export const backupCommand =
  `docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > artel-$(date +%F).sql`

export const restoreCommand =
  `docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"' < artel-2026-10-06.sql`

export const composeDownCommand = 'docker compose down'

export const openRouterEnvironmentLine = 'x-openrouter-api-key: &openrouter_api_key "sk-or-..."'

export const githubEnvironmentLines = 'GITHUB_CLIENT_ID: "..."\nGITHUB_CLIENT_SECRET: "..."'

export const signupOpenLine = 'ARTEL_SIGNUP_OPEN: "true"'

export const requiredChatModels = [
  'openai/gpt-6.1-sol',
  'openai/gpt-6-astra',
  'openai/gpt-6-luna',
  'openai/gpt-5.6-terra',
  'anthropic/claude-opus-5.5',
  'anthropic/claude-sonnet-5.5',
  'google/gemini-3.8-flash',
  'google/gemma-4-31b-it:free',
  'x-ai/grok-4.7',
  'moonshotai/kimi-k3',
  'z-ai/glm-5.3-flash',
  'qwen/qwen3.7-max',
]

export const embeddingModel = 'openai/text-embedding-3-large'
