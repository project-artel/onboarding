import type { Locale } from './locale'
import type { SelfHostingMethodId } from './selfHostingRoutes'

// 구현 상태는 카피에서 지운다고 사라지지 않는다. 배지로 명시해 두면 문구를
// 고치는 사람이 미구현 기능을 현재형으로 바꿔 쓰는 일을 막는다.
export type Availability = 'shipped' | 'planned'

// Download page of the desktop app. Plain text, so `npm run check` can load this file without a bundler.
const desktopReleasesUrl = 'https://github.com/project-artel/artel-desktop/releases/latest'

// Keys of the commands and slug lists kept once in `pages/selfHostingCommands.ts`.
export type SelfHostingCodeKey =
  | 'install'
  | 'installWithFlags'
  | 'composeDownload'
  | 'generateSecret'
  | 'composeUp'
  | 'composeLogs'
  | 'composeUpgrade'
  | 'backup'
  | 'restore'
  | 'composeDown'

export type SelfHostingBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'code'; code: SelfHostingCodeKey }
  | { kind: 'link'; label: string; href: string }
  | { kind: 'composeFile'; show: string; copy: string }

export type SelfHostingSection = { title: string; blocks: SelfHostingBlock[] }

export type SelfHostingMethodPage = {
  title: string
  state?: Availability
  steps: SelfHostingSection[]
}

type Copy = {
  meta: { title: string; description: string }
  nav: {
    install: string
    installMenu: string
    sdk: string
    cli: string
    skills: string
    selfHosting: string
    how: string
    skipToContent: string
    home: string
  }
  theme: { toLight: string; toDark: string }
  availability: Record<Availability, string>
  hero: {
    status: string
    title: string
    primaryCta: string
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
  faq: { title: string; items: { q: string; a: string }[] }
  footer: { contact: string; repository: string; language: string }
  sdk: {
    title: string
    steps: { title: string; body: string; code?: string; shotAlts: string[] }[]
    helpTitle: string
    help: string[]
    contactCta: string
    advancedTitle: string
    advancedNote: string
    advanced: { label: string; code: string }[]
    copy: string
    copied: string
  }
  cli: {
    title: string
    lead: string
    steps: { title: string; body?: string; code?: string }[]
    notesTitle: string
    notes: string[]
    referenceCta: string
    agent: { title: string; body: string; prompt: string; instructionsCta: string }
  }
  skills: {
    title: string
    lead: string
    agent: { title: string; body: string; prompt: string; instructionsCta: string }
    install: { title: string; body: string; command: string; optionsNote: string }
    listTitle: string
    items: { name: string; body: string }[]
    repositoryCta: string
  }
  how: {
    title: string
    flowTitle: string
    flowAlt: string
    flow: string[]
    lifecycleTitle: string
    lifecycle: { title: string; body: string; state: Availability }[]
  }
  selfHosting: {
    title: string
    lead: string
    overview: { title: string; items: string[] }
    chooser: {
      title: string
      cards: { id: SelfHostingMethodId; name: string; audience: string; cta: string; state?: Availability }[]
    }
    afterInstall: SelfHostingSection[]
    methods: Record<SelfHostingMethodId, SelfHostingMethodPage>
    method: { back: string; othersTitle: string }
    remoteFile: { loading: string; failed: string; openOnGitHub: string }
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
    install: '설치',
    installMenu: '설치 방법',
    sdk: 'SDK',
    cli: 'CLI',
    skills: 'Skill',
    selfHosting: '직접 설치',
    how: '작동 원리',
    skipToContent: '본문으로 건너뛰기',
    home: '홈',
  },
  theme: { toLight: '라이트 모드로 전환', toDark: '다크 모드로 전환' },
  availability: { shipped: '동작 중', planned: '개발 예정' },
  hero: {
    status: '개발 중',
    title: '에이전트가 플레이하는 게임 QA 도구',
    primaryCta: 'SDK 다운로드',
  },
  problem: {
    title: '해결하려는 문제',
    items: [
      '빌드마다 사람이 처음부터 다시 하는 회귀 테스트',
      '글로만 남은 재현 절차, 다시 열리는 이슈',
      '늘어나는 시나리오, 모자란 QA 인력',
    ],
  },
  steps: {
    title: '사용 흐름',
    items: [
      {
        index: '01',
        title: 'SDK 연결',
        body: 'Unity 프로젝트에 패키지를 추가하고 게임에서 로그인합니다.',
        state: 'shipped',
      },
      {
        index: '02',
        title: '에이전트 플레이',
        body: '에이전트가 화면을 읽고 키보드와 마우스로 게임을 조작합니다.',
        state: 'shipped',
      },
      {
        index: '03',
        title: '실행 기록',
        body: '실패한 순간의 상태와 로그를 이슈에 남깁니다.',
        state: 'planned',
      },
    ],
  },
  features: {
    title: '기능',
    items: [
      {
        title: '시나리오 자동 생성',
        body: '기획서에서 테스트 시나리오 초안을 만듭니다.',
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
      'Unity 프로젝트에 패키지를 추가할 권한',
      '게임에서 ARTEL 서버로 나가는 네트워크',
      'ARTEL 계정',
    ],
  },
  faq: {
    title: '자주 묻는 질문',
    items: [
      {
        q: '어떤 게임에 쓸 수 있나요?',
        a: 'Unity 게임입니다. 지금은 싱글 플레이를 먼저 지원합니다.',
      },
      {
        q: '데이터는 어디에 저장되나요?',
        a: 'ARTEL 서버에 저장됩니다. 직접 설치하면 그 컴퓨터에 저장되고, admin 이 동의한 경우에만 하루 한 번 사용 통계를 보냅니다. 게임 내용과 개인 정보는 보내지 않습니다.',
      },
    ],
  },
  footer: { contact: '문의', repository: '저장소', language: '언어' },
  sdk: {
    title: 'Unity SDK 설치',
    steps: [
      {
        title: '패키지 추가',
        body: 'Unity Package Manager에서 Add package from git URL을 선택하고 아래 주소를 붙여 넣습니다.',
        code: 'https://github.com/project-artel/artel-sdk.git?path=/Packages/kr.artel.sdk',
        shotAlts: [
          'Package Manager의 더하기 메뉴가 열리고 Add package from git URL이 선택된 화면.',
          'Add package from git URL 입력칸에 Artel SDK의 git URL을 입력한 화면.',
        ],
      },
      {
        title: '게임 실행',
        body: '게임을 실행하고 로그인 화면에서 로그인을 누르면 브라우저가 열립니다.',
        shotAlts: ['게임 화면 위에 뜬 Artel SDK 로그인 화면과 로그인 버튼.'],
      },
      {
        title: '브라우저에서 로그인',
        body: '로그인하면 SDK가 승인됩니다. 탭은 닫아도 됩니다.',
        shotAlts: ['로그인하면 이 컴퓨터에서 기다리는 SDK를 승인한다고 안내하는 브라우저의 Artel 로그인 페이지.'],
      },
      {
        title: '프로젝트 선택',
        body: '게임에서 프로젝트를 고르면 콘솔의 게임 인스턴스 목록에 연결됨으로 표시됩니다.',
        shotAlts: [
          '게임 안의 Artel SDK 화면에 연결할 프로젝트 목록이 표시된 화면.',
          'Artel의 게임 인스턴스 목록에 새 인스턴스가 연결됨으로 표시된 화면.',
        ],
      },
    ],
    helpTitle: '문제 해결',
    help: [
      '로그인 화면이 안 뜰 때: Unity 에디터나 Development Build로 실행',
      '브라우저 로그인 지원: 에디터, Windows, macOS, Linux 빌드',
      '연결이 안 될 때: 게임의 외부 연결을 막는 방화벽 확인',
    ],
    contactCta: '문의하기',
    advancedTitle: '다른 서버에 연결하기',
    advancedNote:
      'ArtelManager의 Server 항목을 바꾸거나 아래 인자로 실행합니다.',
    advanced: [
      {
        label: '실행 인자',
        code: 'MyGame.exe -artel-server artel.example.com:443 -artel-secure true -artel-frontend https://home.artel.example.com',
      },
    ],
    copy: '복사',
    copied: '복사했습니다',
  },
  cli: {
    title: 'CLI',
    lead: '터미널이나 CI에서 QA를 실행합니다.',
    steps: [
      {
        title: 'CLI 설치',
        body: 'Node.js 22.12 이상이 필요합니다.',
        code: 'npm install -g @project-artel/cli@alpha\nartel --version',
      },
      {
        title: '로그인',
        code: 'artel auth login',
      },
      {
        title: 'CI에서는 CLI token 사용',
        body: '콘솔의 계정 설정에서 CLI token을 발급해 ARTEL_TOKEN에 넣습니다.',
        code: 'export ARTEL_TOKEN=<발급받은 token>',
      },
      {
        title: '첫 명령 실행',
        body: '<id>는 실제 값으로 바꿉니다.',
        code: `artel project list
artel game start --build ./Build/Game.exe --project <id>
artel game list --project <id>
artel qa run --test-run <id> --instance <id>`,
      },
    ],
    notesTitle: '알아 두면 좋은 점',
    notes: [
      'artel qa run의 exit code: 통과했을 때만 0, CI 통과 조건으로 사용',
    ],
    referenceCta: '전체 레퍼런스 보기',
    agent: {
      title: 'AI 에이전트에게 설치 맡기기',
      body: 'AI 코딩 에이전트에 아래 프롬프트를 붙여 넣습니다.',
      prompt: 'https://artel.kr/cli.md 의 안내를 따라 이 컴퓨터에 ARTEL CLI 를 설치해 줘.',
      instructionsCta: '에이전트용 안내 보기',
    },
  },
  skills: {
    title: 'Skill',
    lead: 'AI 코딩 에이전트가 ARTEL SDK와 CLI를 쓰게 해 주는 skill입니다.',
    agent: {
      title: 'AI 에이전트에게 설치 맡기기',
      body: 'AI 코딩 에이전트에 아래 프롬프트를 붙여 넣습니다.',
      prompt: 'https://artel.kr/skills.md 의 안내를 따라 ARTEL skill 을 설치해 줘.',
      instructionsCta: '에이전트용 안내 보기',
    },
    install: {
      title: '직접 설치',
      body: '현재 프로젝트에 설치합니다.',
      command: 'npx skills add project-artel/artel-skills',
      optionsNote: '모든 프로젝트에 설치하려면 -g를 붙입니다.',
    },
    listTitle: '포함된 skill',
    items: [
      { name: 'artel-unity-sdk', body: 'Unity SDK를 설치하고 연결합니다.' },
      { name: 'artel-cli', body: '터미널에서 QA를 실행합니다.' },
      { name: 'artel-mcp', body: '에이전트가 MCP로 게임을 직접 조작합니다. 프로토타입입니다.' },
      { name: 'artel-cheats', body: 'QA 에이전트가 쓸 치트([ArtelCheat])를 추가합니다.' },
      { name: 'artel-behaviors', body: 'QA 에이전트가 켜 둘 behavior([ArtelBehavior])를 추가합니다.' },
    ],
    repositoryCta: 'artel-skills 저장소 보기',
  },
  how: {
    title: '작동 원리',
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
  },
  selfHosting: {
    title: '직접 설치',
    lead: '한 대의 컴퓨터에서 ARTEL 전체를 실행합니다.',
    overview: {
      title: '필요한 것',
      items: ['RAM 8 GB 이상', 'OpenRouter 계정'],
    },
    chooser: {
      title: '설치 방법 고르기',
      cards: [
        {
          id: 'install-script',
          name: '설치 스크립트',
          audience: 'Docker 로 명령 한 줄에 설치합니다.',
          cta: '열기',
        },
        {
          id: 'docker-compose',
          name: 'Docker Compose',
          audience: 'Docker Compose 설정을 직접 관리합니다.',
          cta: '열기',
        },
        {
          id: 'desktop-app',
          name: '데스크톱 앱',
          audience: '앱으로 설치합니다.',
          cta: '열기',
          state: 'planned',
        },
      ],
    },
    afterInstall: [
      {
        title: '처음 할 일',
        blocks: [
          {
            kind: 'list',
            items: [
              '처음 가입한 계정이 admin, 다른 계정은 admin 이 /admin/users 에서 생성',
              'OpenRouter 키 입력: admin 으로 /admin/settings',
            ],
          },
        ],
      },
    ],
    methods: {
      'install-script': {
        title: '설치 스크립트',
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
                  '--port 포트 (기본값 8088)',
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
            title: '백업',
            blocks: [
              {
                kind: 'paragraph',
                text: '만들어진 docker-compose.yml 에 비밀값이 들어 있습니다. 공유하지 말고 백업하세요. 잃으면 저장한 키를 읽을 수 없습니다.',
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
        ],
      },
      'docker-compose': {
        title: 'Docker Compose',
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
                text: '빈 디렉터리에서 실행합니다.',
              },
              {
                kind: 'code',
                code: 'composeDownload',
              },
              {
                kind: 'composeFile',
                show: 'docker-compose.yml 보기',
                copy: 'docker-compose.yml 복사',
              },
            ],
          },
          {
            title: '맨 위 설정',
            blocks: [
              {
                kind: 'paragraph',
                text: '맨 위의 CHANGE_ME 를 모두 아래 명령의 결과로 바꿉니다.',
              },
              {
                kind: 'code',
                code: 'generateSecret',
              },
              {
                kind: 'paragraph',
                text: '이 파일은 공유하지 말고 백업하세요. x-secrets-key 는 첫 시작 뒤에 바꾸지 않습니다.',
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
            ],
          },
          {
            title: '로그',
            blocks: [
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
                text: 'artel_minio-data 볼륨과 docker-compose.yml 도 함께 백업합니다.',
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
            ],
          },
        ],
      },
      'desktop-app': {
        title: '데스크톱 앱',
        state: 'planned',
        steps: [
          {
            title: '앱 내려받기',
            blocks: [
              {
                kind: 'link',
                label: 'GitHub Releases 에서 내려받기',
                href: desktopReleasesUrl,
              },
            ],
          },
          {
            title: '지원 환경',
            blocks: [
              {
                kind: 'list',
                items: [
                  'Windows x64, arm64',
                  'macOS Apple silicon, Intel',
                  'Linux x64, arm64 (AppImage, deb)',
                  'Linux 는 Ubuntu 24.04, Debian 12 이상',
                ],
              },
            ],
          },
        ],
      },
    },
    method: {
      back: '← 직접 설치로 돌아가기',
      othersTitle: '다른 설치 방법',
    },
    remoteFile: { loading: '불러오는 중', failed: '불러오지 못했습니다.', openOnGitHub: 'GitHub에서 보기' },
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
    install: 'Install',
    installMenu: 'Ways to install',
    sdk: 'SDK',
    cli: 'CLI',
    skills: 'Skills',
    selfHosting: 'Self-hosting',
    how: 'How it works',
    skipToContent: 'Skip to content',
    home: 'Home',
  },
  theme: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
  availability: { shipped: 'Working', planned: 'Planned' },
  hero: {
    status: 'In development',
    title: 'A game QA tool where an agent plays the game',
    primaryCta: 'Download SDK',
  },
  problem: {
    title: 'The problem',
    items: [
      'The same regression tests, by hand, on every build',
      'Repro steps kept only as text, and issues that reopen',
      'More scenarios than QA staff',
    ],
  },
  steps: {
    title: 'Workflow',
    items: [
      {
        index: '01',
        title: 'SDK connection',
        body: 'Add the package to your Unity project and sign in from the game.',
        state: 'shipped',
      },
      {
        index: '02',
        title: 'Agent play',
        body: 'The agent reads the screen and plays with keyboard and mouse.',
        state: 'shipped',
      },
      {
        index: '03',
        title: 'Run record',
        body: 'The state and logs at a failure go into an issue.',
        state: 'planned',
      },
    ],
  },
  features: {
    title: 'Features',
    items: [
      {
        title: 'Scenario generation',
        body: 'Drafts test scenarios from a design document.',
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
      'Permission to add a package to the Unity project',
      'Outbound network from the game to the ARTEL server',
      'An ARTEL account',
    ],
  },
  faq: {
    title: 'Questions',
    items: [
      {
        q: 'Which games does it work with?',
        a: 'Unity games. Single-player comes first.',
      },
      {
        q: 'Where does the data live?',
        a: 'On ARTEL servers. If you self-host, on that machine, and usage statistics go out once a day only if the admin agrees. Game content and personal information are never sent.',
      },
    ],
  },
  footer: { contact: 'Contact', repository: 'Repository', language: 'Language' },
  sdk: {
    title: 'Install the Unity SDK',
    steps: [
      {
        title: 'Add the package',
        body: 'In Unity Package Manager choose Add package from git URL and paste the address below.',
        code: 'https://github.com/project-artel/artel-sdk.git?path=/Packages/kr.artel.sdk',
        shotAlts: [
          'The plus menu in Package Manager open with Add package from git URL highlighted.',
          'The Artel SDK git URL typed into the Add package from git URL field.',
        ],
      },
      {
        title: 'Run the game',
        body: 'Run the game and choose 로그인 (Sign in) on the sign-in screen. Your browser opens.',
        shotAlts: ['The Artel SDK sign-in screen over the game, with its 로그인 button.'],
      },
      {
        title: 'Sign in in the browser',
        body: 'Signing in approves the SDK. You can close the tab.',
        shotAlts: ['The Artel sign-in page in the browser, saying that signing in approves the SDK waiting on this machine.'],
      },
      {
        title: 'Pick the project',
        body: "Pick the project in the game. It shows as Connected in the console's game instance list.",
        shotAlts: [
          'The Artel SDK screen in the game listing projects to connect to.',
          'The game instance list in Artel showing the new instance as Connected.',
        ],
      },
    ],
    helpTitle: 'Troubleshooting',
    help: [
      'No sign-in screen: run in the Unity editor or a Development Build',
      'Browser sign-in: editor, Windows, macOS and Linux builds',
      'No connection: check for a firewall blocking outbound connections from the game',
    ],
    contactCta: 'Contact us',
    advancedTitle: 'Connecting to another server',
    advancedNote:
      'Change Server on ArtelManager, or launch with these arguments.',
    advanced: [
      {
        label: 'Launch arguments',
        code: 'MyGame.exe -artel-server artel.example.com:443 -artel-secure true -artel-frontend https://home.artel.example.com',
      },
    ],
    copy: 'Copy',
    copied: 'Copied',
  },
  cli: {
    title: 'CLI',
    lead: 'Run QA from a terminal or CI.',
    steps: [
      {
        title: 'Install the CLI',
        body: 'Requires Node.js 22.12 or newer.',
        code: 'npm install -g @project-artel/cli@alpha\nartel --version',
      },
      {
        title: 'Sign in',
        code: 'artel auth login',
      },
      {
        title: 'Use a CLI token in CI',
        body: 'Issue a CLI token in the console account settings and put it in ARTEL_TOKEN.',
        code: 'export ARTEL_TOKEN=<your issued token>',
      },
      {
        title: 'Run your first commands',
        body: 'Replace each <id> with a real value.',
        code: `artel project list
artel game start --build ./Build/Game.exe --project <id>
artel game list --project <id>
artel qa run --test-run <id> --instance <id>`,
      },
    ],
    notesTitle: 'Good to know',
    notes: [
      'artel qa run exit code: 0 only when the run passed, usable as a CI gate',
    ],
    referenceCta: 'Read the full reference',
    agent: {
      title: 'Let your AI agent install it',
      body: 'Paste this prompt into an AI coding agent.',
      prompt: 'Install the ARTEL CLI on this machine by following https://artel.kr/cli.md',
      instructionsCta: 'View the agent instructions',
    },
  },
  skills: {
    title: 'Skills',
    lead: 'Skills that let an AI coding agent use the ARTEL SDK and CLI.',
    agent: {
      title: 'Let your AI agent install them',
      body: 'Paste this prompt into an AI coding agent.',
      prompt: 'Install the ARTEL skills by following https://artel.kr/skills.md',
      instructionsCta: 'View the agent instructions',
    },
    install: {
      title: 'Install it yourself',
      body: 'Installs into the current project.',
      command: 'npx skills add project-artel/artel-skills',
      optionsNote: 'Add -g to install for every project.',
    },
    listTitle: 'Included skills',
    items: [
      { name: 'artel-unity-sdk', body: 'Installs and connects the Unity SDK.' },
      { name: 'artel-cli', body: 'Runs QA from a terminal.' },
      { name: 'artel-mcp', body: 'Lets an agent drive the game over MCP. A prototype.' },
      { name: 'artel-cheats', body: 'Adds cheats ([ArtelCheat]) for the QA agent.' },
      { name: 'artel-behaviors', body: 'Adds behaviors ([ArtelBehavior]) the QA agent can switch on.' },
    ],
    repositoryCta: 'View the artel-skills repository',
  },
  how: {
    title: 'How it works',
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
  },
  selfHosting: {
    title: 'Self-hosting',
    lead: 'Run all of ARTEL on one machine.',
    overview: {
      title: 'What you need',
      items: ['8 GB of RAM or more', 'An OpenRouter account'],
    },
    chooser: {
      title: 'Choose a method',
      cards: [
        {
          id: 'install-script',
          name: 'Install script',
          audience: 'One command, with Docker.',
          cta: 'Open',
        },
        {
          id: 'docker-compose',
          name: 'Docker Compose',
          audience: 'Manage the Docker Compose file yourself.',
          cta: 'Open',
        },
        {
          id: 'desktop-app',
          name: 'Desktop app',
          audience: 'Install an app.',
          cta: 'Open',
          state: 'planned',
        },
      ],
    },
    afterInstall: [
      {
        title: 'First steps',
        blocks: [
          {
            kind: 'list',
            items: [
              'First account to sign up: the admin, who creates other accounts at /admin/users',
              'OpenRouter key: entered by the admin at /admin/settings',
            ],
          },
        ],
      },
    ],
    methods: {
      'install-script': {
        title: 'Install script',
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
                  '--port port (default 8088)',
                  '--no-start write the file without starting',
                ],
              },
              {
                kind: 'code',
                code: 'installWithFlags',
              },
            ],
          },
          {
            title: 'Backup',
            blocks: [
              {
                kind: 'paragraph',
                text: 'The docker-compose.yml it creates holds secrets. Do not share it, and back it up: without it, stored keys cannot be read.',
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
        ],
      },
      'docker-compose': {
        title: 'Docker Compose',
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
                text: 'Run this in an empty directory.',
              },
              {
                kind: 'code',
                code: 'composeDownload',
              },
              {
                kind: 'composeFile',
                show: 'Show docker-compose.yml',
                copy: 'Copy docker-compose.yml',
              },
            ],
          },
          {
            title: 'Settings at the top',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Replace every CHANGE_ME at the top with the output of this command.',
              },
              {
                kind: 'code',
                code: 'generateSecret',
              },
              {
                kind: 'paragraph',
                text: 'Do not share this file, and back it up. Never change x-secrets-key after the first start.',
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
            ],
          },
          {
            title: 'Logs',
            blocks: [
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
                text: 'Back up the artel_minio-data volume and docker-compose.yml too.',
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
            ],
          },
        ],
      },
      'desktop-app': {
        title: 'Desktop app',
        state: 'planned',
        steps: [
          {
            title: 'Download the app',
            blocks: [
              {
                kind: 'link',
                label: 'Download from GitHub Releases',
                href: desktopReleasesUrl,
              },
            ],
          },
          {
            title: 'Supported systems',
            blocks: [
              {
                kind: 'list',
                items: [
                  'Windows x64 and arm64',
                  'macOS Apple silicon and Intel',
                  'Linux x64 and arm64 (AppImage, deb)',
                  'Linux: Ubuntu 24.04, Debian 12 or newer',
                ],
              },
            ],
          },
        ],
      },
    },
    method: {
      back: '← Back to self-hosting',
      othersTitle: 'Other methods',
    },
    remoteFile: { loading: 'Loading', failed: 'Could not load it.', openOnGitHub: 'Open on GitHub' },
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
