import asyncio
import sys


async def main() -> None:
    print("platform", sys.platform)
    policy = asyncio.get_event_loop_policy()
    print("policy", type(policy).__name__)

    # This is the exact capability Playwright needs on Windows: subprocess support.
    proc = await asyncio.create_subprocess_exec(
        "cmd",
        "/c",
        "echo",
        "ok",
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    out, err = await proc.communicate()
    print("subprocess_out", (out or b"").decode(errors="ignore").strip())
    print("subprocess_err", (err or b"").decode(errors="ignore").strip())


if __name__ == "__main__":
    asyncio.run(main())

