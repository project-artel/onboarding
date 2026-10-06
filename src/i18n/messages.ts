import type { Locale } from './locale'
import type { SelfHostingMethodId } from './selfHostingRoutes'

// 구현 상태는 카피에서 지운다고 사라지지 않는다. 배지로 명시해 두면 문구를
// 고치는 사람이 미구현 기능을 현재형으로 바꿔 쓰는 일을 막는다.
export type Availability = 'shipped' | 'planned'

// Keys of the commands and slug lists kept once in `pages/selfHostingCommands.ts`.
export type SelfHostingCodeKey =
  | 'install'
  | 'installWithFlags'
  | 'installAfter'
  | 'cloneRepository'
  | 'composeEnvFile'
  | 'generateSecret'
  | 'shellOverrideCheck'
  | 'composeUp'
  | 'composeLogs'
  | 'composeUpgrade'
  | 'composeBuild'
  | 'backup'
  | 'restore'
  | 'rawVolumeBackup'
  | 'composeDown'
  | 'dockerRun'
  | 'dockerCleanup'
  | 'signupOpen'
  | 'openRouterEnvironment'
  | 'models'
  | 'githubEnvironment'

export type SelfHostingBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'code'; code: SelfHostingCodeKey }

export type SelfHostingSection = { title: string; blocks: SelfHostingBlock[] }

export type SelfHostingMethodPage = {
  title: string
  chooseWhen: string
  steps: SelfHostingSection[]
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
    overview: { title: string; items: string[] }
    chooser: {
      title: string
      cards: { id: SelfHostingMethodId; name: string; audience: string; cta: string }[]
    }
    afterInstall: SelfHostingSection[]
    methods: Record<SelfHostingMethodId, SelfHostingMethodPage>
    method: { back: string; chooseWhenLabel: string; othersTitle: string }
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
        a: '실행 로그와 증거는 ARTEL 서버에 저장됩니다. 직접 설치하면 내 컴퓨터에 저장됩니다.',
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
    title: '직접 설치',
    lead: 'Docker 가 있는 한 대의 컴퓨터에서 ARTEL 전체를 실행합니다.',
    overview: {
      title: '필요한 것',
      items: ['Docker 와 docker compose 플러그인', 'RAM 약 8 GB', 'OpenRouter 계정'],
    },
    chooser: {
      title: '설치 방법 고르기',
      cards: [
        {
          id: 'install-script',
          name: '설치 스크립트',
          audience: '명령 한 줄로 설치합니다.',
          cta: '열기',
        },
        {
          id: 'docker-compose',
          name: 'Docker Compose',
          audience: '설정 파일을 직접 고치며 운영합니다.',
          cta: '열기',
        },
        {
          id: 'docker',
          name: 'docker run',
          audience: '컨테이너를 하나씩 직접 띄웁니다.',
          cta: '열기',
        },
      ],
    },
    afterInstall: [
      {
        title: '첫 계정은 admin',
        blocks: [
          {
            kind: 'paragraph',
            text: 'http://localhost:8088/ 에서 가장 먼저 가입한 계정이 admin 입니다. 이후 가입은 닫히며, 다시 열려면 .env 에 적습니다.',
          },
          {
            kind: 'code',
            code: 'signupOpen',
          },
        ],
      },
      {
        title: 'OpenRouter 키',
        blocks: [
          {
            kind: 'list',
            items: [
              '/admin/ 의 Settings 탭에 입력합니다. 이 값이 우선합니다.',
              '또는 .env 에 적고 docker compose up -d 를 다시 실행합니다.',
            ],
          },
          {
            kind: 'code',
            code: 'openRouterEnvironment',
          },
        ],
      },
      {
        title: '키가 접근해야 하는 모델',
        blocks: [
          {
            kind: 'paragraph',
            text: '채팅 모델 12개와 마지막 줄의 임베딩 모델입니다.',
          },
          {
            kind: 'code',
            code: 'models',
          },
          {
            kind: 'paragraph',
            text: '최소 조건은 openai/gpt-5.6-luna 와 openai/text-embedding-3-large 입니다. Settings 탭의 Check models 버튼으로 확인합니다. Bedrock 은 필요 없습니다.',
          },
        ],
      },
      {
        title: '사용자 관리',
        blocks: [
          {
            kind: 'list',
            items: [
              'admin 이 admin 페이지에서 사용자를 만듭니다.',
              '임시 비밀번호는 무작위 문자열이며 한 번만 보입니다.',
              '사용자는 첫 로그인에서 비밀번호를 바꿔야 합니다.',
            ],
          },
        ],
      },
      {
        title: 'GitHub 로그인 (선택)',
        blocks: [
          {
            kind: 'paragraph',
            text: '두 값을 모두 넣으면 로그인 화면에 GitHub 버튼이 보이고, 하나라도 비면 숨겨집니다. callback URL 은 <ARTEL_PUBLIC_URL>/login/oauth2/code/github 입니다.',
          },
          {
            kind: 'code',
            code: 'githubEnvironment',
          },
          {
            kind: 'paragraph',
            text: 'ARTEL_GITHUB_SIGNUP_OPEN=false (기본값) 이면 admin 이 같은 이메일로 만든 사용자만 GitHub 로 로그인합니다.',
          },
        ],
      },
      {
        title: '알려진 제한',
        blocks: [
          {
            kind: 'paragraph',
            text: '실시간 게임 화면은 상대 경로 WebSocket 주소를 해석하는 브라우저가 필요합니다. Chrome 125 이상, 최신 Firefox, 최신 Safari 입니다.',
          },
        ],
      },
    ],
    methods: {
      'install-script': {
        title: '설치 스크립트',
        chooseWhen: '명령 한 줄로 설치할 때 고릅니다.',
        steps: [
          {
            title: '실행',
            blocks: [
              {
                kind: 'code',
                code: 'install',
              },
            ],
          },
          {
            title: '옵션',
            blocks: [
              {
                kind: 'list',
                items: [
                  '--dir 설치 디렉터리 (기본값 $HOME/artel)',
                  '--tag 이미지 태그 (기본값 latest)',
                  '--port 호스트 포트 (기본값 8088)',
                  '--no-start 파일만 만들고 시작하지 않음',
                ],
              },
              {
                kind: 'code',
                code: 'installWithFlags',
              },
            ],
          },
          {
            title: '생성되는 것',
            blocks: [
              {
                kind: 'paragraph',
                text: '무작위 비밀값이 든 .env 를 만들고 docker compose up -d 를 실행합니다. 기존 .env 는 덮어쓰지 않으므로 다시 실행해도 안전합니다. .env 를 백업하세요. ARTEL_SECRETS_KEY 를 잃으면 저장한 OpenRouter 키를 읽을 수 없습니다.',
              },
            ],
          },
          {
            title: '시작 후',
            blocks: [
              {
                kind: 'paragraph',
                text: 'http://localhost:8088/ 을 엽니다.',
              },
              {
                kind: 'code',
                code: 'installAfter',
              },
            ],
          },
        ],
      },
      'docker-compose': {
        title: 'Docker Compose',
        chooseWhen: '설정 파일을 직접 고치며 운영할 때 고릅니다.',
        steps: [
          {
            title: '파일 받기',
            blocks: [
              {
                kind: 'paragraph',
                text: 'install.sh 를 쓰지 않으면 저장소를 clone 합니다.',
              },
              {
                kind: 'code',
                code: 'cloneRepository',
              },
            ],
          },
          {
            title: '.env 만들기',
            blocks: [
              {
                kind: 'paragraph',
                text: '__GENERATE_...__ 값을 모두 바꿉니다. 비밀값은 아래 명령으로 만듭니다.',
              },
              {
                kind: 'code',
                code: 'composeEnvFile',
              },
              {
                kind: 'code',
                code: 'generateSecret',
              },
            ],
          },
          {
            title: '.env 설정',
            blocks: [
              {
                kind: 'list',
                items: [
                  'ARTEL_PUBLIC_URL, ARTEL_SITE_ADDRESS, ARTEL_SECURE_COOKIE: 실제 호스트 이름으로 제공할 때 바꿉니다. ARTEL_SITE_ADDRESS 에 호스트 이름을 넣으면 Caddy 가 TLS 인증서를 받으며, 이때 ARTEL_PUBLIC_URL 은 https:// 로, ARTEL_SECURE_COOKIE 는 true 로 둡니다.',
                  'ARTEL_HTTP_PORT: 호스트 포트 (기본값 8088)',
                  'ARTEL_S3_BUCKET: 기본값 artel. api, oauth2, login, ws, admin, assets, projects, account 는 쓸 수 없습니다.',
                ],
              },
              {
                kind: 'paragraph',
                text: '셸에서 export 한 변수가 .env 보다 먼저 적용됩니다. 시작 전에 확인하세요.',
              },
              {
                kind: 'code',
                code: 'shellOverrideCheck',
              },
            ],
          },
          {
            title: '시작',
            blocks: [
              {
                kind: 'code',
                code: 'composeUp',
              },
              {
                kind: 'paragraph',
                text: '.env 를 고친 뒤에는 같은 명령을 다시 실행합니다.',
              },
            ],
          },
          {
            title: '로그',
            blocks: [
              {
                kind: 'paragraph',
                text: '서비스: orchestration, agent-server, proxy, postgres, minio.',
              },
              {
                kind: 'code',
                code: 'composeLogs',
              },
            ],
          },
          {
            title: '업그레이드',
            blocks: [
              {
                kind: 'code',
                code: 'composeUpgrade',
              },
              {
                kind: 'paragraph',
                text: 'migration 은 orchestration 서버가 시작할 때 실행됩니다.',
              },
            ],
          },
          {
            title: 'clone 에서 빌드',
            blocks: [
              {
                kind: 'code',
                code: 'composeBuild',
              },
            ],
          },
          {
            title: '백업과 복원',
            blocks: [
              {
                kind: 'code',
                code: 'backup',
              },
              {
                kind: 'paragraph',
                text: '복원은 빈 데이터베이스에 합니다.',
              },
              {
                kind: 'code',
                code: 'restore',
              },
              {
                kind: 'paragraph',
                text: '볼륨을 통째로 복사하려면 postgres 를 먼저 멈춥니다. artel_minio-data 볼륨(업로드 문서, screen capture)과 .env 도 함께 보관하세요.',
              },
              {
                kind: 'code',
                code: 'rawVolumeBackup',
              },
            ],
          },
          {
            title: '중지',
            blocks: [
              {
                kind: 'code',
                code: 'composeDown',
              },
              {
                kind: 'paragraph',
                text: '데이터 볼륨은 남습니다.',
              },
            ],
          },
        ],
      },
      docker: {
        title: 'docker run',
        chooseWhen: '컨테이너를 하나씩 직접 띄울 때 고릅니다.',
        steps: [
          {
            title: '실행',
            blocks: [
              {
                kind: 'paragraph',
                text: 'deploy 디렉터리에서 실행합니다. 마지막 proxy 컨테이너가 ./Caddyfile 을 읽습니다. 비밀값은 첫 줄에서 무작위로 만들어지며, orchestration 에 -p 를 붙이지 않는 것은 의도입니다. 8081 포트는 인증 없이 /internal/** 을 제공합니다.',
              },
              {
                kind: 'code',
                code: 'dockerRun',
              },
            ],
          },
          {
            title: '네트워크와 볼륨',
            blocks: [
              {
                kind: 'paragraph',
                text: '컨테이너 이름이 artel 네트워크의 호스트 이름입니다. 볼륨은 artel_postgres-data, artel_minio-data, artel_caddy-data, artel_caddy-config 입니다.',
              },
            ],
          },
          {
            title: '시작 후',
            blocks: [
              {
                kind: 'paragraph',
                text: 'http://localhost:8088/ 을 엽니다.',
              },
            ],
          },
          {
            title: '정리',
            blocks: [
              {
                kind: 'code',
                code: 'dockerCleanup',
              },
              {
                kind: 'paragraph',
                text: '볼륨과 네트워크는 남습니다.',
              },
            ],
          },
        ],
      },
    },
    method: {
      back: '← 직접 설치로 돌아가기',
      chooseWhenLabel: '이럴 때',
      othersTitle: '다른 설치 방법',
    },
    deployReadmeLabel: 'deploy/README.md',
    licenseLabel: 'LICENSE (AGPL-3.0)',
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
        a: 'Run logs and evidence are stored on ARTEL servers. If you self-host, they stay on your machine.',
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
    title: 'Self-hosting',
    lead: 'Run all of ARTEL on one machine that has Docker.',
    overview: {
      title: 'What you need',
      items: [
        'Docker with the Compose plugin',
        'About 8 GB of RAM',
        'An OpenRouter account',
      ],
    },
    chooser: {
      title: 'Choose a method',
      cards: [
        {
          id: 'install-script',
          name: 'Install script',
          audience: 'Install with one command.',
          cta: 'Open',
        },
        {
          id: 'docker-compose',
          name: 'Docker Compose',
          audience: 'Edit the settings and run it yourself.',
          cta: 'Open',
        },
        {
          id: 'docker',
          name: 'docker run',
          audience: 'Start each container yourself.',
          cta: 'Open',
        },
      ],
    },
    afterInstall: [
      {
        title: 'The first account is the admin',
        blocks: [
          {
            kind: 'paragraph',
            text: 'The first account to sign up at http://localhost:8088/ is the admin. Signup is then closed. To reopen it, set this in .env.',
          },
          {
            kind: 'code',
            code: 'signupOpen',
          },
        ],
      },
      {
        title: 'OpenRouter key',
        blocks: [
          {
            kind: 'list',
            items: [
              'Enter it in the Settings tab at /admin/. This value wins.',
              'Or set it in .env and run docker compose up -d again.',
            ],
          },
          {
            kind: 'code',
            code: 'openRouterEnvironment',
          },
        ],
      },
      {
        title: 'Models the key must reach',
        blocks: [
          {
            kind: 'paragraph',
            text: 'Twelve chat models, then the embedding model on the last line.',
          },
          {
            kind: 'code',
            code: 'models',
          },
          {
            kind: 'paragraph',
            text: 'The minimum is openai/gpt-5.6-luna and openai/text-embedding-3-large. The Check models button in the Settings tab verifies them. Bedrock is not needed.',
          },
        ],
      },
      {
        title: 'Manage users',
        blocks: [
          {
            kind: 'list',
            items: [
              'The admin creates users in the admin page.',
              'The temporary password is a random string, shown once.',
              'The user must change it at first sign in.',
            ],
          },
        ],
      },
      {
        title: 'GitHub login (optional)',
        blocks: [
          {
            kind: 'paragraph',
            text: 'Set both values and the sign-in page shows a GitHub button; if either is blank it is hidden. The callback URL is <ARTEL_PUBLIC_URL>/login/oauth2/code/github.',
          },
          {
            kind: 'code',
            code: 'githubEnvironment',
          },
          {
            kind: 'paragraph',
            text: 'With ARTEL_GITHUB_SIGNUP_OPEN=false (the default), a GitHub account signs in only when an admin already created a user with the same email.',
          },
        ],
      },
      {
        title: 'Known limits',
        blocks: [
          {
            kind: 'paragraph',
            text: 'The live game view needs a browser that resolves relative WebSocket URLs: Chrome 125 or newer, current Firefox, current Safari.',
          },
        ],
      },
    ],
    methods: {
      'install-script': {
        title: 'Install script',
        chooseWhen: 'Choose this to install with one command.',
        steps: [
          {
            title: 'Run',
            blocks: [
              {
                kind: 'code',
                code: 'install',
              },
            ],
          },
          {
            title: 'Flags',
            blocks: [
              {
                kind: 'list',
                items: [
                  '--dir install directory (default $HOME/artel)',
                  '--tag image tag (default latest)',
                  '--port host port (default 8088)',
                  '--no-start write the files and do not start',
                ],
              },
              {
                kind: 'code',
                code: 'installWithFlags',
              },
            ],
          },
          {
            title: 'What it creates',
            blocks: [
              {
                kind: 'paragraph',
                text: 'It writes a .env with random secrets and runs docker compose up -d. An existing .env is never overwritten, so running it again is safe. Back up .env: without ARTEL_SECRETS_KEY a stored OpenRouter key cannot be read.',
              },
            ],
          },
          {
            title: 'After it starts',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Open http://localhost:8088/.',
              },
              {
                kind: 'code',
                code: 'installAfter',
              },
            ],
          },
        ],
      },
      'docker-compose': {
        title: 'Docker Compose',
        chooseWhen: 'Choose this to manage the settings files yourself.',
        steps: [
          {
            title: 'Get the files',
            blocks: [
              {
                kind: 'paragraph',
                text: 'If you did not use install.sh, clone the repository.',
              },
              {
                kind: 'code',
                code: 'cloneRepository',
              },
            ],
          },
          {
            title: 'Create .env',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Replace every __GENERATE_...__ value. Make a secret with the second command.',
              },
              {
                kind: 'code',
                code: 'composeEnvFile',
              },
              {
                kind: 'code',
                code: 'generateSecret',
              },
            ],
          },
          {
            title: 'Edit .env',
            blocks: [
              {
                kind: 'list',
                items: [
                  'ARTEL_PUBLIC_URL, ARTEL_SITE_ADDRESS, ARTEL_SECURE_COOKIE: change them when you serve from a real host name. A host name in ARTEL_SITE_ADDRESS makes Caddy fetch a TLS certificate; then use https:// in ARTEL_PUBLIC_URL and set ARTEL_SECURE_COOKIE=true.',
                  'ARTEL_HTTP_PORT: host port (default 8088)',
                  'ARTEL_S3_BUCKET: default artel. It must not be api, oauth2, login, ws, admin, assets, projects or account.',
                ],
              },
              {
                kind: 'paragraph',
                text: 'Variables exported in your shell override .env. Check before you start.',
              },
              {
                kind: 'code',
                code: 'shellOverrideCheck',
              },
            ],
          },
          {
            title: 'Start',
            blocks: [
              {
                kind: 'code',
                code: 'composeUp',
              },
              {
                kind: 'paragraph',
                text: 'After editing .env, run the same command again.',
              },
            ],
          },
          {
            title: 'Logs',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Services: orchestration, agent-server, proxy, postgres, minio.',
              },
              {
                kind: 'code',
                code: 'composeLogs',
              },
            ],
          },
          {
            title: 'Upgrade',
            blocks: [
              {
                kind: 'code',
                code: 'composeUpgrade',
              },
              {
                kind: 'paragraph',
                text: 'Migrations run when the orchestration server starts.',
              },
            ],
          },
          {
            title: 'Build from a clone',
            blocks: [
              {
                kind: 'code',
                code: 'composeBuild',
              },
            ],
          },
          {
            title: 'Backup and restore',
            blocks: [
              {
                kind: 'code',
                code: 'backup',
              },
              {
                kind: 'paragraph',
                text: 'Restore into an empty database.',
              },
              {
                kind: 'code',
                code: 'restore',
              },
              {
                kind: 'paragraph',
                text: 'To copy the volume itself, stop postgres first. Also keep the artel_minio-data volume (uploaded documents, screen captures) and .env.',
              },
              {
                kind: 'code',
                code: 'rawVolumeBackup',
              },
            ],
          },
          {
            title: 'Stop',
            blocks: [
              {
                kind: 'code',
                code: 'composeDown',
              },
              {
                kind: 'paragraph',
                text: 'Data volumes stay.',
              },
            ],
          },
        ],
      },
      docker: {
        title: 'docker run',
        chooseWhen: 'Choose this to start each container yourself.',
        steps: [
          {
            title: 'Run',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Run from the deploy directory: the last proxy container reads ./Caddyfile. Secrets are generated at the top. orchestration has no -p on purpose: port 8081 serves /internal/** without authentication.',
              },
              {
                kind: 'code',
                code: 'dockerRun',
              },
            ],
          },
          {
            title: 'Network and volumes',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Container names are the host names on the artel network. Volumes: artel_postgres-data, artel_minio-data, artel_caddy-data, artel_caddy-config.',
              },
            ],
          },
          {
            title: 'After it starts',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Open http://localhost:8088/.',
              },
            ],
          },
          {
            title: 'Clean up',
            blocks: [
              {
                kind: 'code',
                code: 'dockerCleanup',
              },
              {
                kind: 'paragraph',
                text: 'Volumes and the network stay.',
              },
            ],
          },
        ],
      },
    },
    method: {
      back: '← Back to self-hosting',
      chooseWhenLabel: 'Choose this if',
      othersTitle: 'Other methods',
    },
    deployReadmeLabel: 'deploy/README.md',
    licenseLabel: 'LICENSE (AGPL-3.0)',
  },
  notFound: {
    title: 'No such page',
    body: 'Check the address.',
    back: 'Back home',
  },
}

export const messages: Record<Locale, Copy> = { ko, en }
