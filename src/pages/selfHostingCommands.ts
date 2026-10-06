// Commands and slug lists on the self-hosting pages. They are identical in every locale, so they live
// here once instead of inside each translation. Source of truth: deploy/README.md,
// deploy/install.sh and deploy/.env.example in https://github.com/project-artel/artel.

export const installCommand =
  'curl -fsSL https://raw.githubusercontent.com/project-artel/artel/main/deploy/install.sh | sh'

export const installWithFlagsCommand = `${installCommand} -s -- --dir /opt/artel --port 8088`

export const installAfterCommand = 'cd $HOME/artel\ndocker compose ps'

export const cloneRepositoryCommands =
  'git clone https://github.com/project-artel/artel.git\ncd artel/deploy'

export const composeEnvFileCommands = 'cp .env.example .env'

export const generateSecretCommand = 'openssl rand -hex 32'

export const shellOverrideCheckCommand = "env | grep -E 'ARTEL|OPENROUTER|GITHUB|DB_'"

export const composeUpCommands = 'docker compose up -d\ndocker compose ps'

export const composeLogsCommand = 'docker compose logs -f orchestration'

export const composeUpgradeCommands = 'docker compose pull && docker compose up -d'

export const composeBuildCommand = 'git submodule update --init\ndocker compose build orchestration agent-server'

export const backupCommand =
  `docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > artel-$(date +%F).sql`

export const restoreCommand =
  `docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"' < artel-2026-10-06.sql`

export const rawVolumeBackupCommands = [
  'docker compose stop postgres',
  'docker run --rm -v artel_postgres-data:/data -v "$PWD":/backup alpine tar czf /backup/postgres-data.tgz -C /data .',
  'docker compose start postgres',
].join('\n')

export const composeDownCommand = 'docker compose down'

export const dockerCleanupCommand =
  'docker rm -f proxy artel-home admin-page agent-server orchestration minio redis postgres'

export const openRouterEnvironmentLine = 'OPENROUTER_API_KEY=sk-or-...'

export const githubEnvironmentLines = 'GITHUB_CLIENT_ID=...\nGITHUB_CLIENT_SECRET=...'

export const signupOpenLine = 'ARTEL_SIGNUP_OPEN=true'

export const requiredChatModels = [
  'openai/gpt-5.6-luna',
  'openai/gpt-5.6-sol',
  'openai/gpt-chat-latest',
  'anthropic/claude-sonnet-5',
  'anthropic/claude-opus-5',
  'google/gemini-3.8-flash',
  'google/gemini-3.7-flash',
  'google/gemma-4-31b-it:free',
  'x-ai/grok-4.6',
  'moonshotai/kimi-k3',
  'z-ai/glm-5.3-flash',
  'qwen/qwen3.8-max',
]

export const embeddingModel = 'openai/text-embedding-3-large'

export const dockerRunCommands = `export DB_PASSWORD=$(openssl rand -hex 16)
export ARTEL_JWT_SECRET=$(openssl rand -hex 32)
export ARTEL_SECRETS_KEY=$(openssl rand -hex 32)
export S3_ACCESS_KEY=$(openssl rand -hex 8)
export S3_SECRET_KEY=$(openssl rand -hex 24)

docker network create artel
docker volume create artel_postgres-data
docker volume create artel_minio-data

docker run -d --name postgres --network artel --restart unless-stopped \\
  -e POSTGRES_DB=artel -e POSTGRES_USER=artel -e POSTGRES_PASSWORD="$DB_PASSWORD" \\
  -v artel_postgres-data:/var/lib/postgresql/data \\
  pgvector/pgvector:pg16

docker run -d --name redis --network artel --restart unless-stopped \\
  valkey/valkey:8.1.10-alpine valkey-server --save "" --appendonly no

docker run -d --name minio --network artel --restart unless-stopped \\
  -e MINIO_ROOT_USER="$S3_ACCESS_KEY" -e MINIO_ROOT_PASSWORD="$S3_SECRET_KEY" \\
  -v artel_minio-data:/data \\
  cgr.dev/chainguard/minio:latest server /data --console-address :9001

# One-shot: create the bucket. If MinIO is not ready yet, run it again after a few seconds.
docker run --rm --network artel \\
  -e MC_HOST_local="http://$S3_ACCESS_KEY:$S3_SECRET_KEY@minio:9000" \\
  cgr.dev/chainguard/minio-client:latest mb --ignore-existing local/artel

docker run -d --name orchestration --network artel --restart unless-stopped \\
  -e DB_HOST=postgres -e DB_PORT=5432 -e DB_NAME=artel -e DB_USERNAME=artel -e DB_PASSWORD="$DB_PASSWORD" \\
  -e DB_SSL_MODE=disable -e REDIS_URL=redis://redis:6379 \\
  -e ARTEL_INTERNAL_API_PORT=8081 \\
  -e ARTEL_AGENT_BASE_URL=http://agent-server:8000/internal -e ARTEL_AGENT_WS_BASE_URL=ws://agent-server:8000/internal \\
  -e LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_WEB=INFO -e LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_WEB_REACTIVE=INFO \\
  -e ARTEL_HOME_URL=http://localhost:8088 -e ARTEL_ALLOWED_ORIGINS=http://localhost:8088,http://localhost:8090 \\
  -e ARTEL_JWT_SECRET="$ARTEL_JWT_SECRET" -e ARTEL_SECRETS_KEY="$ARTEL_SECRETS_KEY" \\
  -e ARTEL_SECURE_COOKIE=false -e ARTEL_SIGNUP_OPEN=false -e ARTEL_GITHUB_SIGNUP_OPEN=false \\
  -e OPENROUTER_API_KEY= -e GITHUB_CLIENT_ID= -e GITHUB_CLIENT_SECRET= \\
  -e ARTEL_S3_BUCKET=artel -e ARTEL_S3_REGION=us-east-1 -e ARTEL_S3_ENDPOINT=http://minio:9000 -e ARTEL_S3_PRESIGN_ENDPOINT=http://localhost:8088 \\
  -e ARTEL_S3_ACCESS_KEY="$S3_ACCESS_KEY" -e ARTEL_S3_SECRET_KEY="$S3_SECRET_KEY" \\
  ghcr.io/project-artel/orchestration:develop
# No -p here: port 8081 serves /internal/** without authentication and must stay on the network.

docker run -d --name agent-server --network artel --restart unless-stopped \\
  -e APP_PORT=8000 -e APP_ENV=production -e OPENROUTER_API_KEY= \\
  -e ORCHESTRATION_BASE_URL=http://orchestration:8081 -e LANGSMITH_TRACING=false \\
  ghcr.io/project-artel/agent:develop

# The frontend images listen on 8080 and need these variables at start (they exit without them).
docker run -d --name admin-page --network artel --restart unless-stopped \\
  -e VITE_ORCHESTRATION_URL=http://localhost:8090 -e VITE_HOME_URL=http://localhost:8088 \\
  ghcr.io/project-artel/admin:main

docker run -d --name artel-home --network artel --restart unless-stopped \\
  -e VITE_ORCHESTRATION_URL=http://localhost:8088 \\
  ghcr.io/project-artel/console:develop

# Run from the deploy directory so ./Caddyfile exists.
docker run -d --name proxy --network artel --restart unless-stopped \\
  -e ARTEL_SITE_ADDRESS=:80 -e ARTEL_ADMIN_SITE_ADDRESS=:8090 -e ARTEL_S3_BUCKET=artel \\
  -p 8088:80 -p 8443:443 -p 8090:8090 \\
  -v "$PWD/Caddyfile:/etc/caddy/Caddyfile:ro" -v artel_caddy-data:/data -v artel_caddy-config:/config \\
  caddy:2-alpine`
