// Routes of the self-hosting pages. The router, the hub cards and the route check all read this list,
// so a card cannot point at a page that is not registered.

export const selfHostingMethodIds = ['install-script', 'docker-compose', 'docker'] as const

export type SelfHostingMethodId = (typeof selfHostingMethodIds)[number]

export const selfHostingHubPath = '/self-hosting'

export function selfHostingMethodPath(id: SelfHostingMethodId): string {
  return `${selfHostingHubPath}/${id}`
}

// Every locale-less path the router registers for this feature, hub first.
export const selfHostingPaths: string[] = [
  selfHostingHubPath,
  ...selfHostingMethodIds.map(selfHostingMethodPath),
]
