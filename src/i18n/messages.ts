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
  | 'composeFile'
  | 'generateSecret'
  | 'composeUp'
  | 'composeLogs'
  | 'composeUpgrade'
  | 'backup'
  | 'restore'
  | 'composeDown'
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
    title: 'ARTEL | 에이전트가 플레이하는 게임 QA',
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
    status: '개발 중입니다. 지금은 SDK 연결과 입력 주입까지 동작합니다.',
    title: '에이전트가 플레이하는 게임 QA 도구',
    subtitle:
      'Unity 프로젝트에 ARTEL SDK를 추가하면 에이전트가 씬 상태를 읽고, 키보드와 마우스 입력을 게임에 보내 테스트 시나리오를 진행합니다.',
    primaryCta: 'SDK 다운로드',
    secondaryCta: '설치 문서 보기',
  },
  problem: {
    title: '해결하려는 문제',
    items: [
      '빌드가 나올 때마다 같은 회귀 테스트를 사람이 처음부터 다시 진행해야 합니다.',
      '재현 절차가 글로만 남아 있어서, 닫았던 이슈가 다시 열리는 경우가 생깁니다.',
      '검증할 시나리오가 늘어날수록 QA 인력이 부족해집니다.',
    ],
  },
  steps: {
    title: '사용 흐름',
    items: [
      {
        index: '01',
        title: 'SDK 연결',
        body: 'Unity 프로젝트에 패키지를 추가하고 연결 키를 입력합니다. 게임이 실행되는 동안 SDK가 화면 상태를 서버로 보냅니다.',
        state: 'shipped',
      },
      {
        index: '02',
        title: '에이전트 플레이',
        body: '에이전트가 씬 상태를 읽고 다음 행동을 정한 뒤, 키보드와 마우스 입력을 게임에 보내 시나리오를 진행합니다.',
        state: 'shipped',
      },
      {
        index: '03',
        title: '실행 기록',
        body: '액션 결과와 실행 로그를 타임라인에 기록하고, 실패한 시점의 상태를 이슈에 첨부합니다.',
        state: 'planned',
      },
    ],
  },
  features: {
    title: '기능',
    items: [
      {
        title: '입력 주입',
        body: '키보드와 마우스 입력을 플레이어가 조작할 때와 같은 경로로 게임에 전달합니다.',
        state: 'shipped',
      },
      {
        title: '화면 상태 인식',
        body: '현재 화면에 무엇이 있는지 읽어서 다음 행동을 정합니다.',
        state: 'shipped',
      },
      {
        title: '시나리오 자동 생성',
        body: '기획서를 올리면 게임 규칙과 목표를 추출해서 테스트 시나리오 초안을 만듭니다.',
        state: 'planned',
      },
      {
        title: '이슈 증거',
        body: '실패한 시점의 상태, 로그, 직전 액션을 이슈 하나에 모읍니다.',
        state: 'planned',
      },
      {
        title: '테스트 런 구성',
        body: '확정한 시나리오를 묶어서 빌드마다 같은 세트로 실행합니다.',
        state: 'planned',
      },
    ],
  },
  requirements: {
    title: '준비 사항',
    items: [
      'Unity 프로젝트에 패키지를 추가할 수 있어야 합니다. 게임 로직은 수정하지 않습니다.',
      '게임에서 ARTEL 서버로 나가는 네트워크 연결이 허용되어야 합니다.',
      '프로젝트에서 발급한 연결 키가 필요합니다.',
    ],
  },
  cta: {
    title: 'SDK 설치 안내',
    body: 'SDK 연결은 설치 문서를 보면서 진행할 수 있습니다. 궁금한 점이 있으면 문의해 주세요.',
  },
  faq: {
    title: '자주 묻는 질문',
    items: [
      {
        q: '게임 소스가 필요한가요?',
        a: 'SDK 패키지를 프로젝트에 추가해야 하므로 프로젝트와 빌드 파이프라인에 접근할 수 있어야 합니다. 게임 로직은 수정하지 않습니다.',
      },
      {
        q: '어떤 게임에 쓸 수 있나요?',
        a: '씬 상태를 읽을 수 있고 입력으로 조작할 수 있는 Unity 게임이 대상입니다. 지금은 싱글 플레이 흐름부터 검증하고 있습니다.',
      },
      {
        q: '데이터는 어디에 저장되나요?',
        a: '실행 로그와 증거는 ARTEL 서버에 저장됩니다. 직접 설치하면 내 컴퓨터에 저장됩니다.',
      },
      {
        q: '지금 어디까지 동작하나요?',
        a: 'sdkId 발급, SDK WebSocket 연결, 씬 상태 보고, 액션 주입이 동작합니다. 시나리오 생성과 QA 실행 화면은 아직 개발하고 있습니다.',
      },
    ],
  },
  footer: { contact: '문의', repository: '저장소', language: '언어' },
  sdk: {
    title: 'Unity SDK 설치',
    lead: 'Unity Package Manager로 패키지를 추가한 뒤 연결 키를 입력하고, 게임을 실행해서 연결 상태를 확인합니다.',
    steps: [
      {
        title: '패키지 추가',
        body: 'Unity Package Manager에서 Add package from git URL을 선택하고 아래 주소를 붙여 넣습니다.',
        code: 'https://github.com/project-artel/artel-sdk.git?path=/Packages/kr.artel.sdk',
      },
      {
        title: '프로젝트 연결',
        body: 'Unity 메뉴에서 Tools → ARTEL 창을 열고 발급받은 연결 키를 입력합니다. 별도로 코드를 작성하지 않아도 됩니다.',
      },
      {
        title: '연결 확인',
        body: '게임을 실행하면 ARTEL 창에 연결 상태가 표시됩니다. 연결된 뒤에는 에이전트가 게임을 조작할 수 있습니다.',
      },
    ],
    helpTitle: '문제 해결',
    help: [
      '연결 키는 프로젝트 담당자에게 요청해 주세요.',
      '사내 방화벽이 게임에서 나가는 연결을 막고 있으면 연결 상태가 대기로 남습니다.',
      '지원하는 Unity 버전은 아직 확정하지 않았습니다. 사용 중인 버전을 알려 주시면 확인해 드리겠습니다.',
    ],
    contactCta: '문의하기',
    advancedTitle: '코드로 연결하기',
    advancedNote:
      'Unity 창을 쓰지 않고 코드에서 연결할 때 필요한 내용입니다. 서버 주소와 배포 경로가 아직 확정되지 않았으므로, 중괄호 부분은 발급받은 값으로 바꿔서 사용해 주세요.',
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
    lead: '에이전트가 게임을 플레이할 때 각 구성 요소가 맡는 역할을 정리했습니다.',
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
    contextTitle: '기획서 활용 방식',
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
      ],
    },
    afterInstall: [
      {
        title: '첫 계정은 admin',
        blocks: [
          {
            kind: 'paragraph',
            text: 'http://localhost:8088/ 에서 가장 먼저 가입한 계정이 admin 입니다. 이후 가입은 닫히며, 다시 열려면 docker-compose.yml 의 orchestration 서비스에서 아래 줄을 바꾸고 docker compose up -d 를 다시 실행합니다. admin 페이지는 별도 주소(x-admin-url, 기본값 http://localhost:8090)이고, 같은 호스트 이름이면 한 번 로그인으로 둘 다 쓸 수 있습니다.',
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
              'admin 주소(x-admin-url)의 Settings 탭에 입력합니다. 이 값이 우선합니다.',
              '또는 docker-compose.yml 맨 위 x-openrouter-api-key 에 적고 docker compose up -d 를 다시 실행합니다.',
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
            text: '최소 조건은 openai/gpt-6-luna 와 openai/text-embedding-3-large 입니다. Settings 페이지의 Check models 버튼은 항상 현재 필요한 목록을 보여 줍니다. Bedrock 은 필요 없습니다.',
          },
        ],
      },
      {
        title: '사용자 관리',
        blocks: [
          {
            kind: 'list',
            items: [
              'admin 이 admin 주소의 페이지에서 사용자를 만듭니다.',
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
            text: '두 값을 모두 넣으면 로그인 화면에 GitHub 버튼이 보이고, 하나라도 비면 숨겨집니다. callback URL 은 <x-public-url>/login/oauth2/code/github 입니다.',
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
                                    '--port 호스트 포트 (기본값 8088). 새 파일의 공개 주소와 published port 에 적히며 admin 페이지는 8090 그대로입니다.',
                  '--no-start 파일만 쓰고 시작하지 않음',
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
                text: 'docker-compose.yml 하나를 내려받아 맨 위의 CHANGE_ME 를 무작위 비밀값으로 바꾸고 docker compose up -d 를 실행합니다. 기존 docker-compose.yml 은 덮어쓰지 않으므로 다시 실행하면 pull 과 재시작만 합니다. 이 파일에는 비밀값이 들어 있으니 commit 하거나 공유하지 말고 백업하세요. x-secrets-key 를 잃으면 저장한 OpenRouter 키를 읽을 수 없습니다.',
              },
            ],
          },
          {
            title: '시작 후',
            blocks: [
              {
                kind: 'paragraph',
                text: 'http://localhost:8088/ 과 admin 주소 http://localhost:8090 을 엽니다. 스크립트가 끝에 두 주소를 출력합니다.',
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
            title: '필요한 것',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Docker Compose 2.23.1 이상.',
              },
            ],
          },
          {
            title: 'docker-compose.yml',
            blocks: [
              {
                kind: 'paragraph',
                text: '빈 디렉터리에 이 파일 하나를 docker-compose.yml 로 저장합니다.',
              },
              {
                kind: 'code',
                code: 'composeFile',
              },
            ],
          },
          {
            title: '맨 위 설정',
            blocks: [
              {
                kind: 'paragraph',
                text: 'x- 로 시작하는 맨 위 블록의 CHANGE_ME 를 모두 바꿉니다. 값마다 아래 명령의 결과를 넣습니다.',
              },
              {
                kind: 'code',
                code: 'generateSecret',
              },
              {
                kind: 'paragraph',
                text: 'x-public-url 과 x-admin-url 은 실제 호스트 이름으로 제공할 때만 바꾸며 같은 호스트 이름을 씁니다. 포트나 호스트 이름을 바꾸려면 두 URL, proxy 의 ports, configs 안의 사이트 주소(:80, :8090)를 함께 고칩니다.',
              },
              {
                kind: 'paragraph',
                text: '이 파일에는 이제 비밀값이 들어 있으니 commit 하거나 공유하지 말고 백업하세요. x-secrets-key 는 첫 시작 뒤에 바꾸지 않습니다. 잃으면 저장한 OpenRouter 키를 읽을 수 없습니다.',
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
                text: '파일을 고친 뒤에는 같은 명령을 다시 실행합니다.',
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
                text: '이미지는 develop 과 main branch 를 따라가므로 업그레이드하면 그 시점의 내용으로 바뀝니다. 고친 docker-compose.yml 은 그대로 유지됩니다. migration 은 orchestration 서버가 시작할 때 실행됩니다.',
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
                text: 'artel_minio-data 볼륨(업로드 문서, screen capture)과 docker-compose.yml 도 함께 보관하세요.',
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
    title: 'ARTEL | Game QA played by an agent',
    description:
      'Add the SDK to your Unity game and an agent plays it, runs test scenarios, and records evidence when a step fails.',
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
    status: 'In development. SDK connection and input injection work today.',
    title: 'A game QA tool where an agent plays the game',
    subtitle:
      'Add the ARTEL SDK to your Unity project and an agent reads the scene state and sends keyboard and mouse input to the game to run test scenarios.',
    primaryCta: 'Download SDK',
    secondaryCta: 'Read install guide',
  },
  problem: {
    title: 'The problem',
    items: [
      'Every new build means a person runs the same regression tests again from the start.',
      'Reproduction steps are kept only as text, so closed issues sometimes reopen.',
      'As the number of scenarios grows, there are not enough QA staff to cover them.',
    ],
  },
  steps: {
    title: 'Workflow',
    items: [
      {
        index: '01',
        title: 'SDK connection',
        body: 'Add the package to your Unity project and enter a connection key. While the game runs, the SDK sends the screen state to the server.',
        state: 'shipped',
      },
      {
        index: '02',
        title: 'Agent play',
        body: 'The agent reads the scene state, decides the next action, and sends keyboard and mouse input to the game to advance the scenario.',
        state: 'shipped',
      },
      {
        index: '03',
        title: 'Run record',
        body: 'Action results and run logs are recorded on a timeline, and the state at the failure point is attached to an issue.',
        state: 'planned',
      },
    ],
  },
  features: {
    title: 'Features',
    items: [
      {
        title: 'Input injection',
        body: 'Keyboard and mouse input reaches the game through the same path a player uses.',
        state: 'shipped',
      },
      {
        title: 'On-screen state',
        body: 'Reads what is on screen to decide the next action.',
        state: 'shipped',
      },
      {
        title: 'Scenario generation',
        body: 'Extracts rules and goals from an uploaded design document and drafts test scenarios from them.',
        state: 'planned',
      },
      {
        title: 'Issue evidence',
        body: 'Collects the state, logs, and preceding action at the failure point into one issue.',
        state: 'planned',
      },
      {
        title: 'Test run composition',
        body: 'Groups approved scenarios so every build runs the same set.',
        state: 'planned',
      },
    ],
  },
  requirements: {
    title: 'Requirements',
    items: [
      'Permission to add a package to the Unity project. Game logic is not modified.',
      'Outbound network connections from the game to the ARTEL server must be allowed.',
      'A connection key issued for the project.',
    ],
  },
  cta: {
    title: 'Installing the SDK',
    body: 'You can connect the SDK by following the install guide. Contact us if you have questions.',
  },
  faq: {
    title: 'Questions',
    items: [
      {
        q: 'Do you need our source code?',
        a: 'You add a package to the project, so you need access to the project and its build pipeline. Game logic is not modified.',
      },
      {
        q: 'Which games does it work with?',
        a: 'Unity games whose scene state can be read and controlled through input. We are validating single-player flows first.',
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
    title: 'Install the Unity SDK',
    lead: 'Add the package with Unity Package Manager, enter your connection key, and run the game to check the connection.',
    steps: [
      {
        title: 'Add the package',
        body: 'In Unity Package Manager choose Add package from git URL and paste the address below.',
        code: 'https://github.com/project-artel/artel-sdk.git?path=/Packages/kr.artel.sdk',
      },
      {
        title: 'Connect the project',
        body: 'Open Tools → ARTEL in the Unity menu and enter the connection key you were issued. You do not need to write code.',
      },
      {
        title: 'Check the connection',
        body: 'When the game runs, the ARTEL window shows the connection status. After it connects, an agent can control the game.',
      },
    ],
    helpTitle: 'Troubleshooting',
    help: [
      'Ask your project owner for a connection key.',
      'If a corporate firewall blocks outbound connections from the game, the status stays pending.',
      'Supported Unity versions are not confirmed yet. Tell us which version you use and we will check it.',
    ],
    contactCta: 'Contact us',
    advancedTitle: 'Connecting in code',
    advancedNote:
      'Use this only if you connect from code instead of the Unity window. The server address and distribution path are not final, so replace anything in braces with the values you were issued.',
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
    lead: 'What each component does while an agent plays the game.',
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
        body: 'Refine scenarios through chat and the canvas, then approve them.',
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
      ],
    },
    afterInstall: [
      {
        title: 'The first account is the admin',
        blocks: [
          {
            kind: 'paragraph',
            text: 'The first account to sign up at http://localhost:8088/ is the admin. Signup is then closed. To reopen it, change this line in the orchestration service of docker-compose.yml and run docker compose up -d again. The admin page has its own address (x-admin-url, default http://localhost:8090); on the same host name one sign-in covers both.',
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
              'Enter it in the Settings tab at the admin address (x-admin-url). This value wins.',
              'Or set x-openrouter-api-key at the top of docker-compose.yml and run docker compose up -d again.',
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
            text: 'The minimum is openai/gpt-6-luna and openai/text-embedding-3-large. The Check models button on the Settings page always shows the current required list. Bedrock is not needed.',
          },
        ],
      },
      {
        title: 'User management',
        blocks: [
          {
            kind: 'list',
            items: [
              'The admin creates users on the admin address.',
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
            text: 'Set both values and the sign-in page shows a GitHub button; if either is blank it is hidden. The callback URL is <x-public-url>/login/oauth2/code/github.',
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
                                    '--port host port (default 8088). Written into the public URL and published port of a new file; the admin page stays on 8090.',
                  '--no-start write the file and do not start',
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
                text: 'It downloads one docker-compose.yml, replaces the CHANGE_ME values at its top with random secrets, and runs docker compose up -d. An existing docker-compose.yml is never overwritten, so running it again only pulls and restarts. The file now contains secrets: do not commit or share it, and back it up. Without x-secrets-key a stored OpenRouter key cannot be read.',
              },
            ],
          },
          {
            title: 'After it starts',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Open http://localhost:8088/ and the admin address http://localhost:8090. The script prints both at the end.',
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
            title: 'What you need',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Docker Compose 2.23.1 or later.',
              },
            ],
          },
          {
            title: 'docker-compose.yml',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Save this one file as docker-compose.yml in an empty directory.',
              },
              {
                kind: 'code',
                code: 'composeFile',
              },
            ],
          },
          {
            title: 'Settings at the top',
            blocks: [
              {
                kind: 'paragraph',
                text: 'In the block at the top (lines starting with x-), replace every CHANGE_ME. For each one, paste the result of this command.',
              },
              {
                kind: 'code',
                code: 'generateSecret',
              },
              {
                kind: 'paragraph',
                text: 'Change x-public-url and x-admin-url only when you serve from a real host name; both use the same host name. To change the port or host name, edit the two URLs, the ports of the proxy service and the site addresses inside configs (:80, :8090) together.',
              },
              {
                kind: 'paragraph',
                text: 'The file now contains secrets: do not commit or share it, and back it up. Never change x-secrets-key after the first start; without it a stored OpenRouter key cannot be read.',
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
                text: 'After editing the file, run the same command again.',
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
                text: 'The images follow the develop and main branches, so an upgrade moves to whatever they hold at that moment. Your edited docker-compose.yml is kept. Migrations run when the orchestration server starts.',
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
                text: 'Also keep the artel_minio-data volume (uploaded documents, screen captures) and docker-compose.yml.',
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
