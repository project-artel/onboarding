// Wishlist 대화상자의 문구. 버튼과 제목 `Wishlist`는 owner가 정한 표기라 두 언어에서 같게 둔다.
// 닫기 버튼 이름은 다른 대화상자와 같은 `messages.ts`의 `dialog.close`를 쓴다.
// `{email}`은 신청한 주소, `{contact}`는 문의 주소로 바뀐다.
// 개인정보 수집·이용 동의의 보유 기간은 아직 owner 확인 전이다.
export const wishlistCopy = {
  ko: {
    open: 'Wishlist',
    title: 'Wishlist',
    intro: 'ARTEL 출시 소식을 가장 먼저 받아 보세요. 이메일 한 곳으로만 보내 드려요.',
    email: '이메일',
    placeholder: 'you@studio.com',
    submit: '신청하기',
    busy: '신청하는 중…',
    consent: '개인정보 수집·이용에 동의해요',
    consentMore: '자세히',
    consentDetails: '수집 항목: 이메일 · 이용 목적: ARTEL 출시와 주요 소식 안내 · 보유 기간: 신청을 취소할 때까지. 동의하지 않으면 신청할 수 없어요.',
    note: '신청 취소나 문의는 {contact}로 보내 주세요.',
    joinedTitle: '신청했어요',
    joinedBody: '{email}로 출시 소식을 보내 드릴게요.',
    invalid_email: '올바른 이메일을 입력해 주세요.',
    consent_required: '개인정보 수집·이용에 동의해 주세요.',
    rate_limited: '요청이 많아요. 잠시 후 다시 시도해 주세요.',
    unavailable: '신청하지 못했어요. 잠시 후 다시 시도해 주세요.',
  },
  en: {
    open: 'Wishlist',
    title: 'Wishlist',
    intro: 'Be the first to hear when ARTEL launches. We only send it to this one address.',
    email: 'Email',
    placeholder: 'you@studio.com',
    submit: 'Join',
    busy: 'Joining…',
    consent: 'I agree to the collection and use of my personal information',
    consentMore: 'Details',
    consentDetails: "Collected: email · Purpose: ARTEL launch and major updates · Retention: until you cancel. You can't join without agreeing.",
    note: 'To cancel or ask anything, email {contact}.',
    joinedTitle: "You're on the list",
    joinedBody: "We'll send launch news to {email}.",
    invalid_email: 'Enter a valid email.',
    consent_required: 'Please agree to the collection and use of your personal information.',
    rate_limited: 'Too many requests. Please try again later.',
    unavailable: "Couldn't join the wishlist. Please try again later.",
  },
}
