import type { Locale } from '../i18n/locale'
import { orchestrationOrigin } from '../lib/orchestration'

/** `POST /wishlist` 요청 본문. orchestration의 엔드포인트와 같은 모양이다. 동의하지 않으면 보내지 않으므로
 *  `consent`는 늘 `true`다. `website`는 봇을 거르는 함정 칸 값이고, 사람이 보낸 요청에서는 빈 문자열이다. */
export type WishlistRequest = { email: string; locale: Locale; consent: true; website: string }

/** 400 응답 본문. `code`만 읽는다. */
type WishlistErrorBody = { code?: string }

export type WishlistOutcome = 'joined' | 'invalid_email' | 'consent_required' | 'rate_limited' | 'unavailable'

// 응답이 오지 않으면 버튼이 `신청하는 중…`에 묶여 있게 된다. 일정 시간이 지나면 실패로 본다.
const requestTimeoutMs = 15_000

function parseErrorBody(value: unknown): WishlistErrorBody {
  if (!value || typeof value !== 'object' || !('code' in value) || typeof value.code !== 'string') return {}
  return { code: value.code }
}

/** 신청 결과를 돌려준다. 네트워크 오류도 `unavailable`로 돌려주므로 던지지 않는다. */
export async function joinWishlist(request: WishlistRequest): Promise<WishlistOutcome> {
  let response: Response
  try {
    // 신청에는 계정이 필요 없다. 쿠키를 싣지 않아야 서버가 다른 출처의 자격 증명 요청으로 다루지 않는다.
    response = await fetch(`${orchestrationOrigin}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      credentials: 'omit',
      signal: AbortSignal.timeout(requestTimeoutMs),
    })
  } catch {
    return 'unavailable'
  }
  if (response.ok) return 'joined'
  if (response.status === 429) return 'rate_limited'
  if (response.status === 400) {
    const body = parseErrorBody(await response.json().catch(() => null))
    if (body.code === 'invalid_email') return 'invalid_email'
    if (body.code === 'consent_required') return 'consent_required'
  }
  return 'unavailable'
}
