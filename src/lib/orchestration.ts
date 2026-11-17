// orchestration 서버의 주소. 끝의 `/`를 떼어 두어 호출하는 쪽이 `/api/...` 경로를 그대로 붙인다.
// 값이 없으면 로컬 개발 서버를 쓴다.
export const orchestrationOrigin = (import.meta.env.VITE_ORCHESTRATION_URL ?? 'http://localhost:8080').replace(/\/$/, '')
