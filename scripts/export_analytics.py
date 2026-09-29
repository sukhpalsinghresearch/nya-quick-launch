#!/usr/bin/env python3
"""
Server-side export script for NYA visitor sessions.
Produces:
  exports/visitor_sessions_YYYY-MM-DD.csv
  exports/visitor_sessions_YYYY-MM-DD.json
"""

import csv
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

def compute_session(session, now_dt, timeout_seconds=90):
    try:
        started_dt = datetime.fromisoformat(session["started_at"].replace("Z", "+00:00"))
    except Exception:
        started_dt = now_dt

    try:
        last_seen_dt = datetime.fromisoformat(session["last_seen"].replace("Z", "+00:00"))
    except Exception:
        last_seen_dt = started_dt

    ended_at = session.get("ended_at")
    ended_dt = None
    if ended_at:
        try:
            ended_dt = datetime.fromisoformat(ended_at.replace("Z", "+00:00"))
        except Exception:
            ended_dt = last_seen_dt

    if ended_dt:
        status = "ended"
        duration = max(0, int((ended_dt - started_dt).total_seconds()))
    elif (now_dt - last_seen_dt).total_seconds() <= timeout_seconds:
        status = "active"
        duration = max(0, int((now_dt - started_dt).total_seconds()))
    else:
        status = "inactive"
        duration = max(0, int((last_seen_dt - started_dt).total_seconds()))

    computed = dict(session)
    computed["status"] = status
    computed["duration_seconds"] = duration
    return computed

def main():
    repo_root = Path(__file__).resolve().parent.parent
    data_file_env = os.environ.get("ANALYTICS_SESSIONS_FILE")
    data_file = Path(data_file_env).resolve() if data_file_env else repo_root / "data" / "visitor_sessions.json"
    timeout_seconds = int(os.environ.get("ANALYTICS_SESSION_TIMEOUT_SECONDS", 90))

    if not data_file.exists():
        print(f"Sessions file not found at: {data_file}")
        sessions_raw = []
    else:
        try:
            with open(data_file, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    sessions_raw = []
                else:
                    data = json.loads(content)
                    sessions_raw = data.get("sessions", []) if isinstance(data, dict) else []
        except Exception as e:
            print(f"Error reading sessions file: {e}", file=sys.stderr)
            sessions_raw = []

    now_utc = datetime.now(timezone.utc)
    date_str = now_utc.strftime("%Y-%m-%d")
    exports_dir = repo_root / "exports"
    exports_dir.mkdir(parents=True, exist_ok=True)

    csv_path = exports_dir / f"visitor_sessions_{date_str}.csv"
    json_path = exports_dir / f"visitor_sessions_{date_str}.json"

    computed_sessions = [compute_session(s, now_utc, timeout_seconds) for s in sessions_raw]

    # Write CSV
    fieldnames = [
        "session_id",
        "started_at",
        "last_seen",
        "ended_at",
        "duration_seconds",
        "status",
        "current_page",
    ]
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        writer.writerow(fieldnames)
        for s in computed_sessions:
            writer.writerow([
                s.get("session_id", ""),
                s.get("started_at", ""),
                s.get("last_seen", ""),
                s.get("ended_at") or "",
                s.get("duration_seconds", 0),
                s.get("status", "unknown"),
                s.get("current_page", "/"),
            ])

    # Write JSON
    export_payload = {
        "exported_at": now_utc.isoformat(),
        "total_sessions": len(computed_sessions),
        "sessions": computed_sessions,
    }
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(export_payload, f, indent=2, ensure_ascii=False)

    print(f"Exported {len(computed_sessions)} sessions:")
    print(f"  CSV:  {csv_path}")
    print(f"  JSON: {json_path}")

if __name__ == "__main__":
    main()
