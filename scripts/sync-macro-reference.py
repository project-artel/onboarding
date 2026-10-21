"""실제 grammar에서 reference를 만들고 모든 문서 예제를 parser로 검증한다."""

import argparse
import json
import os
import sys
import types
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AGENT_ROOT = Path(os.environ.get("ARTEL_AGENT_SERVER", ROOT.parent / "artel-agent-server")).resolve()
if not (AGENT_ROOT / "app/agents/qa/macro/parser.py").is_file():
    raise SystemExit("Set ARTEL_AGENT_SERVER to an artel-agent-server checkout")
sys.path.insert(0, str(AGENT_ROOT))

# parser에는 agent 시작 코드와 LLM dependency가 필요하지 않다.
for package in ("app", "app.agents", "app.agents.qa", "app.agents.qa.macro"):
    module = types.ModuleType(package)
    module.__path__ = [str(AGENT_ROOT / package.replace(".", "/"))]
    sys.modules[package] = module

from app.agents.qa.macro import grammar as g
from app.agents.qa.macro.parser import macro_definition_from_source


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    examples = json.loads((ROOT / "src/macro/examples.json").read_text(encoding="utf-8"))
    definitions = {}
    for name, source in examples.items():
        definition = macro_definition_from_source(name, source, imports=definitions)
        assert definition.entry.docstring, f"{name}: missing registration docstring"
        definitions[name] = definition
    data = {
        "types": [t.value for t in g.DECLARABLE_TYPES],
        "actions": [{"name": t.name, "signature": t.name + "(" + ", ".join(
            p.name + ": " + p.declared_type.value +
            (" = " + repr(p.default) if not p.required else "")
            for p in t.parameters) + ")"} for t in g.TOOLS],
        "readers": [{"name": r.name, "signature": r.name + "(" + ", ".join(
            (["target: object"] if r.takes_target else []) +
            (["key: string"] if r.takes_key else [])) + ") → " +
            (r.shape.value if r.shape else "runtime value")} for r in g.READERS],
        "operators": [{"shape": shape.value, "operators": [op.value for op in g.allowed_operators(shape)]} for shape in g.MacroShape],
        "limits": {name: getattr(g, name) for name in (
            "MAX_STATEMENTS", "MAX_CALL_DEPTH", "MAX_LOOP_PASSES", "MAX_EXECUTED_STATEMENTS",
            "MAX_WAIT_PER_STATEMENT_SECONDS", "MAX_WAIT_PER_CALL_SECONDS", "MIN_MATCH_CASES",
            "ASK_TRUE_AT", "MAX_CONTEXT_VALUE_CHARS", "MAX_DECIDE_STATE_CHARS")},
    }
    output = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    target = ROOT / "src/macro/grammar.generated.json"
    if args.check:
        assert target.read_text(encoding="utf-8") == output, "Run npm run sync:macro to refresh grammar data"
    else:
        target.write_text(output, encoding="utf-8")
    print(f"Macro reference: {len(examples)} parser-validated examples; grammar data matches")


if __name__ == "__main__":
    main()
