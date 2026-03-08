from datetime import datetime
from itertools import count

_req_counter = count(1)


def log_model_io(
    *,
    model: str,
    system_prompt: str,
    user_prompt: str,
    response_text: str,
    phase: str = "completion",
) -> None:
    """Print every model input/output in a readable block."""
    req_id = next(_req_counter)
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    print("\n" + "=" * 80)
    print(f"[MODEL I/O] id={req_id} phase={phase} time={ts} model={model}")
    print("-" * 80)
    print("[INPUT][SYSTEM]")
    print(system_prompt or "")
    print("-" * 80)
    print("[INPUT][USER]")
    print(user_prompt or "")
    print("-" * 80)
    print("[OUTPUT]")
    print(response_text or "")
    print("=" * 80 + "\n")
