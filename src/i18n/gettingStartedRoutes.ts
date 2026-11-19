const gettingStartedPaths = ['/getting-started', '/sdk', '/cli', '/skills', '/self-hosting'] as const

export function isGettingStartedPath(pathname: string): boolean {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  return gettingStartedPaths.some(path => bare === path || bare.startsWith(`${path}/`))
}
