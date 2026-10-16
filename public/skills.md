# Install the ARTEL agent skills

These instructions are for an AI coding agent installing the ARTEL agent skills
for the user. Run the steps in order, and report each result to the user.

The skills live in https://github.com/project-artel/artel-skills and are
installed with the `skills` CLI through `npx`. They teach an agent how to install
the ARTEL Unity SDK, use the `artel` CLI, drive a game through a local MCP
server, and add cheats and behaviors for the QA agent.

## 1. Ask the user

Ask the user whether they want the skills installed, and whether it should be for
this project only (the default) or for every project (`-g`). Do not install
before they answer.

## 2. Check Node.js

```
node --version
```

`npx` ships with Node.js. If `node` is missing, stop and tell the user. Do not
install Node.js without asking the user first.

## 3. Install

For this project only:

```
npx skills add project-artel/artel-skills
```

For every project:

```
npx skills add project-artel/artel-skills -g
```

To install one skill, add `--skill <name>`. The skills are `artel-unity-sdk`,
`artel-cli`, `artel-mcp`, `artel-cheats`, and `artel-behaviors`. The command may
ask which agents to install for; let the user choose.

## 4. Confirm

```
npx skills add project-artel/artel-skills --list
```

lists the skills in the repository without installing anything. Tell the user
which skills were installed and which agents they were installed for.
