// Commands and slug lists on the self-hosting pages. They are identical in every locale, so they live
// here once instead of inside each translation. Source of truth: deploy/README.md,
// deploy/install.sh and deploy/docker-compose.yml in https://github.com/project-artel/artel.

export const installCommand =
  'curl -fsSL https://raw.githubusercontent.com/project-artel/artel/main/deploy/install.sh | sh'

export const installWithFlagsCommand = `${installCommand} -s -- --dir /opt/artel --port 8088`

// The file itself is never copied into this site: the command, the viewer and the copy button all read it from
// the artel repository.
export const composeRawUrl = 'https://raw.githubusercontent.com/project-artel/artel/main/deploy/docker-compose.yml'

export const composeViewUrl = 'https://github.com/project-artel/artel/blob/main/deploy/docker-compose.yml'

export const composeDownloadCommand = `curl -fsSL ${composeRawUrl} -o docker-compose.yml`

export const generateSecretCommand = 'openssl rand -hex 32'

export const composeUpCommands = 'docker compose up -d'
