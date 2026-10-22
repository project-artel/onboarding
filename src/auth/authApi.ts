const apiOrigin = (import.meta.env.VITE_ORCHESTRATION_URL ?? 'http://localhost:8080').replace(/\/$/, '')
export const consoleUrl = import.meta.env.VITE_CONSOLE_URL ?? '/console'

export type Providers = { password: boolean; github: boolean; signupOpen: boolean }
export class AuthError extends Error {
  constructor(readonly code: string) { super(code) }
}

async function request(path: string, init?: RequestInit) {
  return fetch(`${apiOrigin}${path}`, { ...init, credentials: 'include' })
}

export async function getProviders(): Promise<Providers> {
  const response = await request('/api/auth/providers')
  if (!response.ok) throw new AuthError('unavailable')
  const value: unknown = await response.json()
  if (!value || typeof value !== 'object' || !('password' in value) || !('github' in value) || !('signupOpen' in value)) throw new AuthError('unavailable')
  return { password: value.password === true, github: value.github === true, signupOpen: value.signupOpen === true }
}

let refreshInFlight: Promise<Response> | undefined
export async function hasSession(): Promise<boolean> {
  let response = await request('/api/auth/me')
  if (response.status === 401) {
    refreshInFlight ??= request('/api/auth/refresh', { method: 'POST' }).finally(() => { refreshInFlight = undefined })
    const refresh = await refreshInFlight
    if (refresh.ok) response = await request('/api/auth/me')
    else if (refresh.status !== 401 && refresh.status !== 403) throw new AuthError('unavailable')
  }
  if (response.status === 401) return false
  if (!response.ok) throw new AuthError('unavailable')
  return true
}

export async function authenticate(mode: 'login' | 'signup', email: string, password: string, name: string) {
  const response = await request(`/api/auth/${mode}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mode === 'signup' ? { email, password, name } : { email, password }),
  })
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    const code = body && typeof body === 'object' && 'code' in body && typeof body.code === 'string' ? body.code : ''
    throw new AuthError(code || (response.status === 429 ? 'too_many_attempts' : response.status === 401 ? 'invalid_credentials' : 'unavailable'))
  }
}

export function githubLoginUrl() {
  const url = new URL(`${apiOrigin}/oauth2/authorization/github`, window.location.origin)
  const returnTo = new URL(window.location.href)
  returnTo.searchParams.delete('auth_error')
  url.searchParams.set('return_to', returnTo.href)
  return url.href
}
