#!/usr/bin/env python3
"""
Server-side export script for NYA anonymous visitor sessions.
Reads append-only events from data/analytics/sessions_*.jsonl and exports to:
  exports/visitor_sessions_YYYY-MM-DD.csv
  exports/visitor_sessions_YYYY-MM-DD.json

Strictly server-side execution only (NO HTTP endpoints).
Directory permissions: 0700
File permissions: 0600
"""

import argparse
import csv
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

def parse_iso(ts_str, default_dt):
    if not ts_str:
        return default_dt
    try:
        clean = ts_str.replace("Z", "+00:00")
        return datetime.fromisoformat(clean)
    except Exception:
        return default_dt

def process_events(analytics_dir, target_date=None):
    """
    Reads JSONL event logs from analytics_dir.
    If target_date is specified, reads only sessions_YYYY-MM-DD.jsonl.
    Otherwise reads all sessions_*.jsonl in chronological order.
    """
    analytics_path = Path(analytics_dir)
    if not analytics_path.exists():
        return {}

    if target_date:
        files = [analytics_path / f"sessions_{target_date}.jsonl"]
    else:
        files = sorted(analytics_path.glob("sessions_*.jsonl"))

    sessions = {}

    for file_path in files:
        if not file_path.is_file():
            continue
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        ev = json.loads(line)
                    except json.JSONDecodeError:
                        continue

                    sid = ev.get("session_id")
                    ts = ev.get("timestamp")
                    path = ev.get("path") or "/"
                    ev_type = ev.get("type", "unknown")

                    if not sid or not ts:
                        continue

                    if sid not in sessions:
                        sessions[sid] = {
                            "session_id": sid,
                            "started_at": ts,
                            "last_seen": ts,
                            "ended_at": None,
                            "current_page": path,
                            "page_views": 1,
                            "pages_visited": [path],
                        }
                    else:
                        s = sessions[sid]
                        s["last_seen"] = ts
                        s["current_page"] = path
                        s["page_views"] += 1
                        if path not in s["pages_visited"]:
                            s["pages_visited"].append(path)
                        if ev_type == "end":
                            s["ended_at"] = ts
        except Exception as e:
            print(f"Warning: could not read {file_path}: {e}", file=sys.stderr)

    return sessions

def compute_session_metrics(raw_sessions, now_utc, timeout_seconds=90):
    computed = []
    for sid, s in raw_sessions.items():
        started_dt = parse_iso(s["started_at"], now_utc)
        last_seen_dt = parse_iso(s["last_seen"], started_dt)

        ended_at = s.get("ended_at")
        ended_dt = parse_iso(ended_at, None) if ended_at else None

        if ended_dt:
            status = "ended"
            duration = max(0, int((ended_dt - started_dt).total_seconds()))
        elif (now_utc - last_seen_dt).total_seconds() <= timeout_seconds:
            status = "active"
            duration = max(0, int((now_utc - started_dt).total_seconds()))
        else:
            status = "inactive"
            duration = max(0, int((last_seen_dt - started_dt).total_seconds()))

        computed.append({
            "session_id": sid,
            "started_at": s["started_at"],
            "last_seen": s["last_seen"],
            "ended_at": ended_at,
            "duration_seconds": duration,
            "status": status,
            "current_page": s["current_page"],
            "page_views": s["page_views"],
            "pages_visited": s["pages_visited"],
        })

    computed.sort(key=lambda x: x["started_at"], reverse=True)
    return computed

def main():
    parser = argparse.ArgumentParser(description="Export NYA visitor session logs to CSV and JSON.")
    parser.add_argument("--date", help="Specific date to export (format: YYYY-MM-DD)")
    parser.add_argument("--timeout", type=int, default=int(os.environ.get("ANALYTICS_SESSION_TIMEOUT_SECONDS", 90)),
                        help="Session inactivity timeout in seconds (default: 90)")
    parser.add_argument("--data-dir", default=os.environ.get("ANALYTICS_DATA_DIR"),
                        help="Path to analytics data directory (default: <repo_root>/data/analytics)")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    data_dir = Path(args.data_dir).resolve() if args.data_dir else repo_root / "data" / "analytics"
    exports_dir = repo_root / "exports"

    now_utc = datetime.now(timezone.utc)
    export_date_str = args.date or now_utc.strftime("%Y-%m-%d")

    # Ensure exports directory exists with restricted permissions (0700)
    exports_dir.mkdir(parents=True, exist_ok=True)
    try:
        os.chmod(exports_dir, 0o700)
    except Exception:
        pass

    raw_sessions = process_events(data_dir, target_date=args.date)
    computed_sessions = compute_session_metrics(raw_sessions, now_utc, timeout_seconds=args.timeout)

    csv_path = exports_dir / f"visitor_sessions_{export_date_str}.csv"
    json_path = exports_dir / f"visitor_sessions_{export_date_str}.json"

    # Write CSV export
    fieldnames = [
        "session_id",
        "started_at",
        "last_seen",
        "ended_at",
        "duration_seconds",
        "status",
        "current_page",
        "page_views",
    ]
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        writer.writerow(fieldnames)
        for s in computed_sessions:
            writer.writerow([
                s["session_id"],
                s["started_at"],
                s["last_seen"],
                s["ended_at"] or "",
                s["duration_seconds"],
                s["status"],
                s["current_page"],
                s["page_views"],
            ])

    # Write JSON export
    payload = {
        "exported_at": now_utc.isoformat(),
        "date": export_date_str,
        "timeout_seconds": args.timeout,
        "total_sessions": len(computed_sessions),
        "active_sessions": sum(1 for s in computed_sessions if s["status"] == "active"),
        "sessions": computed_sessions,
    }
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    # Restrict file permissions to 0600 (owner read/write only)
    try:
        os.chmod(csv_path, 0o600)
        os.chmod(json_path, 0o600)
    except Exception:
        pass

    print(f"Export successful!")
    print(f"  Sessions: {len(computed_sessions)} (Active: {payload['active_sessions']})")
    print(f"  CSV:      {csv_path}")
    print(f"  JSON:     {json_path}")
    print(f"  Security: permissions 0600, stored in private server directory (non-public)")

if __name__ == "__main__":
    main()
