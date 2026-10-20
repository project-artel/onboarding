import type { Locale } from './locale'
import type { ArchitectureLabels } from '../components/ArchitectureDiagram'
import type { SelfHostingMethodId } from './selfHostingRoutes'

// Download page of the desktop app. Plain text, so `npm run check` can load this file without a bundler.
const desktopReleasesUrl = 'https://github.com/project-artel/artel-desktop/releases/latest'

// Keys of the commands and slug lists kept once in `pages/selfHostingCommands.ts`.
export type SelfHostingCodeKey =
  | 'install'
  | 'installWithFlags'
  | 'composeDownload'
  | 'generateSecret'
  | 'composeUp'

export type SelfHostingBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'code'; code: SelfHostingCodeKey }
  | { kind: 'link'; label: string; href: string }
  | { kind: 'composeFile'; show: string; copy: string }

export type SelfHostingSection = { title: string; blocks: SelfHostingBlock[] }

export type SelfHostingMethodPage = {
  title: string
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
  hero: {
    title: string
    appCta: string
    sdkCta: string
  }
  problem: { title: string; items: string[] }
  steps: {
    title: string
    items: { index: string; title: string; body: string }[]
  }
  features: {
    title: string
    items: { title: string; body: string }[]
  }
  faq: { title: string; items: { q: string; a: string }[] }
  footer: { repository: string; language: string }
  sdk: {
    title: string
    steps: { title: string; body: string; code?: string; shotAlts: string[] }[]
    helpTitle: string
    help: string[]
    advancedTitle: string
    advancedNote: string
    advanced: { label: string; code: string }[]
    copy: string
    copied: string
  }
  cli: {
    title: string
    lead: string
    manualTitle: string
    steps: { title: string; body?: string; code?: string }[]
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
    diagram: ArchitectureLabels
    flow: string[]
    lifecycleTitle: string
    lifecycle: { title: string; body: string }[]
  }
  selfHosting: {
    title: string
    overview: { title: string; items: string[] }
    chooser: {
      title: string
      cards: { id: SelfHostingMethodId; name: string; audience: string; cta: string }[]
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
    title: 'ARTEL | Unity 게임 QA Agent',
    description:
      'Unity 게임에 SDK를 연결하면 에이전트가 직접 플레이하며 테스트 케이스를 검증하고 실패 순간의 증거를 남기는 게임 QA 도구',
  },
  nav: {
    install: '설치',
    installMenu: '설치 방법',
    sdk: 'SDK',
    cli: 'CLI',
    skills: 'Skill',
    selfHosting: '셀프 호스팅',
    how: '아키텍처',
    skipToContent: '본문으로 건너뛰기',
    home: '홈',
  },
  theme: { toLight: '라이트 모드로 전환', toDark: '다크 모드로 전환' },
  hero: {
    title: 'Unity 게임 QA Agent',
    appCta: '데스크톱 앱 다운로드',
    sdkCta: 'Unity SDK 설치',
  },
  problem: {
    title: '지금의 게임 QA',
    items: [
      '빌드마다 사람이 처음부터 다시 하는 회귀 테스트',
      '글로만 남은 재현 절차, 다시 열리는 이슈',
      '늘어나는 테스트 케이스, 모자란 QA 인력',
    ],
  },
  steps: {
    title: '사용 흐름',
    items: [
      {
        index: '01',
        title: 'SDK 연결',
        body: 'Unity 프로젝트에 패키지 추가, 게임에서 로그인',
      },
      {
        index: '02',
        title: '에이전트 플레이',
        body: '에이전트가 화면을 읽고 키보드와 마우스로 게임 조작',
      },
      {
        index: '03',
        title: '실행 기록',
        body: '실패한 순간의 상태와 로그를 이슈로 기록',
      },
    ],
  },
  features: {
    title: '기능',
    items: [
      { title: '화면 지도', body: '플레이하며 지나간 화면과 이동 경로를 지도로 기록' },
      { title: '케이스 라이브러리', body: '기획 문서에서 테스트 케이스 초안 생성' },
      { title: '지식 그래프', body: '기획 문서의 규칙과 용어를 에이전트의 판단 근거로 사용' },
      { title: 'Macro', body: '성공한 조작을 저장해 다음 실행에서 재사용' },
      { title: '성능', body: '빌드와 QA 실행별 프레임 시간, draw call, 메모리 할당' },
      { title: 'GitHub 이슈 연동', body: '찾은 이슈를 GitHub 이슈로 내보내기' },
    ],
  },
  faq: {
    title: '자주 묻는 질문',
    items: [
      {
        q: '어떤 게임에 쓸 수 있나요?',
        a: 'Unity로 만든 게임이라면 쓸 수 있어요. 지금은 싱글 플레이 게임부터 지원하고 있어요.',
      },
      {
        q: '게임 코드를 고쳐야 하나요?',
        a: '아니요, 패키지만 추가하면 돼요. 게임 로직은 건드리지 않아요. 치트와 behavior를 등록해 두면 에이전트가 씬 이동 같은 준비를 더 빨리 끝낼 수 있어요.',
      },
      {
        q: '어떤 AI 모델을 쓰나요?',
        a: 'OpenRouter, AWS Bedrock, Claude API로 연결한 모델 중에서 골라 쓸 수 있어요. 사용량과 비용은 콘솔의 사용량 화면에서 확인할 수 있어요.',
      },
      {
        q: '모바일 게임도 되나요?',
        a: '아직은 Unity 에디터와 Windows, macOS, Linux 빌드에서만 동작해요.',
      },
      {
        q: 'CI에서 돌릴 수 있나요?',
        a: '네, CLI와 CLI token으로 빌드마다 QA를 돌릴 수 있어요. QA가 실패하면 CI 작업도 실패로 끝나요.',
      },
      {
        q: '데이터는 어디에 저장되나요?',
        a: 'ARTEL 서버에 저장돼요. 셀프 호스팅하면 설치한 컴퓨터에 저장돼요. 사용 통계는 관리자가 동의한 경우에만 하루 한 번 보내고, 게임 내용과 개인 정보는 보내지 않아요.',
      },
    ],
  },
  footer: { repository: '저장소', language: '언어' },
  sdk: {
    title: 'Unity SDK 설치',
    steps: [
      {
        title: '패키지 추가',
        body: 'Unity Package Manager의 Add package from git URL에 아래 주소 입력',
        code: 'https://github.com/project-artel/artel-sdk.git?path=/Packages/kr.artel.sdk',
        shotAlts: [
          'Package Manager의 더하기 메뉴가 열리고 Add package from git URL이 선택된 화면.',
          'Add package from git URL 입력칸에 Artel SDK의 git URL을 입력한 화면.',
        ],
      },
      {
        title: '게임 실행',
        body: '게임 실행 후 로그인 화면에서 로그인 선택, 브라우저가 열림',
        shotAlts: ['게임 화면 위에 뜬 Artel SDK 로그인 화면과 로그인 버튼.'],
      },
      {
        title: '브라우저에서 로그인',
        body: '로그인하면 SDK 승인 완료, 탭은 닫아도 됨',
        shotAlts: ['로그인하면 이 컴퓨터에서 기다리는 SDK를 승인한다고 안내하는 브라우저의 Artel 로그인 페이지.'],
      },
      {
        title: '프로젝트 선택',
        body: '게임에서 프로젝트를 고르면 콘솔의 게임 인스턴스 목록에 연결됨으로 표시',
        shotAlts: [
          '게임 안의 Artel SDK 화면에 연결할 프로젝트 목록이 표시된 화면.',
          'Artel의 게임 인스턴스 목록에 새 인스턴스가 연결됨으로 표시된 화면.',
        ],
      },
    ],
    helpTitle: '문제 해결',
    help: [
      '로그인 화면이 안 뜨면 Unity 에디터나 Development Build로 실행',
      '브라우저 로그인은 에디터와 Windows, macOS, Linux 빌드에서 지원',
      '연결이 안 되면 게임의 외부 연결을 막는 방화벽 확인',
    ],
    advancedTitle: '다른 서버에 연결하기',
    advancedNote:
      'ArtelManager의 Server 항목 변경, 또는 아래 인자로 실행',
    advanced: [
      {
        label: '실행 인자',
        code: 'MyGame.exe -artel-server artel.example.com:443 -artel-secure true -artel-frontend https://home.artel.example.com',
      },
    ],
    copy: '복사',
    copied: '복사됨',
  },
  cli: {
    title: 'CLI',
    lead: '터미널과 CI에서 QA 실행',
    manualTitle: '수동 설치',
    steps: [
      {
        title: 'CLI 설치',
        body: 'Node.js 22.12 이상 필요',
        code: 'npm install -g @project-artel/cli@alpha\nartel --version',
      },
      {
        title: '로그인',
        code: 'artel auth login',
      },
      {
        title: 'CI에서는 CLI token 사용',
        body: '콘솔의 계정 설정에서 CLI token 발급 후 ARTEL_TOKEN에 설정. QA가 실패하면 CI 작업도 실패로 끝남',
        code: 'export ARTEL_TOKEN=<발급받은 token>',
      },
      {
        title: '첫 명령 실행',
        body: '<id>는 실제 값으로 교체',
        code: `artel project list
artel game start --build ./Build/Game.exe --project <id>
artel game list --project <id>
artel qa run --test-run <id> --instance <id>`,
      },
    ],
    referenceCta: '전체 레퍼런스 보기',
    agent: {
      title: 'AI 에이전트에게 설치 맡기기',
      body: 'AI 코딩 에이전트에 아래 프롬프트 붙여 넣기',
      prompt: 'https://artel.kr/cli.md 의 안내를 따라 이 컴퓨터에 ARTEL CLI 를 설치해 줘.',
      instructionsCta: '에이전트용 안내 보기',
    },
  },
  skills: {
    title: 'Skill',
    lead: 'AI 코딩 에이전트가 ARTEL SDK와 CLI를 쓰게 해 주는 skill',
    agent: {
      title: 'AI 에이전트에게 설치 맡기기',
      body: 'AI 코딩 에이전트에 아래 프롬프트 붙여 넣기',
      prompt: 'https://artel.kr/skills.md 의 안내를 따라 ARTEL skill 을 설치해 줘.',
      instructionsCta: '에이전트용 안내 보기',
    },
    install: {
      title: '수동 설치',
      body: '현재 프로젝트에 설치',
      command: 'npx skills add project-artel/artel-skills',
      optionsNote: '모든 프로젝트에 설치하려면 -g 추가',
    },
    listTitle: '포함된 skill',
    items: [
      { name: 'artel-unity-sdk', body: 'Unity SDK 설치와 연결' },
      { name: 'artel-cli', body: '터미널에서 QA 실행' },
      { name: 'artel-mcp', body: '에이전트가 MCP로 게임 직접 조작 (프로토타입)' },
      { name: 'artel-cheats', body: 'QA 에이전트가 쓸 치트([ArtelCheat]) 추가' },
      { name: 'artel-behaviors', body: 'QA 에이전트가 켜 둘 behavior([ArtelBehavior]) 추가' },
    ],
    repositoryCta: 'artel-skills 저장소 보기',
  },
  how: {
    title: '아키텍처',
    flowTitle: '데이터 흐름',
    flowAlt:
      '게임 안의 SDK가 씬 상태를 Orchestration 서버로 보고하고, Agent 서버가 다음 액션을 정해 다시 SDK로 내려보내며, 실행 결과가 대시보드에 기록되는 흐름',
    diagram: {
      game: 'Unity 게임 + SDK',
      orchestration: 'Orchestration 서버',
      agent: 'Agent 서버',
      model: 'LLM',
      console: '콘솔 · CLI',
      storage: 'PostgreSQL · 파일',
    },
    flow: [
      'SDK가 씬 상태 보고',
      'Agent 서버가 케이스와 화면 상태를 비교해 다음 액션 결정',
      'Orchestration 서버가 액션을 게임 인스턴스로 전달',
      'SDK가 입력을 주입하고 결과 반환',
      '실행 로그와 이슈를 기록하고 콘솔에서 조회',
    ],
    lifecycleTitle: 'QA 실행 수명주기',
    lifecycle: [
      {
        title: '기획 문서 업로드',
        body: '문서의 규칙과 용어를 지식 그래프로 정리',
      },
      {
        title: '테스트 케이스 확정',
        body: '케이스 라이브러리에서 초안을 다듬어 확정',
      },
      {
        title: '테스트 런 구성',
        body: '확정한 케이스를 묶어 실행 단위 구성',
      },
      {
        title: '게임 인스턴스 연결',
        body: '빌드를 등록하고 SDK가 연결된 인스턴스 연결',
      },
      {
        title: 'QA 실행과 이슈 조회',
        body: '에이전트가 케이스를 실행하고 남긴 증거 확인',
      },
    ],
  },
  selfHosting: {
    title: '셀프 호스팅',
    overview: {
      title: '요구 사항',
      items: ['RAM 8 GB 이상', 'OpenRouter API 키 (필수)', 'AWS Bedrock, Claude API 키 (선택)'],
    },
    chooser: {
      title: '설치 방법 고르기',
      cards: [
        {
          id: 'install-script',
          name: '설치 스크립트',
          audience: 'Docker 로 명령 한 줄 설치',
          cta: '열기',
        },
        {
          id: 'docker-compose',
          name: 'Docker Compose',
          audience: 'Docker Compose 설정 직접 관리',
          cta: '열기',
        },
        {
          id: 'desktop-app',
          name: '데스크톱 앱',
          audience: '앱으로 설치',
          cta: '열기',
        },
      ],
    },
    afterInstall: [
      {
        title: '초기 설정',
        blocks: [
          {
            kind: 'list',
            items: [
              '처음 가입한 계정은 관리자 계정',
              '다른 사람의 계정은 관리자가 관리 > 사용자에서 생성',
              'API 키는 관리자가 관리 > 설정에서 입력',
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
            title: '비밀값 보관',
            blocks: [
              {
                kind: 'paragraph',
                text: '만들어진 docker-compose.yml 에 비밀값 포함. 공유 금지, 백업 필수. 잃으면 저장한 키를 읽을 수 없음',
              },
            ],
          },
          {
            title: '시작 후',
            blocks: [
              {
                kind: 'paragraph',
                text: 'http://localhost:8088/ 열기',
              },
            ],
          },
        ],
      },
      'docker-compose': {
        title: 'Docker Compose',
        steps: [
          {
            title: '요구 사항',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Docker Compose 2.23.1 이상',
              },
            ],
          },
          {
            title: 'docker-compose.yml',
            blocks: [
              {
                kind: 'paragraph',
                text: '빈 디렉터리에서 실행',
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
            title: '비밀값 설정',
            blocks: [
              {
                kind: 'paragraph',
                text: 'docker-compose.yml 의 CHANGE_ME 5개를 각각 아래 명령의 결과로 교체',
              },
              {
                kind: 'code',
                code: 'generateSecret',
              },
              {
                kind: 'paragraph',
                text: '이 파일은 공유 금지, 백업 필수. x-secrets-key 는 첫 시작 뒤 변경 금지',
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
        ],
      },
      'desktop-app': {
        title: '데스크톱 앱',
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
      back: '← 셀프 호스팅',
      othersTitle: '다른 설치 방법',
    },
    remoteFile: { loading: '불러오는 중', failed: '불러오지 못했습니다.', openOnGitHub: 'GitHub에서 보기' },
    deployReadmeLabel: 'deploy/README.md',
    licenseLabel: 'LICENSE (AGPL-3.0)',
  },
  notFound: {
    title: '없는 페이지',
    body: '주소를 다시 확인해 주세요.',
    back: '홈으로',
  },
}

const en: Copy = {
  meta: {
    title: 'ARTEL | QA agent for Unity games',
    description:
      'Add the SDK to your Unity game and an agent plays it, checks your test cases, and keeps evidence when a step fails.',
  },
  nav: {
    install: 'Install',
    installMenu: 'Ways to install',
    sdk: 'SDK',
    cli: 'CLI',
    skills: 'Skills',
    selfHosting: 'Self-hosting',
    how: 'Architecture',
    skipToContent: 'Skip to content',
    home: 'Home',
  },
  theme: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
  hero: {
    title: 'QA agent for Unity games',
    appCta: 'Download the desktop app',
    sdkCta: 'Install the Unity SDK',
  },
  problem: {
    title: 'Game QA today',
    items: [
      'The same regression tests, by hand, on every build',
      'Repro steps kept only as text, and issues that reopen',
      'More test cases than QA staff',
    ],
  },
  steps: {
    title: 'Workflow',
    items: [
      {
        index: '01',
        title: 'SDK connection',
        body: 'Add the package to your Unity project and sign in from the game.',
      },
      {
        index: '02',
        title: 'Agent play',
        body: 'The agent reads the screen and plays with keyboard and mouse.',
      },
      {
        index: '03',
        title: 'Run record',
        body: 'The state and logs at a failure go into an issue.',
      },
    ],
  },
  features: {
    title: 'Features',
    items: [
      { title: 'Screen map', body: 'Screens and paths the agent walked through, drawn as a map' },
      { title: 'Case library', body: 'Test case drafts from the planning document' },
      { title: 'Knowledge graph', body: 'Rules and terms from the planning document that ground the agent' },
      { title: 'Macros', body: 'Successful moves saved and replayed in later runs' },
      { title: 'Performance', body: 'Frame time, draw calls and memory allocation per build and QA run' },
      { title: 'GitHub issues', body: 'Found issues exported to GitHub issues' },
    ],
  },
  faq: {
    title: 'Questions',
    items: [
      {
        q: 'Which games does it work with?',
        a: 'Any game made with Unity. Single-player games are supported first.',
      },
      {
        q: 'Do I have to change my game code?',
        a: 'No, you only add a package and your game logic stays as it is. If you register cheats and behaviors, the agent can get set up faster, for example by jumping straight to a scene.',
      },
      {
        q: 'Which AI models does it use?',
        a: 'You pick from the models you connect through OpenRouter, AWS Bedrock or the Claude API. Usage and cost are on the console usage screen.',
      },
      {
        q: 'Does it work with mobile games?',
        a: 'Not yet. It works in the Unity editor and in Windows, macOS and Linux builds.',
      },
      {
        q: 'Can I run it in CI?',
        a: 'Yes. With the CLI and a CLI token you can run QA on every build, and a failed QA run fails the CI job.',
      },
      {
        q: 'Where does the data live?',
        a: 'On ARTEL servers, or on your own machine if you self-host. Usage statistics are sent once a day only if the admin agrees, and game content and personal information are never sent.',
      },
    ],
  },
  footer: { repository: 'Repository', language: 'Language' },
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
      'No sign-in screen? Run in the Unity editor or a Development Build',
      'Browser sign-in works in the editor and in Windows, macOS and Linux builds',
      'Not connecting? Check for a firewall blocking outbound connections from the game',
    ],
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
    manualTitle: 'Install manually',
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
        body: 'Issue a CLI token in the console account settings and put it in ARTEL_TOKEN. A failed QA run fails the CI job.',
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
      title: 'Install manually',
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
    title: 'Architecture',
    flowTitle: 'Data flow',
    flowAlt:
      'The SDK inside the game reports scene state to the orchestration server, the agent server decides the next action and sends it back down to the SDK, and run results are recorded for the dashboard',
    diagram: {
      game: 'Unity game + SDK',
      orchestration: 'Orchestration server',
      agent: 'Agent server',
      model: 'LLM',
      console: 'Console · CLI',
      storage: 'PostgreSQL · files',
    },
    flow: [
      'The SDK reports scene state.',
      'The agent server compares the case and the screen state to pick the next action.',
      'The orchestration server dispatches the action to that game instance.',
      'The SDK injects the input and returns the result.',
      'Run logs and issues are recorded and read from the dashboard.',
    ],
    lifecycleTitle: 'QA run lifecycle',
    lifecycle: [
      {
        title: 'Upload the planning document',
        body: 'Its rules and terms go into the knowledge graph.',
      },
      {
        title: 'Settle test cases',
        body: 'Refine the drafts in the case library and approve them.',
      },
      {
        title: 'Compose a test run',
        body: 'Group approved cases into an executable unit.',
      },
      {
        title: 'Connect a game instance',
        body: 'Register the build and connect the instance carrying the SDK.',
      },
      {
        title: 'Run QA and read issues',
        body: 'The agent runs the cases and you review the evidence it left.',
      },
    ],
  },
  selfHosting: {
    title: 'Self-hosting',
    overview: {
      title: 'Requirements',
      items: ['8 GB of RAM or more', 'OpenRouter API key (required)', 'AWS Bedrock, Claude API keys (optional)'],
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
        },
      ],
    },
    afterInstall: [
      {
        title: 'Initial setup',
        blocks: [
          {
            kind: 'list',
            items: [
              'The first account to sign up is the admin account',
              "Other people's accounts are created by the admin in Admin > Users",
              'API keys are entered by the admin in Admin > Settings',
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
            title: 'Keep the secrets',
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
            title: 'Requirements',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Docker Compose 2.23.1 or later',
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
            title: 'Secrets',
            blocks: [
              {
                kind: 'paragraph',
                text: 'Replace each of the five CHANGE_ME values in docker-compose.yml with the output of this command.',
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
        ],
      },
      'desktop-app': {
        title: 'Desktop app',
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
                  'Linux needs Ubuntu 24.04, Debian 12 or newer',
                ],
              },
            ],
          },
        ],
      },
    },
    method: {
      back: '← Self-hosting',
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
