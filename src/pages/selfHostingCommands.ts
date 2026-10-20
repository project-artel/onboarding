// Commands and slug lists on the self-hosting pages. They are identical in every locale, so they live
// here once instead of inside each translation. Source of truth: deploy/README.md,
// deploy/install.sh and deploy/docker-compose.yml in https://github.com/project-artel/artel.

export const installCommand =
  'curl -fsSL https://raw.githubusercontent.com/project-artel/artel/main/deploy/install.sh | sh'

export const installWithFlagsCommand = `${installCommand} -s -- --dir /opt/artel --port 8088`

export const generateSecretCommand = 'openssl rand -hex 32'

export const composeUpCommands = 'docker compose up -d\ndocker compose ps'

export const composeLogsCommand = 'docker compose logs -f orchestration'

export const composeUpgradeCommands = 'docker compose pull && docker compose up -d'

export const backupCommand =
  `docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > artel-$(date +%F).sql`

export const restoreCommand =
  `docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"' < artel-2026-10-06.sql`

export const composeDownCommand = 'docker compose down'
