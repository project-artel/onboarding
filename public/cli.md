# Install the ARTEL CLI

These instructions are for an AI coding agent installing the ARTEL CLI on the
user's machine. Run the steps in order, and report each result to the user.

The CLI is the npm package `@project-artel/cli`. It installs the command `artel`.

## 1. Check Node.js

```
node --version
```

The CLI needs Node.js 22.12.0 or newer. If `node` is missing or older, stop and
tell the user. Do not install or upgrade Node.js without asking the user first.

## 2. Install

```
npm install -g @project-artel/cli@alpha
```

Always include the `@alpha` tag. The `latest` tag points at an outdated build.

If the install fails with a permission error, do not retry with `sudo`. Tell the
user, and offer `npx @project-artel/cli@alpha <command>` instead, which needs no
global install.

## 3. Verify

```
artel --version
```

It prints the installed version.

## 4. Sign in

Ask the user which way they want to sign in.

**On their own machine, with a browser:**

```
artel auth login
```

The command prints a URL and tries to open it in a browser. Show the URL to the
user and wait while they finish signing in. The credential is stored at
`~/.artel/credentials.json`.

**In CI, or without a browser:** the user issues a CLI token in the ARTEL
console, under account settings, in the CLI tokens panel. They set it as the
`ARTEL_TOKEN` environment variable themselves. Do not ask the user to paste the
token into the chat, and never print it or write it into a file in the
repository.

## 5. Check the sign-in

```
artel auth status
```

It reports whether a credential is in use and where it came from. It prints a
fingerprint, never the token.

## 6. Next

```
artel project list
```

lists the projects the user can access. `artel --help` lists every command, and
the full reference is https://github.com/project-artel/artel-cli#readme.
