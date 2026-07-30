import type { Locale } from './locale'

// 구현 상태는 카피에서 지운다고 사라지지 않는다. 배지로 명시해 두면 문구를
// 고치는 사람이 미구현 기능을 현재형으로 바꿔 쓰는 일을 막는다.
export type Availability = 'shipped' | 'planned'

type Copy = {
  meta: { title: string; description: string }
  nav: { sdk: string; how: string; skipToContent: string; home: string }
  availability: Record<Availability, string>
  hero: {
    status: string
    title: string
    subtitle: string
    primaryCta: string
    secondaryCta: string
  }
  problem: { title: string; items: string[] }
  steps: {
    title: string
    items: { index: string; title: string; body: string; state: Availability }[]
  }
  features: {
    title: string
    items: { title: string; body: string; state: Availability }[]
  }
  requirements: { title: string; items: string[] }
  cta: { title: string; body: string }
  faq: { title: string; items: { q: string; a: string }[] }
  footer: { contact: string; repository: string; language: string }
  sdk: {
    title: string
    lead: string
    placeholderNote: string
    steps: { title: string; body: string; code?: string; language?: string }[]
    troubleshootTitle: string
    troubleshoot: string[]
    copy: string
    copied: string
  }
  how: {
    title: string
    lead: string
    componentsTitle: string
    components: { name: string; body: string }[]
    flowTitle: string
    flowAlt: string
    flow: string[]
    lifecycleTitle: string
    lifecycle: { title: string; body: string; state: Availability }[]
    contextTitle: string
    contextBody: string
  }
  notFound: { title: string; body: string; back: string }
}

const ko: Copy = {
  meta: {
    title: 'ARTEL — 게임 QA를 에이전트가 대신 플레이한다',
    description:
      'Unity 게임에 SDK를 붙이면 에이전트가 직접 조작하며 시나리오를 검증하고 실패 순간의 증거를 남긴다.',
  },
  nav: {
    sdk: 'SDK 설치',
    how: '작동 원리',
    skipToContent: '본문으로 건너뛰기',
    home: '홈',
  },
  availability: { shipped: '동작 중', planned: '개발 예정' },
  hero: {
    status: '개발 중인 제품 — 지금은 SDK 연결과 액션 주입 구간이 동작한다',
    title: '게임 QA를 에이전트가 대신 플레이한다',
    subtitle:
      'Unity 프로젝트에 SDK 하나를 붙이면 에이전트가 씬 상태를 읽고 직접 입력을 넣어 시나리오를 진행한다. 사람은 결과와 증거만 확인한다.',
    primaryCta: 'SDK 다운로드',
    secondaryCta: '설치 문서 보기',
  },
  problem: {
    title: '왜 필요한가',
    items: [
      '빌드가 올라올 때마다 같은 회귀 시나리오를 사람이 처음부터 다시 돈다.',
      '재현 경로가 문장으로만 남아 닫힌 이슈가 다시 열린다.',
      '검증할 시나리오를 늘릴수록 QA 인원이 병목이 된다.',
    ],
  },
  steps: {
    title: '작동 원리',
    items: [
      {
        index: '01',
        title: 'SDK를 게임에 임베드한다',
        body: 'Unity 프로젝트에 패키지를 추가하고 발급받은 sdkId로 서버에 연결한다. SDK는 씬 블록 구조를 주기적으로 스캔해 현재 상태를 보고한다.',
        state: 'shipped',
      },
      {
        index: '02',
        title: '에이전트가 직접 플레이한다',
        body: '에이전트가 보고된 씬 상태를 읽고 다음 행동을 정한 뒤, 키보드·마우스 입력을 게임에 주입해 시나리오를 진행한다.',
        state: 'shipped',
      },
      {
        index: '03',
        title: '증거를 남긴다',
        body: '액션 결과와 실행 로그를 타임라인으로 쌓고, 실패한 순간의 상태를 이슈에 붙인다.',
        state: 'planned',
      },
    ],
  },
  features: {
    title: '무엇을 하는가',
    items: [
      {
        title: '입력 주입',
        body: '키보드·마우스 입력을 실제 플레이와 같은 경로로 게임에 넣는다.',
        state: 'shipped',
      },
      {
        title: 'Scene 상태 스캔',
        body: '씬 블록 구조를 주기적으로 읽어 지금 화면이 무엇인지 판단한다.',
        state: 'shipped',
      },
      {
        title: '시나리오 자동 생성',
        body: '기획서를 올리면 게임 컨텍스트를 추출해 테스트 시나리오 초안을 만든다.',
        state: 'planned',
      },
      {
        title: '이슈 증거',
        body: '실패 지점의 상태, 로그, 직전 액션을 하나의 이슈로 묶는다.',
        state: 'planned',
      },
      {
        title: '테스트 런 구성',
        body: '확정한 시나리오를 조합해 빌드마다 같은 세트를 실행한다.',
        state: 'planned',
      },
    ],
  },
  requirements: {
    title: '필요한 것',
    items: [
      'Unity 프로젝트에 패키지를 추가할 수 있는 접근 권한. 게임 로직 수정은 필요 없다.',
      '게임 클라이언트에서 서버로 나가는 WebSocket 연결 허용.',
      '서버 주소와 발급받은 sdkId 설정.',
    ],
  },
  cta: {
    title: '지금 붙여 보고 판단해라',
    body: 'SDK 연결까지는 문서만으로 끝난다. 문의는 그다음이다.',
  },
  faq: {
    title: '자주 묻는 것',
    items: [
      {
        q: '게임 소스가 필요한가?',
        a: 'SDK 패키지를 프로젝트에 추가해야 하므로 빌드 파이프라인 접근은 필요하다. 게임 로직을 고치지는 않는다.',
      },
      {
        q: '어떤 게임에 되는가?',
        a: '씬 상태를 읽고 입력으로 조작할 수 있는 Unity 게임이면 된다. 지금은 단일 플레이 흐름을 먼저 검증하고 있다.',
      },
      {
        q: '데이터는 어디에 남는가?',
        a: '실행 로그와 증거는 ARTEL 서버에 남는다. 자체 호스팅은 아직 제공하지 않는다.',
      },
      {
        q: '지금 어디까지 되는가?',
        a: 'sdkId 발급, SDK WebSocket 연결, 씬 상태 보고, 액션 주입까지 동작한다. 시나리오 생성과 QA 실행 화면은 개발 중이다.',
      },
    ],
  },
  footer: { contact: '문의', repository: '저장소', language: '언어' },
  sdk: {
    title: 'SDK 설치',
    lead: 'Unity 프로젝트에 ARTEL SDK를 붙이고 서버 연결까지 확인하는 순서다.',
    placeholderNote:
      '배포 경로와 서버 주소는 확정 전이다. 아래 값 중 중괄호로 감싼 부분은 발급받은 값으로 바꿔 넣어라.',
    steps: [
      {
        title: '1. 패키지 추가',
        body: 'Unity Package Manager에서 Add package from git URL을 고르고 SDK 저장소 주소를 넣는다.',
        code: 'https://github.com/project-artel/artel-sdk.git',
        language: 'text',
      },
      {
        title: '2. sdkId 발급',
        body: '게임 인스턴스를 구분하는 식별자를 서버에서 발급받는다.',
        code: 'curl -X POST https://{서버 주소}/api/sdkId',
        language: 'bash',
      },
      {
        title: '3. 서버 주소 설정',
        body: '씬에 ArtelSdk 컴포넌트를 올리고 발급받은 값을 넣는다.',
        code: `var config = new ArtelConfig {
    ServerAddress = "{서버 주소}",
    SdkId = "{발급받은 sdkId}",
};

ArtelSdk.Connect(config);`,
        language: 'csharp',
      },
      {
        title: '4. 연결 확인',
        body: '게임을 실행하면 SDK가 아래 주소로 WebSocket 연결을 맺는다. 콘솔에 연결 로그가 찍히면 성공이다.',
        code: 'ws://{서버 주소}/ws/sdk?sdkId={발급받은 sdkId}',
        language: 'text',
      },
    ],
    troubleshootTitle: '연결이 안 될 때',
    troubleshoot: [
      '서버 주소에 스킴(ws/wss)이나 포트를 빠뜨리지 않았는지 확인한다.',
      'sdkId가 발급 응답의 값과 정확히 같은지 확인한다.',
      '사내 방화벽이나 프록시가 WebSocket 업그레이드를 막지 않는지 확인한다.',
      '서버 상태는 /health로 먼저 확인한다.',
    ],
    copy: '복사',
    copied: '복사했다',
  },
  how: {
    title: '작동 원리',
    lead: '에이전트가 게임을 플레이한다는 말이 어떤 구조로 성립하는지 정리했다.',
    componentsTitle: '구성 요소',
    components: [
      {
        name: 'Unity SDK',
        body: '게임에 임베드된다. 씬 블록 구조를 스캔해 상태를 보고하고, 서버가 내린 액션을 실제 입력으로 주입한다.',
      },
      {
        name: 'Agent 서버',
        body: '보고된 상태와 시나리오를 읽고 다음 행동을 정한다. 검증 결과와 이슈를 세션 단위로 남긴다.',
      },
      {
        name: 'Orchestration 서버',
        body: '프로젝트, 기획서, 게임 빌드, 시나리오, 테스트 런, QA 실행을 관리하고 에이전트에 필요한 도구 API를 제공한다.',
      },
      {
        name: '대시보드',
        body: '실행을 리플레이로 되짚고 타임라인에서 액션과 증거를 확인한다.',
      },
    ],
    flowTitle: '데이터 흐름',
    flowAlt:
      '게임 안의 SDK가 씬 상태를 Orchestration 서버로 보고하고, Agent 서버가 다음 액션을 정해 다시 SDK로 내려보내며, 실행 결과가 대시보드에 기록되는 흐름',
    flow: [
      'SDK가 씬 상태를 보고한다.',
      'Agent 서버가 시나리오와 상태를 비교해 다음 액션을 정한다.',
      'Orchestration 서버가 액션을 해당 게임 인스턴스로 내려보낸다.',
      'SDK가 입력을 주입하고 결과를 되돌려 보낸다.',
      '실행 로그와 이슈가 기록되고 대시보드에서 조회된다.',
    ],
    lifecycleTitle: 'QA 실행 수명주기',
    lifecycle: [
      {
        title: '기획서 업로드',
        body: '문서를 올리면 게임 컨텍스트를 추출해 시나리오의 근거로 쓴다.',
        state: 'planned',
      },
      {
        title: '시나리오 생성과 승인',
        body: '대화와 캔버스로 시나리오를 다듬고 확정한다.',
        state: 'planned',
      },
      {
        title: '테스트 런 구성',
        body: '확정한 시나리오를 조합해 실행 단위를 만든다.',
        state: 'planned',
      },
      {
        title: '게임 인스턴스 연결',
        body: '빌드를 등록하고 SDK가 붙은 인스턴스를 연결한다.',
        state: 'shipped',
      },
      {
        title: 'QA 실행과 이슈 조회',
        body: '에이전트가 시나리오를 돌리고 남긴 증거를 확인한다.',
        state: 'planned',
      },
    ],
    contextTitle: '기획서를 어떻게 쓰는가',
    contextBody:
      '업로드한 기획서에서 게임 규칙과 목표를 뽑아 게임 컨텍스트로 저장한다. 에이전트는 이 컨텍스트를 근거로 시나리오를 만들고, 실행 중에도 판단 근거로 참조한다. 이 구간은 개발 예정이다.',
  },
  notFound: {
    title: '없는 페이지다',
    body: '주소를 다시 확인해라.',
    back: '홈으로',
  },
}

const en: Copy = {
  meta: {
    title: 'ARTEL — An agent plays your game QA',
    description:
      'Drop the SDK into your Unity game and an agent drives it, running scenarios and leaving evidence at the moment things break.',
  },
  nav: {
    sdk: 'Install SDK',
    how: 'How it works',
    skipToContent: 'Skip to content',
    home: 'Home',
  },
  availability: { shipped: 'Working', planned: 'Planned' },
  hero: {
    status: 'Early product — SDK connection and action injection work today',
    title: 'An agent plays your game QA',
    subtitle:
      'Add one SDK to your Unity project and an agent reads the scene, injects real input, and walks through scenarios. You only review the outcome and the evidence.',
    primaryCta: 'Download SDK',
    secondaryCta: 'Read install guide',
  },
  problem: {
    title: 'Why it exists',
    items: [
      'Every build sends a person through the same regression scenarios from the top.',
      'Reproduction steps survive only as prose, so closed issues come back.',
      'The more scenarios you want covered, the more your QA headcount becomes the bottleneck.',
    ],
  },
  steps: {
    title: 'How it works',
    items: [
      {
        index: '01',
        title: 'Embed the SDK',
        body: 'Add the package to your Unity project and connect with an issued sdkId. The SDK scans the scene block structure and reports the current state.',
        state: 'shipped',
      },
      {
        index: '02',
        title: 'The agent plays',
        body: 'The agent reads the reported state, decides the next move, and injects keyboard and mouse input to advance the scenario.',
        state: 'shipped',
      },
      {
        index: '03',
        title: 'Evidence stays',
        body: 'Action results and run logs land on a timeline, and the state at the failure point is attached to an issue.',
        state: 'planned',
      },
    ],
  },
  features: {
    title: 'What it does',
    items: [
      {
        title: 'Input injection',
        body: 'Keyboard and mouse input reach the game the same way a player does.',
        state: 'shipped',
      },
      {
        title: 'Scene state scan',
        body: 'The scene block structure is read on an interval to tell what is on screen right now.',
        state: 'shipped',
      },
      {
        title: 'Scenario generation',
        body: 'Upload a design document and game context is extracted into draft test scenarios.',
        state: 'planned',
      },
      {
        title: 'Issue evidence',
        body: 'State, logs, and the preceding action are bundled into one issue.',
        state: 'planned',
      },
      {
        title: 'Test run composition',
        body: 'Approved scenarios are grouped so every build runs the same set.',
        state: 'planned',
      },
    ],
  },
  requirements: {
    title: 'What you need',
    items: [
      'Access to add a package to the Unity project. No game logic changes required.',
      'Outbound WebSocket connections allowed from the game client.',
      'A server address and an issued sdkId.',
    ],
  },
  cta: {
    title: 'Wire it up and judge for yourself',
    body: 'Getting to a connected SDK takes only the docs. Talk to us after that.',
  },
  faq: {
    title: 'Questions',
    items: [
      {
        q: 'Do you need our source code?',
        a: 'You add a package to the project, so build pipeline access is needed. Game logic is not modified.',
      },
      {
        q: 'Which games does it work with?',
        a: 'Any Unity game whose scene state can be read and driven by input. Single-player flows are what we validate first.',
      },
      {
        q: 'Where does the data live?',
        a: 'Run logs and evidence are stored on ARTEL servers. Self-hosting is not offered yet.',
      },
      {
        q: 'What works today?',
        a: 'sdkId issuance, the SDK WebSocket connection, scene state reporting, and action injection. Scenario generation and the QA run screens are still in development.',
      },
    ],
  },
  footer: { contact: 'Contact', repository: 'Repository', language: 'Language' },
  sdk: {
    title: 'Install the SDK',
    lead: 'The order of work to attach the ARTEL SDK to a Unity project and confirm the server connection.',
    placeholderNote:
      'The distribution path and server address are not final. Replace anything in braces with the value you were issued.',
    steps: [
      {
        title: '1. Add the package',
        body: 'In Unity Package Manager choose Add package from git URL and paste the SDK repository address.',
        code: 'https://github.com/project-artel/artel-sdk.git',
        language: 'text',
      },
      {
        title: '2. Get an sdkId',
        body: 'Request the identifier that distinguishes this game instance.',
        code: 'curl -X POST https://{server}/api/sdkId',
        language: 'bash',
      },
      {
        title: '3. Configure the server',
        body: 'Put the ArtelSdk component in your scene and fill in the issued values.',
        code: `var config = new ArtelConfig {
    ServerAddress = "{server}",
    SdkId = "{issued sdkId}",
};

ArtelSdk.Connect(config);`,
        language: 'csharp',
      },
      {
        title: '4. Verify the connection',
        body: 'On play the SDK opens a WebSocket to the address below. A connection log in the console means it worked.',
        code: 'ws://{server}/ws/sdk?sdkId={issued sdkId}',
        language: 'text',
      },
    ],
    troubleshootTitle: 'If it will not connect',
    troubleshoot: [
      'Check that the server address carries the scheme (ws/wss) and the port.',
      'Check the sdkId matches the issuance response exactly.',
      'Check that a corporate firewall or proxy is not blocking the WebSocket upgrade.',
      'Check server health at /health first.',
    ],
    copy: 'Copy',
    copied: 'Copied',
  },
  how: {
    title: 'How it works',
    lead: 'What actually makes "an agent plays the game" true.',
    componentsTitle: 'Components',
    components: [
      {
        name: 'Unity SDK',
        body: 'Embedded in the game. Scans the scene block structure to report state, and turns server actions into real input.',
      },
      {
        name: 'Agent server',
        body: 'Reads reported state against the scenario and decides the next move. Keeps results and issues per session.',
      },
      {
        name: 'Orchestration server',
        body: 'Owns projects, documents, game builds, scenarios, test runs, and QA runs, and exposes the tool APIs the agent needs.',
      },
      {
        name: 'Dashboard',
        body: 'Replays a run and shows actions and evidence on a timeline.',
      },
    ],
    flowTitle: 'Data flow',
    flowAlt:
      'The SDK inside the game reports scene state to the orchestration server, the agent server decides the next action and sends it back down to the SDK, and run results are recorded for the dashboard',
    flow: [
      'The SDK reports scene state.',
      'The agent server compares scenario and state to pick the next action.',
      'The orchestration server dispatches the action to that game instance.',
      'The SDK injects the input and returns the result.',
      'Run logs and issues are recorded and read from the dashboard.',
    ],
    lifecycleTitle: 'QA run lifecycle',
    lifecycle: [
      {
        title: 'Upload the design doc',
        body: 'Game context is extracted from the document and becomes the basis for scenarios.',
        state: 'planned',
      },
      {
        title: 'Generate and approve scenarios',
        body: 'Refine scenarios through chat and canvas, then lock them in.',
        state: 'planned',
      },
      {
        title: 'Compose a test run',
        body: 'Group approved scenarios into an executable unit.',
        state: 'planned',
      },
      {
        title: 'Connect a game instance',
        body: 'Register the build and connect the instance carrying the SDK.',
        state: 'shipped',
      },
      {
        title: 'Run QA and read issues',
        body: 'The agent drives the scenarios and you review the evidence it left.',
        state: 'planned',
      },
    ],
    contextTitle: 'How the design doc is used',
    contextBody:
      'Rules and goals are extracted from the uploaded document and stored as game context. The agent builds scenarios from it and consults it while running. This part is still planned.',
  },
  notFound: {
    title: 'No such page',
    body: 'Check the address.',
    back: 'Back home',
  },
}

export const messages: Record<Locale, Copy> = { ko, en }
