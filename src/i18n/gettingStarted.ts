import type { Locale } from './locale'

export type GettingStartedTrack = 'manual' | 'agent'
export type GuideStep = { id: string; title: string; items: string[]; links?: { label: string; to: string }[]; prompt?: string; after?: string }
type GettingStartedCopy = {
  title: string
  description: string
  trackLabel: string
  stepsLabel: string
  tracks: Record<GettingStartedTrack, { title: string; description: string; steps: GuideStep[] }>
}

const qa: Record<Locale, GuideStep> = {
  ko: {
    id: 'run', title: 'QA 실행하기',
    items: ['SDK가 연결된 게임을 실행한 상태로 유지', '콘솔에서 프로젝트를 선택하고 왼쪽 QA 실행 열기', '페이지 상단의 테스트 런 선택 메뉴에서 실행할 런 선택'],
    links: [{ label: '모델과 API 키 설정', to: '/docs/models#personal-key' }, { label: '콘솔 열기', to: 'console' }],
  },
  en: {
    id: 'run', title: 'Run QA',
    items: ['Keep the game running with the SDK connected.', 'Choose the project in the console, then open Run QA in the left navigation.', 'Select the test run from the menu at the top of the page.'],
    links: [{ label: 'Configure models and API keys', to: '/docs/models#personal-key' }, { label: 'Open the console', to: 'console' }],
  },
}
const review: Record<Locale, GuideStep> = {
  ko: {
    id: 'review', title: '판정 검토하기',
    items: ['프로젝트의 왼쪽 메뉴에서 QA 실행 기록 열기', '게임 버전을 고르고 검토할 실행 타일 선택', '오른쪽 실행 상세의 판정 검토 선택'],
  },
  en: {
    id: 'review', title: 'Review verdicts',
    items: ['Open QA run history in the project’s left navigation.', 'Choose the game version, then select the execution tile to review.', 'Select Review verdicts in the execution details on the right.'],
  },
}

const issues: Record<Locale, GuideStep> = {
  ko: { id: 'issues', title: '이슈 확인·관리하기', items: ['프로젝트의 왼쪽 메뉴에서 이슈 열기', '전체 이슈 탭 선택 후 대상 버전으로 목록 좁히기', '확인할 이슈를 선택해 이슈 상세 열기'] },
  en: { id: 'issues', title: 'Inspect and manage issues', items: ['Open Issues in the project’s left navigation.', 'Select All issues, then filter by the target version.', 'Select an issue to open its details.'] },
}
export const gettingStartedCopy: Record<Locale, GettingStartedCopy> = {
  ko: {
    title: '시작하기', description: 'SDK 설치부터 Test Case·시나리오 작성, QA 실행과 판정 검토까지', trackLabel: '진행 방법', stepsLabel: '단계',
    tracks: {
      manual: {
        title: '직접 진행하기', description: '콘솔에서 Test Case와 시나리오를 직접 작성',
        steps: [
          { id: 'sdk', title: 'SDK 설치하기', items: ['콘솔에 로그인해 프로젝트 생성 또는 참여', 'Unity Package Manager에서 ARTEL SDK 추가', 'Play Mode 또는 Development Build로 게임 실행, 로그인 후 프로젝트 연결'], links: [{ label: 'SDK 설치 안내', to: '/sdk' }, { label: '콘솔 열기', to: 'console' }] },
          { id: 'test-cases', title: 'Test Case 만들기', items: ['콘솔에서 프로젝트를 선택하고 왼쪽 Test Cases 열기', '왼쪽 버전 목록에서 테스트할 게임 버전 선택', '새 Test Case를 선택해 작성 화면 열기'], after: '필수 항목 입력 후 작성 화면 아래의 Test Case 추가를 선택해 저장.' },
          { id: 'scenarios', title: '시나리오 만들기', items: ['프로젝트의 왼쪽 메뉴에서 테스트 런 열기', '대상 빌드 버전을 고르고 새로운 테스트런 선택', '런을 만든 뒤 해당 런을 열고 시나리오 추가 선택'], after: '시나리오에서 Test Case 추가로 검증할 항목을 연결. 단계 기반은 각 스텝의 행동과 실행 순서도 작성한 뒤 승인.' },
          qa.ko, review.ko, issues.ko,
        ],
      },
      agent: {
        title: 'Coding agent로 진행하기', description: '에이전트에 SDK 연결과 Test Case·시나리오 준비 요청',
        steps: [
          { id: 'plugin', title: 'Plugin 설치하기', items: ['사용하는 coding agent에 ARTEL plugin 설치', '브라우저에서 ARTEL 로그인과 연결 권한 승인', '에이전트에 프로젝트 목록 조회를 요청해 연결 확인'], links: [{ label: 'Plugin 설치 안내', to: '/skills' }] },
          { id: 'prepare', title: 'SDK·Test Case·시나리오 준비 요청하기', items: ['게임 프로젝트를 coding agent에서 열고 대상 ARTEL 프로젝트와 검증할 기능 전달', '아래 요청에서 프로젝트와 테스트할 기능을 바꿔 전달'], prompt: '이 Unity 프로젝트에 ARTEL SDK를 설치하고 연결해 줘.\nARTEL 프로젝트: <프로젝트 이름 또는 ID>\n테스트할 기능: <검증할 기능과 기대 동작>\n\n게임 코드를 확인해 관찰 가능한 행동과 기대결과로 Test Case를 만들어 줘.\n현재 빌드에 맞는 테스트 런과 시나리오를 준비해 줘.\n승인이 필요한 Test Case는 승인 요청을 보내고, 승인 전에는 시나리오에 넣지 마.\n내가 Test Case와 시나리오를 검토할 수 있게 결과를 알려 주고, QA는 아직 실행하지 마.' },
          { id: 'test-cases', title: 'Test Case 검토하기', items: ['에이전트가 작성 결과를 알려주면 콘솔에서 해당 프로젝트 열기', '왼쪽 Test Cases에서 에이전트가 지정한 게임 버전 선택', '승인 대기 항목을 확인하고 Test Case 승인 요청에서 검토 진행'], after: '거절한 항목은 에이전트에 수정 요청. 승인한 Test Case를 시나리오에 연결하고 시나리오도 검토·승인한 뒤 QA 실행.' },
          qa.ko, review.ko, issues.ko,
        ],
      },
    },
  },
  en: {
    title: 'Getting started', description: 'Install the SDK, prepare Test Cases and scenarios, run QA and review verdicts', trackLabel: 'Choose your workflow', stepsLabel: 'Steps',
    tracks: {
      manual: {
        title: 'Set up in the console', description: 'Write Test Cases and scenarios yourself in the console.',
        steps: [
          { id: 'sdk', title: 'Install the SDK', items: ['Sign in to the console and create or join a project.', 'Add the ARTEL SDK through Unity Package Manager.', 'Run the game in Play Mode or as a Development Build, sign in and connect the project.'], links: [{ label: 'SDK installation guide', to: '/sdk' }, { label: 'Open the console', to: 'console' }] },
          { id: 'test-cases', title: 'Create Test Cases', items: ['Choose the project in the console and open Test Cases in the left navigation.', 'Choose the target game version from the version list.', 'Select New Test Case to open the editor.'], after: 'After completing the required fields, select Add Test Case at the bottom of the editor to save.' },
          { id: 'scenarios', title: 'Create scenarios', items: ['Open Test runs in the project’s left navigation.', 'Choose the target build version and select New test run.', 'Create and open the test run, then select Add scenario.'], after: 'Use Add Test Case in the scenario to link the cases to verify. For step-based scenarios, also write the actions and their order, then approve the scenario.' },
          qa.en, review.en, issues.en,
        ],
      },
      agent: {
        title: 'Set up with a coding agent', description: 'Ask your agent to connect the SDK and prepare Test Cases and scenarios.',
        steps: [
          { id: 'plugin', title: 'Install the plugin', items: ['Install the ARTEL plugin in your coding agent.', 'Sign in to ARTEL in the browser and approve the connection.', 'Ask the agent to list your projects to verify the connection.'], links: [{ label: 'Plugin installation guide', to: '/skills' }] },
          { id: 'prepare', title: 'Request SDK, Test Cases and scenarios', items: ['Open the Unity project in your coding agent and specify the ARTEL project and feature to test.', 'Replace the project and feature placeholders in the request below.'], prompt: 'Install and connect the ARTEL SDK in this Unity project.\nARTEL project: <project name or ID>\nFeature to test: <feature and expected behavior>\n\nInspect the game code and create Test Cases with observable actions and expected results.\nPrepare a test run and scenarios for the current build.\nRequest approval for Test Cases that need it; do not add them to scenarios before approval.\nShow me the Test Cases and scenarios for review. Do not run QA yet.' },
          { id: 'test-cases', title: 'Review Test Cases', items: ['When the agent reports its results, open the project in the console.', 'Open Test Cases in the left navigation and select the game version specified by the agent.', 'Find the cases awaiting approval and review the Test Case approval request.'], after: 'Ask the agent to revise rejected cases and link approved cases to the scenarios. Review and approve the scenarios before running QA.' },
          qa.en, review.en, issues.en,
        ],
      },
    },
  },
}
