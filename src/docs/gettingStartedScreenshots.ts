import type { GuideScreenshot, ScreenshotAnnotation } from '../components/AnnotatedScreenshot'
import addPackage from '../assets/sdk-guide/step1-add-package-from-git-url.png'
import gitUrl from '../assets/sdk-guide/step1-git-url-input.png'
import sdkLogin from '../assets/sdk-guide/step2-sdk-sign-in-screen.png'
import browserLogin from '../assets/sdk-guide/step3-browser-sign-in.png'
import projectPicker from '../assets/sdk-guide/step4-sdk-project-picker.png'
import connected from '../assets/sdk-guide/step4-instance-connected.png'
import verdict from '../assets/getting-started/verdict-review.png'
import issue from '../assets/getting-started/issue-detail.png'
import approval from '../assets/getting-started/test-case-approval.png'
import caseEditor from '../assets/getting-started/test-case-editor.jpg'
import runCreate from '../assets/getting-started/test-run-create.jpg'
import scenarioType from '../assets/getting-started/scenario-type.jpg'
import scenarioCases from '../assets/getting-started/scenario-cases.jpg'
import qaSettings from '../assets/getting-started/qa-settings.jpg'

function screenshot(src: string, width: number, height: number, ko: string, en: string, regions: { box: [number, number, number, number]; ko: string; en: string }[], displayWidth?: number): GuideScreenshot {
  const annotations: ScreenshotAnnotation[] = regions.map(({ box, ko, en }) => ({ box: [box[0] / width * 100, box[1] / height * 100, box[2] / width * 100, box[3] / height * 100], text: { ko, en } }))
  return { src, width, height, title: { ko, en }, annotations, displayWidth }
}

export const sdkScreenshots: GuideScreenshot[][] = [
  [
    screenshot(addPackage, 820, 498, 'Package Manager 메뉴', 'Package Manager menu', [
      { box: [204, 116, 65, 40], ko: 'Package Manager에서 + 메뉴 열기', en: 'Open the + menu in Package Manager.' },
      { box: [211, 254, 334, 48], ko: 'Add package from git URL 선택', en: 'Choose Add package from git URL.' },
    ]),
    screenshot(gitUrl, 1090, 518, 'SDK 패키지 주소 입력', 'SDK package URL', [
      { box: [169, 153, 913, 38], ko: '위의 SDK 주소를 입력하고 Enter로 패키지 추가', en: 'Paste the SDK URL above and press Enter to add the package.' },
    ]),
  ],
  [screenshot(sdkLogin, 480, 420, '게임에서 SDK 로그인', 'SDK sign-in in the game', [
    { box: [27, 168, 426, 40], ko: '로그인 선택 후 열린 브라우저에서 인증 진행', en: 'Select Sign in and authenticate in the browser.' },
  ], 480)],
  [screenshot(browserLogin, 840, 1264, '브라우저에서 SDK 승인', 'Approve the SDK in the browser', [
    { box: [81, 541, 677, 374], ko: '이메일·비밀번호로 로그인', en: 'Sign in with your email and password.' },
    { box: [81, 1020, 677, 89], ko: 'GitHub 계정으로 계속을 선택해 로그인하는 방법도 가능', en: 'Alternatively, sign in with Continue with GitHub.' },
  ], 420)],
  [
    screenshot(projectPicker, 480, 420, '게임을 연결할 프로젝트 선택', 'Choose a project for the game', [
      { box: [27, 150, 426, 75], ko: '이 게임을 연결할 ARTEL 프로젝트 선택', en: 'Choose the ARTEL project for this game.' },
    ], 480),
    screenshot(connected, 1004, 454, '게임 연결 상태 확인', 'Check the game connection', [
      { box: [40, 132, 382, 43], ko: '콘솔의 게임 인스턴스에서 연결됨 표시 확인', en: 'Check that the game instance shows Connected in the console.' },
      { box: [669, 42, 137, 61], ko: '상태가 바뀌지 않으면 새로고침 후 다시 확인', en: 'Refresh the list if the connection status has not updated.' },
    ], 502),
  ],
]

export const walkthroughScreenshots = {
  caseEditor: screenshot(caseEditor, 1829, 943, 'Test Case 작성', 'Write a Test Case', [
    { box: [1081, 98, 548, 78], ko: '사전 조건에 검증을 시작하기 전의 게임 상태 입력', en: 'Enter the game state required before the test in Preconditions.' },
    { box: [1081, 207, 548, 76], ko: '테스트 내용에 게임에서 수행할 행동 입력', en: 'Enter the in-game action under Test content.' },
    { box: [1081, 314, 548, 76], ko: '기대 결과에 통과를 확인할 수 있는 화면·값·동작 입력', en: 'Enter an observable screen, value or behavior as the expected result.' },
    { box: [1044, 426, 586, 171], ko: '대상 버전과 이 Test Case가 확인할 화면 선택', en: 'Choose the target version and the screen this Test Case verifies.' },
  ]),
  runCreate: screenshot(runCreate, 1829, 943, '테스트 런 생성', 'Create a test run', [
    { box: [585, 354, 477, 44], ko: '테스트 런 이름 입력', en: 'Enter the test run name.' },
    { box: [585, 428, 250, 37], ko: '대상 빌드 버전 확인, 필요하면 바꾸기 선택', en: 'Check the target build version; use Change if needed.' },
    { box: [989, 469, 72, 40], ko: '만들기로 테스트 런 생성', en: 'Select Create to create the test run.' },
  ]),
  scenarioType: screenshot(scenarioType, 1829, 943, '시나리오 유형 선택', 'Choose a scenario type', [
    { box: [588, 377, 229, 79], ko: '단계 기반은 작성한 순서대로 행동과 검증을 진행', en: 'Step-based scenarios run actions and checks in the order you write.' },
    { box: [828, 377, 232, 79], ko: 'Test Case 기반은 선택한 Test Case의 실행 순서와 방법을 에이전트가 결정', en: 'For Test Case-based scenarios, the agent chooses how and in what order to verify the selected cases.' },
  ]),
  scenarioCases: screenshot(scenarioCases, 1829, 943, '시나리오와 Test Case 확인', 'Inspect scenarios and Test Cases', [
    { box: [228, 60, 252, 109], ko: '왼쪽에서 시나리오 선택, +로 시나리오 추가', en: 'Select a scenario on the left; use + to add one.' },
    { box: [625, 150, 841, 149], ko: '시나리오에 들어간 Test Case의 행동과 기대 결과 확인', en: 'Check the actions and expected results of the Test Cases included in the scenario.' },
    { box: [1341, 70, 140, 31], ko: 'Test Case 기반 표시를 확인하고 이 유형에서는 실행 순서를 에이전트에 맡김', en: 'The Test Case-based label means the agent decides the execution order.' },
  ]),
  qa: screenshot(qaSettings, 1829, 943, 'QA 실행 설정', 'QA run settings', [
    { box: [240, 81, 969, 87], ko: '검증할 테스트 런 선택', en: 'Choose the test run to verify.' },
    { box: [1306, 258, 321, 53], ko: 'SDK가 연결된 게임 선택. 연결 안 됨이면 게임부터 실행', en: 'Choose a connected game. If it is disconnected, start the game first.' },
    { box: [1307, 352, 320, 45], ko: '사용할 에이전트 모델 선택', en: 'Choose the agent model.' },
    { box: [1306, 688, 321, 106], ko: '실행 전 점검에서 게임 연결·시나리오·모델 키 확인 후 QA 실행', en: 'Check the game connection, scenarios and model key before starting QA.' },
  ]),
  approval: screenshot(approval, 1420, 887, 'MCP가 만든 Test Case 검토', 'Review Test Cases created through MCP', [
    { box: [375, 196, 139, 24], ko: '검토할 Test Case 선택. 개별 항목의 체크로 선택 범위 변경', en: 'Select the Test Cases to review. Use the individual checkboxes to change the selection.' },
    { box: [410, 263, 619, 116], ko: '사전 조건·테스트 내용·기대 결과가 실제 게임과 맞는지 확인', en: 'Check the preconditions, test content and expected results against the game.' },
    { box: [860, 728, 87, 38], ko: '잘못 작성된 항목은 선택 후 거절', en: 'Select and reject incorrect cases.' },
    { box: [958, 728, 87, 38], ko: '확인한 항목 승인. 승인한 Test Case만 시나리오와 QA에 사용하며, 체크를 푼 항목은 승인 대기로 유지', en: 'Approve the cases you have checked. Only approved cases are used in scenarios and QA; unchecked cases remain pending.' },
  ]),
  review: screenshot(verdict, 1840, 1077, 'Test Case 판정 검토', 'Review Test Case verdicts', [
    { box: [80, 119, 1740, 96], ko: '검토할 Test Case 선택', en: 'Choose a Test Case to review.' },
    { box: [1134, 405, 690, 197], ko: '사전 조건·검증 절차·기대 결과 확인', en: 'Read its preconditions, procedure and expected result.' },
    { box: [90, 264, 851, 113], ko: 'Agent 판정과 판단 근거 확인', en: 'Read the agent verdict and its reasoning.' },
    { box: [80, 450, 1033, 585], ko: '리플레이를 재생해 실제 동작과 기대 결과 비교', en: 'Play the replay and compare the actual behavior with the expected result.' },
    { box: [1135, 680, 196, 28], ko: 'Test Case 자체의 내용이 잘못된 경우에만 내용 문제 선택', en: 'Mark a Test Case content problem only if the specification itself is wrong.' },
    { box: [1134, 741, 691, 184], ko: '사람 평가에서 통과·실패·판단 불가 선택, 필요하면 이유 입력', en: 'Choose Pass, Fail or Unable to judge under Human evaluation, and optionally enter a reason.' },
    { box: [1744, 939, 81, 36], ko: '판정 저장으로 평가 반영', en: 'Select Save verdict to record the evaluation.' },
  ]),
  issues: screenshot(issue, 1845, 1002, '이슈 확인과 관리', 'Inspect and manage issues', [
    { box: [465, 601, 920, 108], ko: 'Test Case 실패 이력에서 Agent 판정과 사람 평가 확인. Test Case 열기로 명세 확인', en: 'Compare agent and human verdicts in the failure history. Open the Test Case to inspect its specification.' },
    { box: [465, 437, 920, 130], ko: '나온 자리에서 빌드·시나리오·실행 시점 확인', en: 'Check the originating build, scenario and execution time.' },
    { box: [552, 362, 80, 36], ko: '실행 열기로 원래 QA 실행과 기록 확인', en: 'Open the originating QA run and inspect its records.' },
    { box: [465, 307, 920, 42], ko: '카테고리를 지정해 이슈 분류', en: 'Assign a category to organize the issue.' },
    { box: [465, 362, 79, 36], ko: '문제 수정과 재검증 후 해결 처리', en: 'Resolve the issue after fixing and verifying the problem.' },
    { box: [640, 362, 154, 36], ko: '보관으로 목록 정리, 내보내기로 이슈 전달', en: 'Archive the issue to tidy the list, or export it to share it.' },
  ]),
}
