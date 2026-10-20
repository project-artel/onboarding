# User-Facing Copy

Rules for every string a person reads on the site: `src/i18n/messages.ts`, page and component text,
`index.html` meta, `public/llms.txt`. Each rule below comes from a correction the owner made on 2026-10-20.

## What to write

Write only what the reader uses to install, run, or decide. For each sentence ask: if I delete it, does the
reader get stuck? If not, delete it. Details belong in the README or `deploy/` documents.

Do not write:

- **Internal behaviour or reasons.** How keys are encrypted, when migrations run, which branch an image follows,
  what is bundled inside the app, "runs without Docker".
- **Progress or status.** No "shipped"/"planned" badges, no "not released yet", no "what works today", no
  "in development" eyebrow. The site presents every feature as available.
- **Details few readers need.** Reopening signup, Bedrock region, model lists, GitHub login setup, browser
  versions, backup and restore, logs, upgrade and stop commands, `npx` alternatives.
- **Things the product already shows.** First-run guidance the app displays by itself.
- **Repetition.** A lead that restates the heading, a section that restates another section on the same page,
  a sentence that restates the button beside it ("궁금한 점은 문의해 주세요" next to a 문의 button), two buttons
  that go to the same place, a hub card sentence repeated on the detail page.
- **Unrequested additions.** Ask the owner before adding a section, an FAQ entry, or a claim that was not asked
  for. When unsure, leave it out and ask.

Read each page whole, title and every section side by side, not one string at a time. Repetition only shows at
that level.

## Headings are labels

A heading names the thing. It is not a slogan, a promise, or a pitch-deck phrase.

| Do not write | Write |
| --- | --- |
| 기획서만 주면, 테스트는 에이전트가 | Unity 게임 QA Agent |
| 해결하려는 문제 | 지금의 게임 QA |
| 처음 할 일 | 초기 설정 |
| 필요한 것 | 요구 사항 |
| 맨 위 설정 | 비밀값 설정 |
| 직접 설치 (two meanings) | 셀프 호스팅 / 수동 설치 |

Name things by what they are, not by where they sit on the page ("맨 위 설정"). Use one word for one meaning
across the site.

## Sentence form in Korean

| Where | Form | Example |
| --- | --- | --- |
| Bullet lists, card bodies, step bodies, short leads | Noun phrase, no subject, no `~합니다` | 관리 > 설정에서 API 키 입력 |
| FAQ answers | Friendly 해요체 sentences | 아니요, 패키지만 추가하면 돼요. |
| Messages to the reader (404, load failure) | Polite sentence | 주소를 다시 확인해 주세요. |

- A noun-phrase bullet drops the subject. "API 키는 관리자가 관리 > 설정에서 입력" reads stiff; write
  "관리 > 설정에서 API 키 입력".
- Do not write `label: value` fragments such as "API 키 입력: admin 으로 /admin/settings" or
  "로그인 화면이 안 뜰 때: …". Write a plain phrase: "로그인 화면이 안 뜨면 Unity 에디터나 Development Build로 실행".
- Do not count list items in a heading or lead ("포함된 skill 5개", "방법은 세 가지입니다").
- Refer to console screens by the names the console shows ("관리 > 설정", "모델 확인", "기능별 모델"),
  not by URL paths.
- Explain jargon in terms of what the reader sees. Not "exit code 0", but "QA가 실패하면 CI 작업도 실패로 끝남".
- Keep technical terms and product names in English where the product uses them (`SDK`, `CLI`, `Macro`).

## Facts

- Every claim must be true of the code on `develop` today. Check the console's i18n strings and routes in
  `artel-home` before naming a feature, and check the server before stating a requirement (for example,
  embeddings go through OpenRouter only, so OpenRouter is required and Bedrock and the Claude API are optional).
- Do not claim more than the product does ("기획서만 주면" was false: an SDK and a build are needed too).

## Before handing off

- Rebuild, open every changed page in a browser at 1280 px and 360 px, light and dark, and read it as a visitor.
- Check that no element scrolls or overflows unless it is meant to.
- Apply the same rules to English strings.
