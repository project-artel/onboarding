import type { Locale } from './locale'

// 구현 상태는 카피에서 지운다고 사라지지 않는다. 배지로 명시해 두면 문구를
// 고치는 사람이 미구현 기능을 현재형으로 바꿔 쓰는 일을 막는다.
export type Availability = 'shipped' | 'planned'

// Keys of the commands and slug lists kept once in `pages/selfHostingCommands.ts`.
export type SelfHostingCodeKey =
  | 'install'
  | 'installWithFlags'
  | 'signupOpen'
  | 'openRouterEnvironment'
  | 'models'
  | 'compose'
  | 'composeUpgrade'
  | 'composeBuild'
  | 'backup'
  | 'dockerRun'
  | 'githubEnvironment'

export type SelfHostingBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'code'; code: SelfHostingCodeKey }

export type SelfHostingSection = {
  title: string
  // Omitted for sections that describe a fact instead of a feature, such as known limits.
  state?: Availability
  blocks: SelfHostingBlock[]
}

type Copy = {
  meta: { title: string; description: string }
  nav: { sdk: string; selfHosting: string; how: string; skipToContent: string; home: string }
  theme: { toLight: string; toDark: string }
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
    steps: { title: string; body: string; code?: string }[]
    helpTitle: string
    help: string[]
    contactCta: string
    advancedTitle: string
    advancedNote: string
    advanced: { label: string; code: string }[]
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
  selfHosting: {
    title: string
    lead: string
    statusNote: string
    sections: SelfHostingSection[]
    deployReadmeLabel: string
    licenseLabel: string
  }
  notFound: { title: string; body: string; back: string }
}

const ko: Copy = {
  meta: {
    title: 'ARTEL — 게임 QA를 에이전트가 대신 플레이합니다',
    description:
      'Unity 게임에 SDK를 연결하면 에이전트가 직접 조작하며 시나리오를 검증하고, 실패한 순간의 증거를 남깁니다.',
  },
  nav: {
    sdk: 'SDK 설치',
    selfHosting: '직접 설치',
    how: '작동 원리',
    skipToContent: '본문으로 건너뛰기',
    home: '홈',
  },
  theme: { toLight: '라이트 모드로 전환', toDark: '다크 모드로 전환' },
  availability: { shipped: '동작 중', planned: '개발 예정' },
  hero: {
    status: '개발 중인 제품입니다. 현재 SDK 연결과 액션 주입 구간이 동작합니다',
    title: '게임 QA를 에이전트가 대신 플레이합니다',
    subtitle:
      'Unity 프로젝트에 SDK 하나를 연결하면 에이전트가 씬 상태를 읽고 직접 입력을 넣어 시나리오를 진행합니다. 사람은 결과와 증거만 확인하면 됩니다.',
    primaryCta: 'SDK 다운로드',
    secondaryCta: '설치 문서 보기',
  },
  problem: {
    title: '왜 필요한가요',
    items: [
      '빌드가 올라올 때마다 같은 회귀 시나리오를 사람이 처음부터 다시 돌게 됩니다.',
      '재현 경로가 문장으로만 남아, 닫힌 이슈가 다시 열립니다.',
      '검증할 시나리오를 늘릴수록 QA 인원이 병목이 됩니다.',
    ],
  },
  steps: {
    title: '작동 원리',
    items: [
      {
        index: '01',
        title: 'SDK를 게임에 연결합니다',
        body: 'Unity 프로젝트에 패키지를 추가하고 연결 키를 입력하면 됩니다. 이후 SDK가 게임 화면의 상태를 계속 전달합니다.',
        state: 'shipped',
      },
      {
        index: '02',
        title: '에이전트가 직접 플레이합니다',
        body: '에이전트가 보고된 씬 상태를 읽고 다음 행동을 정한 뒤, 키보드·마우스 입력을 게임에 주입해 시나리오를 진행합니다.',
        state: 'shipped',
      },
      {
        index: '03',
        title: '증거가 남습니다',
        body: '액션 결과와 실행 로그가 타임라인으로 쌓이고, 실패한 순간의 상태가 이슈에 함께 붙습니다.',
        state: 'planned',
      },
    ],
  },
  features: {
    title: '무엇을 하나요',
    items: [
      {
        title: '입력 주입',
        body: '키보드·마우스 입력을 실제 플레이와 같은 경로로 게임에 전달합니다.',
        state: 'shipped',
      },
      {
        title: '화면 상태 인식',
        body: '지금 화면에 무엇이 있는지 읽어 다음 행동을 판단합니다.',
        state: 'shipped',
      },
      {
        title: '시나리오 자동 생성',
        body: '기획서를 올리면 게임 컨텍스트를 추출해 테스트 시나리오 초안을 만듭니다.',
        state: 'planned',
      },
      {
        title: '이슈 증거',
        body: '실패 지점의 상태, 로그, 직전 액션을 하나의 이슈로 묶습니다.',
        state: 'planned',
      },
      {
        title: '테스트 런 구성',
        body: '확정한 시나리오를 조합해 빌드마다 같은 세트를 실행합니다.',
        state: 'planned',
      },
    ],
  },
  requirements: {
    title: '필요한 것',
    items: [
      'Unity 프로젝트에 패키지를 추가할 수 있는 권한이 필요합니다. 게임 로직은 수정하지 않습니다.',
      '게임에서 서버로 나가는 네트워크 연결이 허용되어야 합니다.',
      '발급받은 연결 키 하나면 설정이 끝납니다.',
    ],
  },
  cta: {
    title: '직접 연결해 보고 판단해 보세요',
    body: 'SDK 연결까지는 문서만으로 끝납니다. 문의는 그다음에 주셔도 됩니다.',
  },
  faq: {
    title: '자주 묻는 질문',
    items: [
      {
        q: '게임 소스가 필요한가요?',
        a: 'SDK 패키지를 프로젝트에 추가해야 하므로 빌드 파이프라인 접근은 필요합니다. 게임 로직을 수정하지는 않습니다.',
      },
      {
        q: '어떤 게임에 쓸 수 있나요?',
        a: '씬 상태를 읽고 입력으로 조작할 수 있는 Unity 게임이면 됩니다. 현재는 단일 플레이 흐름을 먼저 검증하고 있습니다.',
      },
      {
        q: '데이터는 어디에 저장되나요?',
        a: '실행 로그와 증거는 ARTEL 서버에 저장됩니다. 직접 설치(자체 호스팅)는 명령 한 줄로 실행하는 방식으로 준비 중이며, 이미지가 공개되기 전까지는 개발 예정입니다. 설치 방법은 직접 설치 페이지에 있습니다.',
      },
      {
        q: '지금 어디까지 동작하나요?',
        a: 'sdkId 발급, SDK WebSocket 연결, 씬 상태 보고, 액션 주입까지 동작합니다. 시나리오 생성과 QA 실행 화면은 개발 중입니다.',
      },
    ],
  },
  footer: { contact: '문의', repository: '저장소', language: '언어' },
  sdk: {
    title: '설치는 세 단계입니다',
    lead: 'Unity 프로젝트에 패키지를 추가하고, 프로젝트에 연결하고, 실행해서 확인하면 끝입니다.',
    steps: [
      {
        title: '패키지 추가',
        body: 'Unity Package Manager에서 Add package from git URL을 선택하고 아래 주소를 붙여 넣습니다.',
        code: 'https://github.com/project-artel/artel-sdk.git?path=/Packages/kr.artel.sdk',
      },
      {
        title: '프로젝트 연결',
        body: 'Unity 메뉴의 Tools → ARTEL 창에서 발급받은 연결 키를 입력합니다. 코드를 직접 작성할 필요는 없습니다.',
      },
      {
        title: '실행해서 확인',
        body: '게임을 실행하면 연결 상태가 창에 표시됩니다. 여기까지 오면 에이전트가 게임을 조작할 수 있습니다.',
      },
    ],
    helpTitle: '막히는 부분이 있나요',
    help: [
      '연결 키는 프로젝트 담당자에게 요청하시면 됩니다.',
      '사내 방화벽이 게임에서 나가는 연결을 막으면 연결 상태가 대기로 남습니다.',
      '지원 Unity 버전은 확정 중입니다. 사용하시는 버전을 알려주시면 확인해 드립니다.',
    ],
    contactCta: '문의하기',
    advancedTitle: '직접 코드로 연결하려면',
    advancedNote:
      'Unity 창 대신 코드로 붙이고 싶을 때만 필요합니다. 서버 주소와 배포 경로는 확정 전이라 중괄호 부분은 발급받은 값으로 바꿔 주세요.',
    advanced: [
      {
        label: '연결 키 발급',
        code: 'curl -X POST https://{서버 주소}/api/sdkId',
      },
      {
        label: '코드로 연결',
        code: `var config = new ArtelConfig {
    ServerAddress = "{서버 주소}",
    SdkId = "{발급받은 연결 키}",
};

ArtelSdk.Connect(config);`,
      },
    ],
    copy: '복사',
    copied: '복사했습니다',
  },
  how: {
    title: '작동 원리',
    lead: '에이전트가 게임을 플레이한다는 것이 어떤 구조로 성립하는지 정리했습니다.',
    componentsTitle: '구성 요소',
    components: [
      {
        name: 'Unity SDK',
        body: '게임에 연결됩니다. 씬 블록 구조를 스캔해 상태를 보고하고, 서버가 내린 액션을 실제 입력으로 주입합니다.',
      },
      {
        name: 'Agent 서버',
        body: '보고된 상태와 시나리오를 읽고 다음 행동을 정합니다. 검증 결과와 이슈를 세션 단위로 남깁니다.',
      },
      {
        name: 'Orchestration 서버',
        body: '프로젝트, 기획서, 게임 빌드, 시나리오, 테스트 런, QA 실행을 관리하고 에이전트에 필요한 도구 API를 제공합니다.',
      },
      {
        name: '대시보드',
        body: '실행을 리플레이로 되짚고 타임라인에서 액션과 증거를 확인합니다.',
      },
    ],
    flowTitle: '데이터 흐름',
    flowAlt:
      '게임 안의 SDK가 씬 상태를 Orchestration 서버로 보고하고, Agent 서버가 다음 액션을 정해 다시 SDK로 내려보내며, 실행 결과가 대시보드에 기록되는 흐름',
    flow: [
      'SDK가 씬 상태를 보고합니다.',
      'Agent 서버가 시나리오와 상태를 비교해 다음 액션을 정합니다.',
      'Orchestration 서버가 액션을 해당 게임 인스턴스로 전달합니다.',
      'SDK가 입력을 주입하고 결과를 되돌려 보냅니다.',
      '실행 로그와 이슈가 기록되고 대시보드에서 조회됩니다.',
    ],
    lifecycleTitle: 'QA 실행 수명주기',
    lifecycle: [
      {
        title: '기획서 업로드',
        body: '문서를 올리면 게임 컨텍스트를 추출해 시나리오의 근거로 사용합니다.',
        state: 'planned',
      },
      {
        title: '시나리오 생성과 승인',
        body: '대화와 캔버스로 시나리오를 다듬고 확정합니다.',
        state: 'planned',
      },
      {
        title: '테스트 런 구성',
        body: '확정한 시나리오를 조합해 실행 단위를 만듭니다.',
        state: 'planned',
      },
      {
        title: '게임 인스턴스 연결',
        body: '빌드를 등록하고 SDK가 연결된 인스턴스를 붙입니다.',
        state: 'shipped',
      },
      {
        title: 'QA 실행과 이슈 조회',
        body: '에이전트가 시나리오를 실행하고, 남긴 증거를 확인합니다.',
        state: 'planned',
      },
    ],
    contextTitle: '기획서는 어떻게 쓰이나요',
    contextBody:
      '업로드한 기획서에서 게임 규칙과 목표를 추출해 게임 컨텍스트로 저장합니다. 에이전트는 이 컨텍스트를 근거로 시나리오를 만들고, 실행 중에도 판단 근거로 참조합니다. 이 구간은 개발 예정입니다.',
  },
  selfHosting: {
    title: '명령 한 줄로 직접 설치합니다',
    lead: 'Docker가 있는 한 대의 컴퓨터에서 ARTEL 전체를 실행합니다. 이메일과 비밀번호로 로그인하고, 모든 모델 호출에 OpenRouter 키 하나를 씁니다.',
    statusNote:
      '이 페이지의 기능은 아직 모두 개발 예정입니다. 컨테이너 이미지가 공개되지 않았고, 이메일 로그인과 admin 기능은 아직 main에 merge되지 않았습니다. 아래 명령은 그 둘이 끝난 뒤에 동작합니다.',
    deployReadmeLabel: 'deploy/README.md 전체 보기',
    licenseLabel: 'AGPL-3.0 라이선스 전문 (LICENSE)',
    sections: [
      {
        title: '무엇을 얻고 무엇이 필요한가요',
        state: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            text: 'PostgreSQL(pgvector), Valkey(Redis 호환 저장소), MinIO, orchestration 서버, agent 서버, artel-home, admin 페이지, 리버스 프록시가 한 번에 올라옵니다. 모두 하나의 주소로 제공되어 별도의 CORS 설정이 필요 없습니다.',
          },
          {
            kind: 'list',
            items: [
              'Docker와 Docker Compose 플러그인(docker compose)',
              '약 8 GB의 RAM',
              'OpenRouter 계정과 API 키',
            ],
          },
        ],
      },
      {
        title: '한 줄로 설치합니다',
        state: 'planned',
        blocks: [
          { kind: 'code', code: 'install' },
          {
            kind: 'paragraph',
            text: '옵션은 sh -s -- 뒤에 붙입니다. --dir은 설치 디렉터리(기본값 $HOME/artel), --tag는 이미지 태그(기본값 latest), --port는 호스트 포트(기본값 8088)입니다.',
          },
          { kind: 'code', code: 'installWithFlags' },
          {
            kind: 'paragraph',
            text: '스크립트는 docker와 docker compose를 확인하고, 무작위 비밀값이 든 .env를 만든 뒤 docker compose up -d를 실행합니다. 이미 있는 .env는 덮어쓰지 않으므로 다시 실행해도 안전합니다. 주의: Docker Compose는 셸에서 export한 변수를 .env보다 먼저 읽으므로, 셸이 OPENROUTER_API_KEY 같은 변수를 export하고 있으면 .env 값이 조용히 무시됩니다. docker compose up -d 전에 env | grep -E \'ARTEL|OPENROUTER|GITHUB|DB_\' 로 확인하세요. 끝나면 http://localhost:8088/ 을 엽니다.',
          },
        ],
      },
      {
        title: '첫 계정이 admin이 됩니다',
        state: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            text: '가장 먼저 가입한 계정이 admin이 됩니다. 그 뒤로는 가입이 닫혀 있고, 아래 값을 .env에 넣어야 누구나 가입할 수 있습니다.',
          },
          { kind: 'code', code: 'signupOpen' },
        ],
      },
      {
        title: 'OpenRouter 키를 넣습니다',
        state: 'planned',
        blocks: [
          { kind: 'paragraph', text: '방법은 두 가지입니다.' },
          {
            kind: 'list',
            items: [
              'admin 페이지(/admin/)의 Settings 탭에서 키를 입력합니다. 이 값이 환경 변수보다 우선합니다. 저장한 키는 ARTEL_SECRETS_KEY로 암호화되며 화면에는 뒷자리만 보입니다.',
              '.env에 OPENROUTER_API_KEY를 적고 docker compose up -d를 다시 실행합니다.',
            ],
          },
          { kind: 'code', code: 'openRouterEnvironment' },
        ],
      },
      {
        title: '키가 접근할 수 있어야 하는 모델',
        state: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            text: '채팅 모델 12개와 임베딩 모델 1개입니다. 마지막 줄이 임베딩 모델입니다.',
          },
          { kind: 'code', code: 'models' },
          {
            kind: 'paragraph',
            text: '최소 조건은 openai/gpt-5.6-luna와 임베딩 모델 openai/text-embedding-3-large입니다. Settings 탭의 Check models 버튼이 키로 어떤 모델에 접근할 수 있는지 확인해 줍니다. Bedrock은 필요하지 않습니다.',
          },
        ],
      },
      {
        title: '사용자를 관리합니다',
        state: 'planned',
        blocks: [
          {
            kind: 'list',
            items: [
              'admin이 admin 페이지에서 사용자를 만듭니다.',
              '임시 비밀번호는 무작위 문자열이며 만든 직후 한 번만 보입니다.',
              '사용자는 처음 로그인할 때 비밀번호를 바꿔야 하고, 바꾸기 전에는 다른 기능을 쓸 수 없습니다.',
            ],
          },
        ],
      },
      {
        title: 'Docker Compose 명령',
        state: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            text: '모두 deploy 디렉터리(install.sh로 설치했다면 설치 디렉터리)에서 실행합니다. 서비스 이름은 orchestration, agent-server, proxy, postgres, minio 등입니다. 오브젝트 스토리지(MinIO)는 같은 주소의 /<bucket>/ 경로로 제공되므로 추가 설정이 필요 없습니다. 버킷 이름(ARTEL_S3_BUCKET, 기본값 artel)은 proxy 경로인 api, oauth2, login, ws, admin, assets, projects, account와 같으면 안 되며 install.sh가 이를 확인합니다.',
          },
          { kind: 'code', code: 'compose' },
          { kind: 'paragraph', text: '업그레이드는 이미지를 받고 다시 올립니다. 데이터베이스 migration은 orchestration 서버가 시작할 때 실행됩니다.' },
          { kind: 'code', code: 'composeUpgrade' },
          { kind: 'paragraph', text: '저장소를 clone했다면 이미지를 직접 빌드할 수 있습니다. submodule을 받아 둔 상태여야 합니다.' },
          { kind: 'code', code: 'composeBuild' },
          { kind: 'paragraph', text: '데이터베이스 백업은 스택이 떠 있는 상태에서 SQL 덤프로 받습니다. ARTEL_SECRETS_KEY와 .env도 함께 보관하세요. 이 키가 없으면 저장한 OpenRouter 키를 읽을 수 없습니다.' },
          { kind: 'code', code: 'backup' },
        ],
      },
      {
        title: 'docker run으로 직접 실행합니다',
        state: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            text: 'compose 없이 같은 스택을 띄우는 명령입니다. deploy/README.md의 내용을 그대로 옮겼고, 비밀값은 직접 만든 값으로 바꾸세요. 마지막 proxy 명령은 deploy 디렉터리에서 실행해야 ./Caddyfile을 찾습니다. 오브젝트 스토리지는 같은 주소로 제공되어 추가 설정이 필요 없습니다.',
          },
          { kind: 'code', code: 'dockerRun' },
        ],
      },
      {
        title: 'GitHub 로그인은 선택입니다',
        state: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            text: '.env에 GITHUB_CLIENT_ID와 GITHUB_CLIENT_SECRET을 모두 넣으면 로그인 화면에 GitHub 버튼이 나타납니다. 둘 중 하나라도 비어 있으면 버튼이 숨겨집니다. GitHub OAuth app의 callback URL은 <ARTEL_PUBLIC_URL>/login/oauth2/code/github 입니다. ARTEL_GITHUB_SIGNUP_OPEN이 false(기본값)이면, GitHub 계정은 admin이 같은 이메일로 사용자를 이미 만들어 둔 경우에만 로그인할 수 있습니다.',
          },
          { kind: 'code', code: 'githubEnvironment' },
        ],
      },
      {
        title: '알려진 제한',
        blocks: [
          {
            kind: 'paragraph',
            text: '실시간 게임 화면은 상대 경로 WebSocket 주소를 해석하는 브라우저가 필요합니다. Chrome 125 이상, 최신 Firefox와 Safari에서 동작합니다.',
          },
        ],
      },
      {
        title: '라이선스',
        blocks: [
          {
            kind: 'paragraph',
            text: 'ARTEL은 AGPL-3.0으로 공개됩니다. 변경하지 않은 GNU 전문이 저장소의 LICENSE 파일에 있습니다.',
          },
        ],
      },
    ],
  },
  notFound: {
    title: '페이지를 찾을 수 없습니다',
    body: '주소를 다시 확인해 주세요.',
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
    selfHosting: 'Self-hosting',
    how: 'How it works',
    skipToContent: 'Skip to content',
    home: 'Home',
  },
  theme: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
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
        title: 'Connect the SDK',
        body: 'Add the package to your Unity project and enter a connection key. From there the SDK keeps reporting what is happening on screen.',
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
        title: 'On-screen state',
        body: 'What is on screen right now is read continuously to decide the next move.',
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
        a: 'Run logs and evidence are stored on ARTEL servers. Self-hosting with one command is in preparation and stays planned until the container images are published. The steps are on the self-hosting page.',
      },
      {
        q: 'What works today?',
        a: 'sdkId issuance, the SDK WebSocket connection, scene state reporting, and action injection. Scenario generation and the QA run screens are still in development.',
      },
    ],
  },
  footer: { contact: 'Contact', repository: 'Repository', language: 'Language' },
  sdk: {
    title: 'Three steps to install',
    lead: 'Add the package to your Unity project, connect it, and press play. That is the whole setup.',
    steps: [
      {
        title: 'Add the package',
        body: 'In Unity Package Manager choose Add package from git URL and paste the address below.',
        code: 'https://github.com/project-artel/artel-sdk.git?path=/Packages/kr.artel.sdk',
      },
      {
        title: 'Connect the project',
        body: 'Open Tools → ARTEL in the Unity menu and enter your connection key. No code required.',
      },
      {
        title: 'Press play',
        body: 'The window shows the connection status while the game runs. Once it connects, an agent can drive the game.',
      },
    ],
    helpTitle: 'Stuck somewhere?',
    help: [
      'Ask your project owner for a connection key.',
      'If a corporate firewall blocks outbound connections from the game, the status stays pending.',
      'Supported Unity versions are still being confirmed — tell us yours and we will check.',
    ],
    contactCta: 'Contact us',
    advancedTitle: 'Prefer to wire it up in code?',
    advancedNote:
      'Only needed if you skip the Unity window. The server address and distribution path are not final, so replace anything in braces with the values you were issued.',
    advanced: [
      {
        label: 'Issue a connection key',
        code: 'curl -X POST https://{server}/api/sdkId',
      },
      {
        label: 'Connect in code',
        code: `var config = new ArtelConfig {
    ServerAddress = "{server}",
    SdkId = "{issued connection key}",
};

ArtelSdk.Connect(config);`,
      },
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
  selfHosting: {
    title: 'Self-host with one command',
    lead: 'Run all of ARTEL on one machine that has Docker. Sign in with an email and a password, and use a single OpenRouter key for every model call.',
    statusNote:
      'Everything on this page is still planned. The container images are not published, and the email login and admin features are not merged into main yet. The commands below work once both are done.',
    deployReadmeLabel: 'Read the full deploy/README.md',
    licenseLabel: 'AGPL-3.0 license text (LICENSE)',
    sections: [
      {
        title: 'What you get and what you need',
        state: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            text: 'One command starts PostgreSQL (pgvector), Valkey (the Redis-compatible store), MinIO, the orchestration server, the agent server, artel-home, the admin page and a reverse proxy. All of them are served on one address, so no CORS setup is needed.',
          },
          {
            kind: 'list',
            items: [
              'Docker with the Compose plugin (docker compose)',
              'About 8 GB of RAM',
              'An OpenRouter account and API key',
            ],
          },
        ],
      },
      {
        title: 'Install with one line',
        state: 'planned',
        blocks: [
          { kind: 'code', code: 'install' },
          {
            kind: 'paragraph',
            text: 'Flags go after sh -s --. --dir is the install directory (default $HOME/artel), --tag is the image tag (default latest), and --port is the host port (default 8088).',
          },
          { kind: 'code', code: 'installWithFlags' },
          {
            kind: 'paragraph',
            text: 'The script checks docker and docker compose, writes a .env with random secrets, and runs docker compose up -d. An existing .env is never overwritten, so running it again is safe. Warning: Docker Compose reads variables exported in your shell before it reads .env, so if your shell exports OPENROUTER_API_KEY or any other variable listed in .env, the exported value silently wins. Run env | grep -E \'ARTEL|OPENROUTER|GITHUB|DB_\' before docker compose up -d to check. When it finishes, open http://localhost:8088/.',
          },
        ],
      },
      {
        title: 'The first account becomes the admin',
        state: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            text: 'The first account to sign up becomes the admin. After that, signup is closed. To let anyone sign up, put this in .env:',
          },
          { kind: 'code', code: 'signupOpen' },
        ],
      },
      {
        title: 'Set the OpenRouter key',
        state: 'planned',
        blocks: [
          { kind: 'paragraph', text: 'There are two ways.' },
          {
            kind: 'list',
            items: [
              'Enter the key in the Settings tab of the admin page at /admin/. This value wins over the environment variable. The stored key is encrypted with ARTEL_SECRETS_KEY, and only its last characters are ever shown.',
              'Set OPENROUTER_API_KEY in .env and run docker compose up -d again.',
            ],
          },
          { kind: 'code', code: 'openRouterEnvironment' },
        ],
      },
      {
        title: 'Models the key must reach',
        state: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            text: 'Twelve chat models and one embedding model. The last line is the embedding model.',
          },
          { kind: 'code', code: 'models' },
          {
            kind: 'paragraph',
            text: 'The minimum is openai/gpt-5.6-luna plus the embedding model openai/text-embedding-3-large. The Settings tab has a Check models button that asks OpenRouter which of these the key reaches. Bedrock is not needed.',
          },
        ],
      },
      {
        title: 'Manage users',
        state: 'planned',
        blocks: [
          {
            kind: 'list',
            items: [
              'The admin creates a user in the admin page.',
              'The temporary password is a random string, shown once right after the user is created.',
              'The user must change it at first sign in, and cannot use anything else until they do.',
            ],
          },
        ],
      },
      {
        title: 'Docker Compose commands',
        state: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            text: 'Run these from the deploy directory (the install directory if you used install.sh). Service names include orchestration, agent-server, proxy, postgres and minio. Object storage (MinIO) is served on the same address under /<bucket>/, so it needs no extra setup. The bucket name (ARTEL_S3_BUCKET, default artel) must not equal a proxy route: api, oauth2, login, ws, admin, assets, projects or account. install.sh checks this.',
          },
          { kind: 'code', code: 'compose' },
          { kind: 'paragraph', text: 'To upgrade, pull the images and start again. Database migrations run when the orchestration server starts.' },
          { kind: 'code', code: 'composeUpgrade' },
          { kind: 'paragraph', text: 'From a clone of the repository you can build the images yourself. The submodules must be checked out.' },
          { kind: 'code', code: 'composeBuild' },
          { kind: 'paragraph', text: 'Back up the database as an SQL dump while the stack is running. Keep ARTEL_SECRETS_KEY and .env too: without that key a stored OpenRouter key cannot be read.' },
          { kind: 'code', code: 'backup' },
        ],
      },
      {
        title: 'Run with plain docker run',
        state: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            text: 'The same stack without Compose. This is copied from deploy/README.md as written; replace the secrets with your own. Run the last proxy command from the deploy directory so ./Caddyfile exists. Object storage is served on the same address and needs no extra setup.',
          },
          { kind: 'code', code: 'dockerRun' },
        ],
      },
      {
        title: 'GitHub login is optional',
        state: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            text: 'Set both GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env and the GitHub button appears on the sign-in page. If either is blank, the button is hidden. The callback URL of the GitHub OAuth app is <ARTEL_PUBLIC_URL>/login/oauth2/code/github. With ARTEL_GITHUB_SIGNUP_OPEN=false (the default), a GitHub account signs in only when an admin already created a user with the same email.',
          },
          { kind: 'code', code: 'githubEnvironment' },
        ],
      },
      {
        title: 'Known limits',
        blocks: [
          {
            kind: 'paragraph',
            text: 'The live game view needs a browser that resolves relative WebSocket URLs: Chrome 125 or newer, and current Firefox and Safari.',
          },
        ],
      },
      {
        title: 'License',
        blocks: [
          {
            kind: 'paragraph',
            text: 'ARTEL is released under AGPL-3.0. The unmodified GNU text is in the LICENSE file of the repository.',
          },
        ],
      },
    ],
  },
  notFound: {
    title: 'No such page',
    body: 'Check the address.',
    back: 'Back home',
  },
}

export const messages: Record<Locale, Copy> = { ko, en }
