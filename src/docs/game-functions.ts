import type { Locale } from '../i18n/locale'
import type { DocPage } from './content'

export function gameFunctionDocs(locale: Locale): DocPage[] {
  const tr = (ko: string, en: string) => locale === 'ko' ? ko : en
  const group = tr('게임 기능 구현', 'Game integration')
  const source = 'https://github.com/project-artel/artel-sdk/blob/954b540/Packages/kr.artel.sdk/'
  const setup = tr(
    'GameFunctions를 포함한 SDK를 설치하고 Unity Editor 또는 Development Build에서 실행합니다. Runtime/GameFunctions/ArtelCheatAttribute.cs와 ArtelBehaviorAttribute.cs가 있는지 확인하세요. 코드는 Artel.Runtime을 참조하는 assembly에 둡니다. Assembly-CSharp는 기본으로 참조하며, 자체 asmdef는 참조를 추가해야 합니다.',
    'Install an SDK with GameFunctions and run in the Unity Editor or a Development Build. Check for Runtime/GameFunctions/ArtelCheatAttribute.cs and ArtelBehaviorAttribute.cs. Put the code in an assembly referencing Artel.Runtime. Assembly-CSharp references it by default; add the reference to a custom asmdef.')
  const guard = tr(
    'using부터 클래스 끝까지 #if ARTEL_GAME_FUNCTIONS로 감싸세요. SDK가 define을 관리하므로 직접 추가하지 않습니다. 감싼 클래스는 파일 밖에서 참조하지 마세요. release build에서는 attribute 등록과 원격 실행이 비활성화됩니다. 이 define은 SDK 기능의 존재를 나타내며 게임 코드 전체를 release에서 제거하는 보안 경계는 아닙니다.',
    'Wrap the whole file, including using directives, in #if ARTEL_GAME_FUNCTIONS. The SDK manages the define; do not add it manually or reference the wrapped class from outside the file. Attribute registration and remote execution are disabled in release builds. This define indicates SDK feature availability; it is not a security boundary that removes all game code from a release.')
  return [
    { path: '/docs/cheats', title: tr('Cheat 구현', 'Implement cheats'), description: tr('테스트 사전조건을 만드는 C# 함수 등록과 검증', 'Register and verify C# functions that prepare test preconditions.'), group, sections: [
      { id: 'purpose', title: tr('Cheat 사용 범위', 'When to use a cheat'), paragraphs: [tr('Cheat는 SDK를 통해 한 번 호출해 게임 상태를 바꾸는 C# 메서드입니다. stage 해금, 체력 회복, 테스트용 아이템 지급처럼 테스트 사전조건을 준비할 때 사용합니다. 테스트가 확인할 결과를 직접 만들거나 성공 판정을 대신하지 마세요.', 'A cheat is a C# method called once through the SDK to change game state. Use it to unlock a stage, restore health, or grant test items as preconditions. Do not create the result being tested or replace the test verdict.'), tr('게임 규칙대로 계속 공격하거나 턴을 진행하려면 Behavior를, 화면 조작과 확인 절차를 재사용하려면 Macro를 사용합니다. TC에서 허용하지 않은 Cheat는 호출할 수 없습니다.', 'Use a behavior for ongoing attacks or turns through game rules, and a macro to reuse interaction and verification steps. A cheat cannot run when the test case does not allow it.')], links: [{ label: tr('Behavior 구현', 'Implement behaviors'), to: '/docs/behaviors' }, { label: 'Macro reference', to: '/macro' }] },
      { id: 'setup', title: tr('SDK와 빌드 설정', 'SDK and build setup'), paragraphs: [setup, guard], links: [{ label: tr('SDK 설치', 'Install the SDK'), to: '/docs/installation' }, { label: 'SDK GameFunctions reference', to: source + 'README.md#cheats-and-behaviors-for-the-qa-agent' }] },
      { id: 'example', title: tr('상태 변경 함수 작성', 'Write a state-changing function'), paragraphs: [tr('아래 코드는 게임별로 수정하는 예제입니다. Wallet은 SDK API가 아니라 게임의 지갑 클래스를 가리키는 예시 이름입니다. Instance, Gold, Add, Save를 실제 저장·갱신 API로 바꾸세요. UI가 호출하는 기존 게임 메서드를 재사용하면 이벤트와 저장 상태도 함께 갱신할 수 있습니다.', 'Adapt this example to your game. Wallet is a placeholder for your game wallet, not an SDK API. Replace Instance, Gold, Add, and Save with your real update and persistence APIs. Reuse existing game methods so events and saved state update together.')], language: 'C#', code: `#if ARTEL_GAME_FUNCTIONS
using Artel;

public static class WalletQaCheats
{
    [ArtelCheat("Adds gold to prepare a purchase test and saves the wallet.",
        when: nameof(HasWallet))]
    static string GiveGold([CheatRange(1, 10000)] int amount)
    {
        var wallet = Wallet.Instance;
        wallet.Add(amount);
        wallet.Save();
        return $"gold={wallet.Gold}";
    }

    static string HasWallet() =>
        Wallet.Instance == null ? "no wallet loaded" : null;
}
#endif` },
      { id: 'contract', title: tr('등록과 parameter 규칙', 'Registration and parameter rules'), paragraphs: [tr('SDK weaver가 컴파일 시 attribute를 찾아 직접 호출하는 등록 코드를 생성합니다. 일반적인 attribute 방식에는 별도 Register 호출이 필요하지 않습니다. description에는 변경할 상태와 사용 가능한 화면을 적으세요.', 'The SDK weaver generates direct-call registration code from attributes at compile time. Attribute-based methods need no separate Register call. Describe the state change and where the method is usable.')], rows: [
        ['name', tr('GiveGold → give_gold. name:으로 지정 가능하며 중복 이름은 오류', 'GiveGold → give_gold. Override with name:; duplicate names are errors')],
        ['parameters', tr('int, float, bool, string, enum. 숫자는 CheatRange로 제한하고 닫힌 값 집합은 enum 사용. C# 기본값은 optional parameter', 'int, float, bool, string, enum. Constrain numbers with CheatRange and closed sets with enums. C# defaults make parameters optional')],
        ['return', tr('void, string 또는 IEnumerator. string은 결과 message, IEnumerator는 scene load 등 대기 작업', 'void, string, or IEnumerator. A string becomes the result message; use IEnumerator for waiting, such as scene loading')],
        ['when', tr('같은 타입의 parameter 없는 bool/string 메서드. true, null 또는 빈 문자열이면 가능, false 또는 비어 있지 않은 문자열이면 불가. 주기적 확인과 호출 시 검사에 쓰이므로 부작용 없이 작성', 'A parameterless bool/string method on the same type. true, null, or an empty string means available; false or a non-empty string means unavailable. Keep it free of side effects: it is polled and checked on invocation')],
        ['target', tr('instance 메서드는 MonoBehaviour에 선언. 활성 instance가 여럿이면 selector로 대상 지정. static 메서드에는 target을 전달하지 않음', 'Declare instance methods on a MonoBehaviour. Select a target by selector when multiple active instances exist. Do not pass a target to static methods')],
      ] },
      { id: 'invoke', title: tr('호출과 결과 확인', 'Invoke and verify'), paragraphs: [tr('SDK 연결 시 GAME_FUNCTION_CATALOG에 give_gold와 amount 범위가 등록되는지 확인합니다. 아래 JSON은 agent의 invoke_cheat가 SDK로 전달하는 ACTION item 형태이며 CLI 명령이나 공개 HTTP endpoint가 아닙니다. args에는 C# parameter 이름을 그대로 사용합니다.', 'After SDK connection, check that GAME_FUNCTION_CATALOG contains give_gold and the amount range. The JSON below is the SDK ACTION item sent by the agent invoke_cheat tool, not a CLI command or public HTTP endpoint. Use the C# parameter names in args.'), tr('해당 Cheat를 허용한 짧은 QA 시나리오를 실행하고 invoke_cheat 결과 message와 실제 게임 화면·저장값을 함께 확인합니다. 범위를 벗어난 값, 지갑 없는 scene, 금지한 TC에서도 각각 거절되는지 확인하세요. TC 본문에서는 원래 구매 조작과 잔액 검증을 수행합니다.', 'Run a short QA scenario allowing this cheat and compare the invoke_cheat result message with the game screen and saved value. Also check rejection for out-of-range values, scenes without a wallet, and disallowed test cases. Perform the actual purchase and balance verification in the test steps.')], language: 'JSON', code: '{"method":"invoke_cheat","params":[{"name":"give_gold","args":{"amount":100}}]}', links: [{ label: tr('QA 실행', 'Run QA'), to: '/docs/qa' }] },
      { id: 'dynamic', title: tr('데이터 기반 등록과 scene 이동', 'Data-driven registration and scene changes'), paragraphs: [tr('데이터로 만드는 Cheat는 ArtelCheats.Register(name, description, parameters, handler)와 Unregister(name)을 사용할 수 있습니다. Register는 성공 여부를 bool로 반환하며 중복 이름은 등록하지 않습니다. handler는 검증된 CheatArgs를 받고 null, string 또는 IEnumerator를 반환합니다. scene 단위 등록은 종료 때 해제해 이전 scene 객체를 계속 참조하지 않도록 하세요.', 'For data-driven cheats, use ArtelCheats.Register(name, description, parameters, handler) and Unregister(name). Register returns a bool and rejects duplicate names. The handler receives validated CheatArgs and returns null, string, or IEnumerator. Unregister scene-scoped cheats on teardown to avoid retaining objects from an old scene.'), tr('scene을 바로 여는 Cheat는 건너뛴 경로에서 만들던 singleton, stage 선택, save 상태도 준비해야 합니다. SceneManager.LoadScene 호출만으로 정상 진입과 같은 상태가 된다고 가정하지 마세요. 대기하는 IEnumerator Cheat는 60초 이내에 끝나도록 작성합니다.', 'A scene-jump cheat must also prepare singletons, stage selection, and saved state normally created by the skipped path. Do not assume SceneManager.LoadScene alone reproduces normal entry. An IEnumerator cheat must finish within 60 seconds.')], links: [{ label: 'ArtelCheats API', to: source + 'Runtime/GameFunctions/ArtelCheats.cs' }] },
      { id: 'troubleshooting', title: tr('등록·호출 오류 확인', 'Troubleshoot registration and calls'), paragraphs: [tr('SDK를 Editor가 닫힌 상태에서 제거했거나 오래된 SDK에 define만 남으면 CS0246이 발생할 수 있습니다. SDK를 갱신하거나 Player Settings의 Scripting Define Symbols에서 남은 ARTEL_GAME_FUNCTIONS를 제거하세요. SDK가 정상 설치된 상태에서는 define을 직접 관리하지 않습니다.', 'CS0246 can occur if the SDK was removed while the Editor was closed, or if an old SDK retains the define. Update the SDK or remove the stale ARTEL_GAME_FUNCTIONS from Player Settings → Scripting Define Symbols. Let an installed SDK manage the define.')], rows: [
        ['unknown cheat', tr('catalog 이름, compile guard, assembly 참조와 컴파일 오류 확인', 'Check the catalog name, compile guard, assembly reference, and compilation errors')],
        ['bad argument', tr('parameter 이름·타입·범위·enum 값 확인', 'Check parameter names, types, ranges, and enum values')],
        ['unavailable', tr('when이 반환한 이유에 맞게 사전조건 준비', 'Prepare the precondition described by when')],
        ['cheat not allowed in this run', tr('현재 run과 TC의 허용 설정 확인', 'Check the current run and test-case permissions')],
        ['cheats are not available in this build', tr('Unity Editor 또는 Development Build 사용', 'Use the Unity Editor or a Development Build')],
      ] },
    ] },
    { path: '/docs/behaviors', title: tr('Behavior 구현', 'Implement behaviors'), description: tr('프레임마다 실행하는 게임 동작과 종료·정리 처리', 'Implement ongoing game actions with progress, termination, and cleanup.'), group, sections: [
      { id: 'purpose', title: tr('Behavior 사용 범위', 'When to use a behavior'), paragraphs: [tr('Behavior는 SDK가 게임 안에서 실행하는 IEnumerator입니다. agent가 관찰·추론하는 동안 자동 공격이나 턴 진행을 계속할 수 있습니다. 플레이어 입력이 호출하는 게임 메서드를 사용하고 cooldown, 자원, animation lock을 따라야 합니다.', 'A behavior is an IEnumerator run by the SDK inside the game. It can keep attacking or advancing turns while the agent observes and reasons. Use the same game methods as player input and respect cooldowns, resources, and animation locks.'), tr('게임 메서드를 직접 호출하므로 버튼·키 입력 자체를 검증하는 TC에는 사용하지 마세요. 사전조건을 직접 바꾸는 작업은 Cheat로 분리합니다.', 'Because it calls game methods directly, do not use it to verify buttons or keyboard controls themselves. Put direct precondition changes in a cheat.')], links: [{ label: tr('Cheat 구현과 SDK 설정', 'Cheats and SDK setup'), to: '/docs/cheats#setup' }] },
      { id: 'example', title: tr('반복 동작 작성', 'Write a repeating action'), paragraphs: [tr('아래 GameCombat은 게임별 adapter 예시이며 SDK 타입이 아닙니다. IsRunning, InputLocked, HasTarget, CanAttack, TryAttack, CancelPendingInput을 실제 전투 API에 맞춰 구현하거나 교체하세요. TryAttack은 UI와 같은 게임 규칙을 적용하며 실제 공격을 시작했을 때만 true를 반환해야 합니다.', 'GameCombat below is a game-specific adapter placeholder, not an SDK type. Implement or replace IsRunning, InputLocked, HasTarget, CanAttack, TryAttack, and CancelPendingInput using your combat API. TryAttack must apply the same rules as the UI and return true only when an attack actually starts.'), tr('파일을 CombatQaBehaviors.cs로 저장하고 실행할 scene의 활성 GameObject에 component를 추가한 뒤 Inspector에서 combat 참조를 연결하세요. 마지막 parameter의 ArtelBehaviorContext는 SDK가 주입하므로 args에 넣지 않습니다. Complete와 Fail 뒤에는 yield break로 종료하고, 입력·애니메이션 등 자신이 소유한 상태는 finally에서 정리합니다.', 'Save the file as CombatQaBehaviors.cs, add the component to an active GameObject in the target scene, and assign combat in the Inspector. The SDK injects the final ArtelBehaviorContext parameter; do not include it in args. Use yield break after Complete or Fail, and clean up owned input or animation state in finally.')], language: 'C#', code: `#if ARTEL_GAME_FUNCTIONS
using System.Collections;
using Artel;
using UnityEngine;

public sealed class CombatQaBehaviors : MonoBehaviour
{
    [SerializeField] private GameCombat combat;

    string CanStart() => combat != null && combat.IsRunning
        ? null : "battle is not running";

    [ArtelBehavior("Attacks through game combat rules; does not test input.",
        group: "combat", when: nameof(CanStart))]
    IEnumerator AutoAttack([CheatRange(1, 100)] int maxAttacks,
        ArtelBehaviorContext context)
    {
        int attacks = 0;
        try
        {
            while (attacks < maxAttacks)
            {
                if (combat == null)
                {
                    context.Fail("combat object missing");
                    yield break;
                }
                if (!combat.IsRunning || !combat.HasTarget)
                {
                    context.Complete($"battle ended after {attacks} attacks");
                    yield break;
                }
                if (combat.InputLocked || !combat.CanAttack)
                {
                    context.Report("waiting for combat input");
                    yield return null;
                    continue;
                }
                if (combat.TryAttack()) attacks++;
                context.Report($"attacks={attacks}");
                yield return null;
            }
            context.Complete($"reached maxAttacks={maxAttacks}");
        }
        finally
        {
            if (combat != null) combat.CancelPendingInput();
        }
    }
}
#endif` },
      { id: 'contract', title: tr('진행 보고와 실행 제한', 'Progress and execution limits'), paragraphs: [tr('Cheat와 같은 이름·parameter·when 규칙을 따르며 반환형은 반드시 IEnumerator입니다. null과 WaitForSeconds를 yield할 수 있습니다. 게임이 멈추면 반복 실행과 timeout의 게임 시간도 멈춥니다.', 'Behaviors follow the same name, parameter, and when rules as cheats, but must return IEnumerator. They can yield null and WaitForSeconds. Pausing the game pauses advancement and the game-time timeout.')], rows: [
        ['context.Report(text)', tr('최신 진행 문구를 전달. 최대 200자이며 관찰에 반영', 'Updates the latest progress line, capped at 200 characters, for observations')],
        ['context.Complete / Fail', tr('완료 또는 실패 요청과 이유 전달. TC 통과 판정과는 별도', 'Requests completion or failure with a reason; this is separate from a TC verdict')],
        ['group', tr('같은 group의 새 Behavior가 기존 실행을 replaced로 종료', 'Starting another behavior in the same group ends the current one as replaced')],
        ['maxSeconds', tr('기본 30초, 1~300초. 동시에 최대 4개 실행', 'Defaults to 30 seconds, range 1–300 seconds. At most four behaviors run concurrently')],
        ['when', tr('시작할 때와 실행 중 검사. 불가로 바뀌면 unavailable로 종료', 'Checked on start and during execution; becoming unavailable ends the behavior')],
      ] },
      { id: 'invoke', title: tr('시작·연장·중단', 'Start, extend, and stop'), paragraphs: [tr('아래는 SDK ACTION item 예시입니다. start_behavior 응답의 behaviorId를 보관하고 이후 extend_behavior와 stop_behavior에 전달합니다. 예시 ID 7은 실제 응답값으로 바꾸세요. instance가 여러 개면 start_behavior에 catalog와 게임에서 확인한 target selector를 추가합니다.', 'These are SDK ACTION item examples. Retain the behaviorId returned by start_behavior for extend_behavior and stop_behavior. Replace example ID 7 with the actual response. If multiple instances exist, add the target selector resolved from the catalog and game to start_behavior.'), tr('실행 중 상태와 report는 PULSE의 behaviors에서, 종료 결과는 BEHAVIOR_ENDED에서 확인합니다. 다른 step이나 TC로 넘어가도 실행될 수 있으므로 허용 설정과 종료 상태를 확인하세요.', 'Read active state and report from behaviors in PULSE, and the final result from BEHAVIOR_ENDED. A behavior may continue across steps or test cases; check permissions and termination.')], language: 'JSON', code: `{"method":"start_behavior","params":[{"name":"auto_attack","args":{"maxAttacks":10},"maxSeconds":60}]}
{"method":"extend_behavior","params":[{"behaviorId":7,"seconds":30}]}
{"method":"stop_behavior","params":[{"behaviorId":7}]}` },
      { id: 'lifecycle', title: tr('종료와 정리 검증', 'Verify termination and cleanup'), paragraphs: [tr('정상 완료 외에도 수동 중단, timeout, 같은 group으로 교체, 대상 객체 파괴, when 변경, run 종료·연결 해제를 각각 확인하세요. SDK는 종료 시 iterator를 Dispose하므로 실행에 진입한 try/finally의 정리가 수행됩니다. 시작 후 첫 실행 전에 중단될 수 있으므로 외부에서 미리 얻은 자원을 iterator의 finally에만 의존해 해제하지 마세요.', 'Test manual stop, timeout, group replacement, target destruction, a changed when condition, and run end or disconnect as well as normal completion. The SDK disposes the iterator on termination, running cleanup for entered try/finally blocks. A behavior can stop before its first step, so do not rely only on iterator finally to release resources acquired externally before execution.'), tr('종료 후 수동 조작이 가능한지, 누른 입력이나 잠금이 남지 않는지 확인합니다. completed는 동작의 종료 이유이며 게임 결과 검증은 QA가 별도로 수행합니다. static 또는 DontDestroyOnLoad 대상은 scene이 바뀌었다는 이유만으로 항상 종료되지는 않으므로 직접 완료 조건이나 when을 구현하세요.', 'After termination, verify manual play works and no held input or lock remains. completed describes routine termination; QA verifies the game result separately. A scene change does not always stop static or DontDestroyOnLoad targets; implement completion conditions or when.')], rows: [
        ['completed / failed', tr('iterator 종료·Complete / Fail·예외', 'Iterator end or Complete / Fail or an exception')],
        ['stopped / timeout / replaced', tr('수동 중단 / 제한 시간 / 같은 group의 새 실행', 'Manual stop / time limit / a new run in the same group')],
        ['target_gone / unavailable', tr('대상 파괴 / when 조건 불충족', 'Target destroyed / when condition no longer satisfied')],
        ['not_allowed / run_ended', tr('다음 TC에서 허용하지 않음 / reset·run 종료·연결 해제', 'Disallowed in the next TC / reset, run end, or disconnect')],
      ], links: [{ label: 'BehaviorRunner source', to: source + 'Runtime/GameFunctions/BehaviorRunner.cs' }, { label: 'Behavior lifecycle tests', to: source + 'Tests/Runtime/GameFunctions/BehaviorLifecycleTests.cs' }] },
      { id: 'troubleshooting', title: tr('실행 오류 확인', 'Troubleshoot execution'), paragraphs: [tr('unknown behavior는 등록·이름·compile guard를 확인하고, unavailable은 when의 이유를 확인합니다. too many behaviors running이면 기존 실행을 종료하세요. unknown behavior id는 이미 종료된 실행을 중단·연장할 때도 발생하므로 최신 PULSE와 종료 event를 먼저 확인합니다. 허용되지 않은 TC나 release build에서는 실행할 수 없습니다.', 'For unknown behavior, check registration, names, and the compile guard; for unavailable, inspect the when reason. Stop existing routines for too many behaviors running. unknown behavior id can mean a routine has already ended; check the latest PULSE and end events before stopping or extending it. Disallowed test cases and release builds cannot run behaviors.')], links: [{ label: tr('공통 등록 오류', 'Shared registration errors'), to: '/docs/cheats#troubleshooting' }] },
    ] },
  ]
}
