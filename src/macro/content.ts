import type { Locale } from '../i18n/locale'
import grammar from './grammar.generated.json'
import examples from './examples.json'

export const macroPages = ['quick-start', 'language', 'built-ins', 'execution', 'limits'] as const
export type MacroPageId = typeof macroPages[number]
export const macroPath = (id: MacroPageId) => id === 'quick-start' ? '/macro' : `/macro/${id}`
export type Section = { id: string; title: string; paragraphs: string[]; code?: string; rows?: string[][] }
export type MacroPage = { title: string; description: string; sections: Section[] }

export function macroContent(locale: Locale): Record<MacroPageId, MacroPage> {
  const tr = (ko: string, en: string) => locale === 'ko' ? ko : en
  const section = (id: string, title: string, paragraphs: string[], code?: string, rows?: string[][]): Section => ({ id, title, paragraphs, code, rows })
  const l = grammar.limits
  return {
    'quick-start': {
      title: 'Quick start',
      description: tr('Macro 작성, 등록, 실행 예제', 'Macro authoring, registration and execution examples'),
      sections: [
        section('overview', tr('Macro의 실행 방식', 'How macros run'), [tr('Macro는 Python처럼 쓰는 제한된 DSL입니다. Python 코드로 실행하지 않으며, Python 표준 라이브러리를 사용할 수 없습니다.', 'A macro is a restricted DSL with Python-like syntax. It does not execute as Python and cannot use the Python standard library.'), tr('selector 경로, 객체 이름, label, scene과 member key는 예시이므로 연결한 게임의 실제 값으로 바꾸세요.', 'Selector paths, object names, labels, scenes and member keys are illustrative: replace them with values from your connected game.')]),
        section('first-macro', tr('첫 macro 작성', 'Write your first macro'), [tr('이름은 open_inventory로 지정합니다. 같은 이름의 entry def와 -> None이 필요합니다. 첫 docstring은 등록에 필수이며 검색과 선택에 사용되는 summary가 됩니다.', 'Name this macro open_inventory. The entry def must have the same name and return -> None. Its opening docstring is required for registration and becomes the summary used for discovery and selection.')], examples.open_inventory),
        section('register', tr('초안 저장과 등록', 'Save and register'), [tr('QA agent의 write_macro에 name과 source를 전달하면 draft를 저장하고 문법을 확인합니다. 이 단계에서는 게임을 조작하지 않습니다. register_macro로 등록해야 run_macro가 호출할 수 있습니다.', 'The QA agent tool write_macro accepts name and source, stores a draft and checks syntax without acting on the game. Register it with register_macro before calling run_macro.'), tr('수정은 edit_macro → register_macro 순서입니다. draft만 수정하면 기존 등록 버전이 계속 실행됩니다. screens를 지정할 때는 scene 이름 대신 content map의 screen ID를 사용합니다.', 'Edit with edit_macro, then register_macro. Changing only a draft leaves the previously registered version active. The screens argument uses content-map screen IDs, not scene names.')]),
        section('run', tr('실행과 결과 확인', 'Run and inspect'), [tr('run_macro의 name에 open_inventory를 지정하고, 이 예제처럼 parameter가 없으면 arguments는 빈 객체로 전달합니다. parameter가 있다면 이름별 값을 전달하고 object에는 좌표나 #id 대신 selector를 사용합니다.', 'Call run_macro with name open_inventory and an empty arguments object for this parameterless example. For parameterized macros, supply values by name; object parameters take selectors, not coordinates or #ids.'), tr('결과에서 실행된 action, 건너뛴 branch, flag와 실패 위치를 확인합니다. PAUSED이면 화면을 확인하고 resume_macro의 proceed를 true로 전달해 계속하거나 false로 중단합니다.', 'Inspect actions sent, skipped branches, flags and the failure location. For PAUSED, inspect the screen, then use resume_macro with proceed true to continue or false to stop.')]),
      ],
    },
    language: {
      title: 'Language', description: tr('Macro 타입, 조건문, 반복문, helper, import 문법', 'Syntax for types, conditions, loops, helpers and imports.'),
      sections: [
        section('types', tr('선언과 타입', 'Declarations and types'), [tr('모든 parameter와 대입에는 타입을 명시합니다. 선언할 수 있는 타입은 아래와 같습니다. string은 str과 다릅니다. entry와 action helper는 -> None, predicate는 -> bool을 사용합니다.', 'Every parameter and assignment needs an explicit type. The declarable types are listed below: use string, not str. Entries and action helpers return -> None; predicates return -> bool.'), tr('이름은 한 번만 대입합니다. 대입의 오른쪽에는 find, selector, literal 또는 reader 호출을 사용할 수 있습니다. reader로 읽어 저장한 값은 그 시점의 값이며 자동 갱신되지 않습니다.', 'Names are assigned once. Assignment values may be find, selector, a literal or a reader call. A bound reader value is a snapshot and does not refresh automatically.')], examples.check_damage, grammar.types.map(t => [t, t === 'object' ? tr('게임 객체를 가리키는 target', 'A game-object target') : tr('타입을 명시한 값', 'An explicitly typed value')])),
        section('conditions', tr('조건과 비교', 'Conditions and comparisons'), [tr('조건은 비교 하나, bool reader, predicate 또는 ask 호출 하나입니다. and/or/not과 chained comparison은 허용되지 않습니다. and가 필요하면 require를 나눠 쓰고, or는 predicate의 여러 if로 표현합니다.', 'A condition is one comparison, a boolean reader, a predicate or ask. and/or/not and chained comparisons are not supported. Split conjunctions into separate require calls; express alternatives through multiple if branches in a predicate.'), tr('서로 다른 shape의 비교는 false가 아니라 오류입니다. int와 float는 모두 number로 비교합니다. object의 같음은 객체 identity 기준입니다. 연속값은 소수점 반올림의 영향을 받으므로 == 대신 범위를 검사하세요.', 'Comparing different shapes is an error, not false. int and float both compare as numbers. Object equality uses object identity. For continuous values, check a range instead of == because values are rounded.')], undefined, grammar.operators.map(row => [row.shape, row.operators.join('  ') || tr('비교 불가', 'No comparisons')])),
        section('loops', tr('조건문과 반복문', 'Branches and loops'), [tr('if/elif/else, for name in range(n), for name in find_all(...), while condition을 지원합니다. range는 정수 literal 또는 int 이름을 받습니다. find_all의 목록은 반복 시작 시 한 번 읽으며, 결과가 없으면 0회 실행합니다.', 'Supported forms are if/elif/else, for name in range(n), for name in find_all(...), and while condition. range takes an integer literal or int name. find_all takes a snapshot at loop entry; no matches means zero passes.'), tr('while은 매 반복 전에 조건을 다시 읽습니다. loop 변수와 내부에서 선언한 이름은 loop 밖에서 사용할 수 없습니다. break, continue와 loop의 else는 지원하지 않습니다.', 'while re-reads its condition before each pass. Loop variables and names declared inside a loop are unavailable outside it. break, continue and loop else are not supported.')], examples.select_cards),
        section('while', tr('while과 range 예제', 'while and range example'), [tr('정해진 횟수는 range를 사용합니다. while은 조건이 바뀌지 않으면 실행 상한에서 멈춥니다.', 'Use range for a fixed count. A while loop whose condition never changes stops at the execution limit.')], examples.dismiss_dialogue),
        section('predicates', 'Predicates', [tr('-> bool 함수에는 typed assignment, if/elif/else, return만 둘 수 있습니다. 모든 경로에서 bool literal 또는 조건을 반환해야 합니다. action, require, wait, checkpoint와 ask는 사용할 수 없습니다.', 'A -> bool function contains only typed assignments, if/elif/else and return. Every path must return a boolean literal or condition. Actions, require, waiting, checkpoints and ask are not allowed.')], examples.open_ready),
        section('imports', tr('Helper와 import', 'Helpers and imports'), [tr('같은 소스의 다른 def는 helper입니다. nested def는 허용되지 않습니다. from macros import ...는 소스 맨 위에 쓰며, 등록된 macro만 가져올 수 있습니다. 다른 module과 import alias는 지원하지 않습니다.', 'Other top-level defs in the source are helpers; nested defs are not allowed. Place from macros import ... at the top and import only registered macros. Other modules and import aliases are unsupported.'), tr('아래 예제는 Quick start의 open_inventory를 먼저 등록해야 합니다. import한 macro는 호출 시점의 등록 버전을 사용하며 호출 깊이와 statement 수는 전체 호출에 합산됩니다.', 'Register open_inventory from Quick start before using this example. Imports use the registered version at call time; nested calls contribute to the total depth and statement budgets.')], examples.inspect_inventory),
      ],
    },
    'built-ins': {
      title: 'Built-ins', description: tr('Macro 객체 탐색, reader, action reference', 'Signatures for target lookup, state readers and game actions.'),
      sections: [
        section('targets', tr('객체 탐색', 'Target lookup'), [tr('find는 keyword만 받으며 label 또는 name 중 하나 이상이 필요합니다. label은 표시 텍스트, name은 selector의 마지막 segment, under는 경로 prefix입니다. 0개 또는 여러 객체가 일치하면 실행이 멈춥니다.', 'find accepts keywords only and requires label or name. label matches visible text; name matches the last selector segment; under narrows by path prefix. Zero or multiple matches stop execution.'), tr('selector는 게임의 hierarchy path를 받습니다. find_all은 loop 또는 Jev context에서 사용하며 일반 변수에 list로 저장할 수 없습니다. under는 ask/decide context에서 해당 객체와 하위 객체를 포함합니다.', 'selector takes a game hierarchy path. find_all is available in loops or Jev context, not as a list assignment. under includes an object and its descendants in ask/decide context.')], undefined, [
          ['find(label=..., name=..., under=...)', 'object'], ['selector("hierarchy/path")', 'object'], ['find_all(label=..., name=..., under=...)', tr('loop / Jev context 전용', 'Loops / Jev context only')], ['under("path") / under(target)', 'Jev context'],
        ]),
        section('readers', tr('상태 읽기', 'State readers'), [tr('reader는 게임을 조작하지 않습니다. 조건에서는 현재 상태를 읽고, typed assignment에서는 한 번 읽은 값을 저장합니다. member/observable/static의 실제 반환 타입은 게임에 따라 달라집니다.', 'Readers do not act on the game. Conditions read current state; typed assignments capture a value once. Actual return types of member/observable/static depend on the game.')], undefined, grammar.readers.map(r => [r.signature, readerDescription(r.name, locale)])),
        section('actions', tr('게임 조작', 'Game actions'), [tr('target은 object parameter, find/selector로 선언한 이름, 또는 selector(...)를 사용합니다. 좌표와 #id는 지원하지 않습니다.', 'Targets may be object parameters, names bound by find/selector, or selector(...). Coordinates and #ids are not supported.'), tr('press_key의 duration_seconds는 필수입니다. enter_text는 macro 안에서 object target을 받고 runner가 instance ID로 변환합니다. hold/release와 pause/resume은 모든 실행 경로에서 짝을 맞춰야 합니다.', 'duration_seconds is required for press_key. enter_text accepts an object target and the runner resolves its instance ID. Pair hold/release and pause/resume along every execution path.')], undefined, grammar.actions.map(a => [a.signature, actionDescription(a.name, locale)])),
      ],
    },
    execution: {
      title: 'Execution', description: tr('require, wait_until, checkpoint, ask, decide 실행 규칙', 'Execution rules for require, wait_until, checkpoint, ask and decide'),
      sections: [
        section('checks', tr('검증과 기다리기', 'Checks and waiting'), [tr('require(condition, "remedy")는 현재 조건을 확인하고 false이면 멈춥니다. remedy는 agent가 실패 후 무엇을 해야 하는지 설명하는 필수 문자열입니다.', 'require(condition, "remedy") checks the current condition and stops if false. The required remedy string tells the agent what to do after failure.'), tr(`wait_until(condition, seconds, "remedy")는 즉시 확인한 뒤 새 pulse마다 다시 확인합니다. seconds는 0보다 크고 ${l.MAX_WAIT_PER_STATEMENT_SECONDS} 이하인 숫자 literal입니다. ask는 조건으로 쓸 수 없습니다. 한 run/resume 호출의 총 대기 상한은 ${l.MAX_WAIT_PER_CALL_SECONDS}초입니다.`, `wait_until(condition, seconds, "remedy") checks immediately, then on each new pulse. seconds must be a numeric literal greater than zero and at most ${l.MAX_WAIT_PER_STATEMENT_SECONDS}. ask is not allowed here. Total waiting per run/resume call is capped at ${l.MAX_WAIT_PER_CALL_SECONDS} seconds.`)], examples.open_inventory),
        section('checkpoint', tr('중지와 판정 요청', 'Pauses and verdict requests'), [tr('checkpoint("message")는 실패가 아닌 PAUSED를 반환합니다. resume_macro(proceed=true)는 저장된 binding을 유지하고 다음 줄부터 계속하며, false는 추가 조작 없이 중단합니다.', 'checkpoint("message") returns PAUSED rather than failure. resume_macro with proceed=true preserves bindings and continues at the next line; false stops without further actions.'), tr('flag("message")는 관찰 내용을 남기고 ask_verdict("expected")는 현재 step의 판정이 필요함을 알립니다. macro가 verdict를 직접 결정하거나 report_step/report_case/report_issue를 호출하지는 않습니다.', 'flag("message") records an observation; ask_verdict("expected") requests judgment for the current step. Macros do not decide verdicts or call report_step/report_case/report_issue.')], examples.inspect_inventory),
        section('decide', 'match decide', [tr(`decide는 match에서만 사용합니다. case는 import한 macro 이름이며 최소 ${l.MIN_MATCH_CASES}개가 필요합니다. case _와 guard는 금지입니다. Jev는 각 macro의 docstring을 읽고 선택합니다.`, `decide is only valid inside match. Cases name imported macros; at least ${l.MIN_MATCH_CASES} are required. Wildcard cases and guards are forbidden. Jev reads each macro's docstring to choose.`), tr('아래 두 macro는 앞선 예제에서 먼저 등록해야 합니다. none_fits를 선택하면 PAUSED가 됩니다. 필요한 조작을 직접 수행한 뒤 resume하면 match 다음부터 계속합니다. 모델이 응답하지 못하면 JEV_FAILED로 멈춥니다.', 'Register both imported macros from the preceding examples first. A none_fits decision pauses execution. After handling that part manually, resume continues after the match. A model failure stops with JEV_FAILED.')], examples.choose_action),
        section('ask', 'ask', [tr(`ask는 Jev의 yes 확률이 ${l.ASK_TRUE_AT} 이상이면 true입니다. if/elif/while/require의 전체 조건으로만 쓰고, 비교·predicate·wait_until 안에는 쓸 수 없습니다. 읽을 수 있는 상태는 reader로 확인하세요.`, `ask is true when Jev assigns yes a probability of at least ${l.ASK_TRUE_AT}. It must be the entire condition of if/elif/while/require, not a comparison, predicate or wait_until condition. Prefer readers for directly observable state.`), tr(`keyword는 모델에게 보여줄 context입니다. 생략하면 화면의 모든 객체를 읽습니다. scene은 예약된 key입니다. context 값당 ${l.MAX_CONTEXT_VALUE_CHARS}자, 전체 ${l.MAX_DECIDE_STATE_CHARS}자로 제한되므로 필요한 객체만 전달하세요.`, `Keywords supply model context; without keywords it reads all screen objects. scene is reserved. Context is limited to ${l.MAX_CONTEXT_VALUE_CHARS} characters per value and ${l.MAX_DECIDE_STATE_CHARS} overall, so pass the relevant objects.`)], examples.check_layout),
        section('pairs', tr('입력과 game time 해제', 'Release inputs and game time'), [tr('hold_key/release_key, hold_mouse_button/release_mouse_button, pause_game_time/resume_game_time은 같은 branch와 loop pass에서 짝을 맞춥니다. hold와 release 사이에 checkpoint 또는 match를 둘 수 없습니다. game time을 멈춘 동안 wait_until도 금지입니다.', 'Pair hold_key/release_key, hold_mouse_button/release_mouse_button and pause_game_time/resume_game_time in the same branch and loop pass. Do not place checkpoint or match between a hold and release, or wait_until while game time is paused.')], examples.hold_and_release),
      ],
    },
    limits: {
      title: 'Limits & errors', description: tr('Macro 실행 상한과 오류 코드', 'Macro execution limits and error codes'),
      sections: [
        section('budgets', tr('실행 상한', 'Execution budgets'), [tr('상한으로 멈춰도 이미 게임에 전달한 action은 되돌리지 않습니다.', 'Reaching a limit does not undo actions already sent to the game.')], undefined, [
          [tr('가장 긴 경로의 statement 수 (loop body 1회)', 'Statements on longest path (loop body counted once)'), String(l.MAX_STATEMENTS)],
          [tr('entry와 import를 포함한 호출 깊이', 'Call depth including entry and imports'), String(l.MAX_CALL_DEPTH)],
          [tr('loop 반복 횟수', 'Loop passes'), String(l.MAX_LOOP_PASSES)],
          [tr('호출당 실행 statement 수', 'Executed statements per call'), String(l.MAX_EXECUTED_STATEMENTS)],
          ['wait_until', `${l.MAX_WAIT_PER_STATEMENT_SECONDS}s`], ['run_macro / resume_macro', `${l.MAX_WAIT_PER_CALL_SECONDS}s ${tr('총 대기', 'total waiting')}`],
        ]),
        section('unsupported', tr('지원하지 않는 문법', 'Unsupported syntax'), [tr('산술, 재대입, and/or/not, attribute 접근(card.id), list, lambda, f-string, nested def, 일반 Python import, predicate 밖의 return, break, continue와 loop else는 허용되지 않습니다. 독립 문자열은 docstring 위치에서만 허용됩니다.', 'Arithmetic, reassignment, and/or/not, attribute access (card.id), lists, lambdas, f-strings, nested defs, general Python imports, return outside predicates, break, continue and loop else are not allowed. Standalone strings are allowed only as docstrings.'), tr('click_button은 deprecated이며 click을 사용합니다. reset_game과 report_step/report_case/report_issue는 macro에서 사용할 수 없습니다.', 'click_button is deprecated; use click. reset_game and report_step/report_case/report_issue are not available in macros.')]),
        section('errors', tr('오류와 다음 조치', 'Errors and remedies'), [tr('실패 코드만 보고 게임 결함으로 단정하지 마세요. 실패한 줄, remedy, 현재 화면과 결과의 readings를 함께 확인합니다.', 'Do not infer a game defect from an error code alone. Inspect the line, remedy, current screen and result readings.')], undefined, [
          ['MACRO_NODE_REJECTED', tr('문법·타입·이름·상한을 확인하고 draft를 수정합니다.', 'Fix the draft syntax, types, names or limits.')],
          ['SCENE_MISMATCH / REQUIRE_FAILED', tr('require 조건과 remedy를 확인합니다. action 전 조건 실패는 SCENE_MISMATCH입니다.', 'Inspect the require condition and remedy. A failed check before actions is SCENE_MISMATCH.')],
          ['SELECTOR_NOT_FOUND / SELECTOR_AMBIGUOUS', tr('selector를 확인하고 name/label/under로 대상을 좁힙니다.', 'Check the selector; narrow the target with name/label/under.')],
          ['STALE_BINDING', tr('이전에 찾은 객체가 사라졌습니다. 화면을 확인하고 다시 실행합니다.', 'A bound object disappeared. Inspect the screen before rerunning.')],
          ['COMPARISON_REJECTED', tr('실제 값의 shape와 허용 operator를 확인합니다.', 'Check runtime value shapes and allowed operators.')],
          ['LOOP_LIMIT', tr('loop 종료 조건과 실행 statement 수를 확인합니다.', 'Review loop termination and the executed statement budget.')],
          ['WAIT_TIMEOUT', tr('대기 조건과 pulse 수신을 확인합니다. readings가 0이면 새 pulse가 없었습니다.', 'Check the condition and pulse delivery. Zero readings means no new pulse arrived.')],
          ['JEV_FAILED', tr('모델 연결·설정과 응답을 확인합니다.', 'Check model connectivity, configuration and response.')],
          ['ACTION_REJECTED', tr('조작 대상과 호출 환경을 확인합니다.', 'Check the target and execution environment.')],
          ['SCREEN_UNCHANGED', tr('조작 후 화면이 바뀌지 않은 이유를 확인합니다.', 'Inspect why the screen did not change after actions.')],
          ['OPERATOR_INTERRUPTED', tr('operator의 새 요청을 먼저 확인합니다.', 'Read the operator’s new request before continuing.')],
        ]),
      ],
    },
  }
}

function actionDescription(name: string, locale: Locale): string {
  const descriptions: Record<string, [string, string]> = {
    click: ['대상으로 포인터를 옮기고 누른 뒤 놓습니다.', 'Move to the target, press and release.'],
    double_click: ['대상에서 두 번 누르고 놓습니다.', 'Press and release twice at the target.'],
    drag: ['시작 대상을 누르고 끝 대상으로 이동한 뒤 놓습니다.', 'Press at the source, move to the destination and release.'],
    move_pointer: ['포인터를 대상으로 이동합니다.', 'Move the pointer to the target.'],
    press_key: ['지정 시간 동안 key를 누릅니다.', 'Press a key for the specified duration.'],
    enter_text: ['입력 대상에 문자열을 전달합니다.', 'Send a string to the input target.'],
    hold_mouse_button: ['mouse button을 누른 상태로 둡니다.', 'Hold a mouse button.'],
    release_mouse_button: ['누른 mouse button을 놓습니다.', 'Release a held mouse button.'],
    hold_key: ['key를 누른 상태로 둡니다.', 'Hold a key.'], release_key: ['누른 key를 놓습니다.', 'Release a held key.'],
    set_input_axis: ['이름으로 Input axis 값을 설정합니다.', 'Set a named Input axis value.'],
    set_input_button: ['이름으로 Input button 상태를 설정합니다.', 'Set a named Input button state.'],
    pause_game_time: ['game time을 멈춥니다.', 'Pause game time.'], resume_game_time: ['game time을 다시 진행합니다.', 'Resume game time.'],
  }
  return descriptions[name]?.[locale === 'ko' ? 0 : 1] ?? name
}

function readerDescription(name: string, locale: Locale): string {
  const descriptions: Record<string, [string, string]> = {
    scene: ['현재 scene 이름', 'Current scene name'], observable: ['공개된 observable key의 값', 'Value of an exposed observable key'],
    static: ['공개된 static key의 값', 'Value of an exposed static key'], member: ['객체에 공개된 member key의 값', 'Value of an exposed object member key'],
    actionable: ['대상을 조작할 수 있는지 확인', 'Whether the target is actionable'], text: ['대상이 표시하는 텍스트', 'Text displayed by the target'],
    exists: ['대상이 존재하는지 확인', 'Whether the target exists'], absent: ['대상이 없는지 확인', 'Whether the target is absent'],
  }
  return descriptions[name]?.[locale === 'ko' ? 0 : 1] ?? name
}
