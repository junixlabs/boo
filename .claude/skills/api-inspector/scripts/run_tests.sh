#!/bin/bash
# LifeStack API Test Runner
# Usage: ./run_tests.sh [module] [--fresh]
#   module: all|auth|projects|tasks|daily-focus|ideas|dashboard (default: all)
#   --fresh: register a new test user instead of reusing

set -euo pipefail

BASE_URL="http://localhost:8000/api/v1"
CT="Content-Type: application/json"
PASS=0
FAIL=0
TOTAL=0
FAILURES=""

# Parse arguments
MODULE="${1:-all}"
FRESH=false
for arg in "$@"; do [[ "$arg" == "--fresh" ]] && FRESH=true; done

# --- Helpers ---

assert() {
  local name="$1" expected="$2" actual="$3" body="${4:-}"
  TOTAL=$((TOTAL+1))
  if [ "$expected" = "$actual" ]; then
    echo "  PASS: $name ($actual)"
    PASS=$((PASS+1))
  else
    echo "  FAIL: $name - Expected $expected, got $actual"
    [ -n "$body" ] && echo "    Response: $(echo "$body" | head -c 200)"
    FAIL=$((FAIL+1))
    FAILURES="$FAILURES\n  - $name (expected $expected, got $actual)"
  fi
}

api() {
  local method="$1" endpoint="$2" data="${3:-}" auth_header="${4:-$AUTH}"
  local cmd="curl -s -w \"\n%{http_code}\" -X $method \"${BASE_URL}${endpoint}\" -H \"$CT\""
  [ -n "$auth_header" ] && cmd="$cmd -H \"$auth_header\""
  [ -n "$data" ] && cmd="$cmd -d '$data'"
  eval "$cmd"
}

parse_response() {
  local response="$1"
  HTTP_CODE=$(echo "$response" | tail -1)
  BODY=$(echo "$response" | sed '$d')
}

json_get() {
  echo "$1" | python3 -c "import json,sys; d=json.load(sys.stdin); print($2)" 2>/dev/null
}

# --- Pre-flight ---

echo "============================================================"
echo "  LifeStack API Test Runner"
echo "  Base URL: $BASE_URL"
echo "  Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo "  Module: $MODULE"
echo "============================================================"
echo ""

# Check server
SERVER_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/up 2>/dev/null || echo "000")
if [ "$SERVER_CODE" != "200" ]; then
  echo "ERROR: Server not running at localhost:8000"
  echo "  Start with: cd api && php artisan serve --port=8000"
  exit 1
fi
echo "Server: OK"

# Verify endpoints from OpenAPI spec
ENDPOINTS=$(curl -s http://localhost:8000/docs/api.json | python3 -c "
import json,sys
d=json.load(sys.stdin)
for p in d.get('paths',{}):
    for m in d['paths'][p]:
        print(f'{m.upper()} {p}')
" 2>/dev/null)
ENDPOINT_COUNT=$(echo "$ENDPOINTS" | wc -l | tr -d ' ')
echo "Endpoints discovered: $ENDPOINT_COUNT"
echo ""

# --- Auth Setup ---

TS=$(date +%s)
TEST_EMAIL="test_${TS}@lifestack.test"
AUTH=""

setup_auth() {
  local R BD
  R=$(api POST "/auth/register" "{\"name\":\"Test User\",\"email\":\"$TEST_EMAIL\",\"password\":\"password123\",\"password_confirmation\":\"password123\",\"timezone\":\"Asia/Ho_Chi_Minh\"}" "")
  parse_response "$R"
  TOKEN=$(json_get "$BODY" "d['data']['token']")
  if [ -z "$TOKEN" ] || [ "$TOKEN" = "None" ]; then
    echo "ERROR: Failed to register test user"
    echo "  Response: $BODY"
    exit 1
  fi
  AUTH="Authorization: Bearer $TOKEN"
  echo "Auth: Test user registered ($TEST_EMAIL)"
  echo ""
}

setup_auth

# --- Test Modules ---

test_auth() {
  echo "--- Auth Tests ---"
  local R

  # Login
  R=$(api POST "/auth/login" "{\"email\":\"$TEST_EMAIL\",\"password\":\"password123\"}" "")
  parse_response "$R"
  assert "Login" "200" "$HTTP_CODE" "$BODY"
  TOKEN=$(json_get "$BODY" "d['data']['token']")
  AUTH="Authorization: Bearer $TOKEN"

  # Me
  R=$(api GET "/auth/me")
  parse_response "$R"
  assert "Get current user" "200" "$HTTP_CODE" "$BODY"

  # Update profile
  R=$(api PUT "/auth/profile" '{"name":"Updated User","timezone":"UTC"}')
  parse_response "$R"
  assert "Update profile" "200" "$HTTP_CODE" "$BODY"
  local UPDATED_NAME=$(json_get "$BODY" "d['data']['name']")
  assert "Profile name updated" "Updated User" "$UPDATED_NAME"

  # Refresh
  R=$(api POST "/auth/refresh")
  parse_response "$R"
  assert "Refresh token" "200" "$HTTP_CODE" "$BODY"
  TOKEN=$(json_get "$BODY" "d['data']['token']")
  AUTH="Authorization: Bearer $TOKEN"

  # Error: duplicate email
  R=$(api POST "/auth/register" "{\"name\":\"Dup\",\"email\":\"$TEST_EMAIL\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}" "")
  parse_response "$R"
  assert "Duplicate email rejected" "422" "$HTTP_CODE"

  # Error: wrong password
  R=$(api POST "/auth/login" "{\"email\":\"$TEST_EMAIL\",\"password\":\"wrong\"}" "")
  parse_response "$R"
  assert "Wrong password rejected" "422" "$HTTP_CODE"

  # Error: no token
  R=$(api GET "/auth/me" "" "X-No-Auth: true")
  parse_response "$R"
  assert "Unauthenticated rejected" "401" "$HTTP_CODE"

  # Logout (run last since it invalidates token)
  R=$(api POST "/auth/logout")
  parse_response "$R"
  assert "Logout" "204" "$HTTP_CODE"

  # Re-login for subsequent tests
  R=$(api POST "/auth/login" "{\"email\":\"$TEST_EMAIL\",\"password\":\"password123\"}" "")
  parse_response "$R"
  TOKEN=$(json_get "$BODY" "d['data']['token']")
  AUTH="Authorization: Bearer $TOKEN"

  echo ""
}

test_projects() {
  echo "--- Projects Tests ---"
  local R

  # Create
  R=$(api POST "/projects" "{\"title\":\"[TEST] Project $TS\",\"description\":\"Test project\",\"type\":\"personal_startup\",\"priority\":1,\"start_date\":\"2026-03-07\",\"target_date\":\"2026-06-30\"}")
  parse_response "$R"
  assert "Create project" "201" "$HTTP_CODE" "$BODY"
  PID=$(json_get "$BODY" "d['data']['id']")

  # List
  R=$(api GET "/projects")
  parse_response "$R"
  assert "List projects" "200" "$HTTP_CODE"

  # List filtered
  R=$(api GET "/projects?status=active&type=personal_startup")
  parse_response "$R"
  assert "List projects filtered" "200" "$HTTP_CODE"

  # Show
  R=$(api GET "/projects/$PID")
  parse_response "$R"
  assert "Show project" "200" "$HTTP_CODE"
  local TITLE=$(json_get "$BODY" "d['data']['title']")
  assert "Project title correct" "[TEST] Project $TS" "$TITLE"

  # Update
  R=$(api PUT "/projects/$PID" '{"title":"[TEST] Updated Project","priority":2}')
  parse_response "$R"
  assert "Update project" "200" "$HTTP_CODE"

  # Update status
  R=$(api PATCH "/projects/$PID/status" '{"status":"paused"}')
  parse_response "$R"
  assert "Update project status" "200" "$HTTP_CODE"
  local STATUS=$(json_get "$BODY" "d['data']['status']")
  assert "Status changed to paused" "paused" "$STATUS"

  # Reactivate for later tests
  api PATCH "/projects/$PID/status" '{"status":"active"}' > /dev/null

  # Error: no title
  R=$(api POST "/projects" '{"description":"no title"}')
  parse_response "$R"
  assert "Create without title rejected" "422" "$HTTP_CODE"

  # Error: invalid type
  R=$(api POST "/projects" '{"title":"Bad","type":"invalid_type"}')
  parse_response "$R"
  assert "Invalid type rejected" "422" "$HTTP_CODE"

  # Error: not found
  R=$(api GET "/projects/99999")
  parse_response "$R"
  assert "Non-existent project" "404" "$HTTP_CODE"

  echo ""
}

test_tasks() {
  echo "--- Tasks Tests ---"
  local R

  # Ensure project exists
  if [ -z "${PID:-}" ]; then
    R=$(api POST "/projects" "{\"title\":\"[TEST] Task Parent $TS\",\"type\":\"experiment\"}")
    parse_response "$R"
    PID=$(json_get "$BODY" "d['data']['id']")
  fi

  # Create with project
  R=$(api POST "/tasks" "{\"title\":\"[TEST] Task $TS\",\"description\":\"Test task\",\"project_id\":$PID,\"priority\":\"high\",\"due_date\":\"2026-03-15\"}")
  parse_response "$R"
  assert "Create task with project" "201" "$HTTP_CODE" "$BODY"
  TID=$(json_get "$BODY" "d['data']['id']")

  # Create standalone
  R=$(api POST "/tasks" "{\"title\":\"[TEST] Standalone $TS\",\"priority\":\"low\"}")
  parse_response "$R"
  assert "Create standalone task" "201" "$HTTP_CODE"
  TID2=$(json_get "$BODY" "d['data']['id']")

  # List
  R=$(api GET "/tasks")
  parse_response "$R"
  assert "List tasks" "200" "$HTTP_CODE"

  # List filtered
  R=$(api GET "/tasks?status=todo&priority=high")
  parse_response "$R"
  assert "List tasks filtered" "200" "$HTTP_CODE"

  # Show
  R=$(api GET "/tasks/$TID")
  parse_response "$R"
  assert "Show task" "200" "$HTTP_CODE"

  # Update
  R=$(api PUT "/tasks/$TID" '{"title":"[TEST] Updated Task","priority":"medium"}')
  parse_response "$R"
  assert "Update task" "200" "$HTTP_CODE"

  # Status -> done (verify completed_at)
  R=$(api PATCH "/tasks/$TID/status" '{"status":"done"}')
  parse_response "$R"
  assert "Update status to done" "200" "$HTTP_CODE"
  local COMPLETED=$(json_get "$BODY" "d['data'].get('completed_at','NULL')")
  if [ "$COMPLETED" != "NULL" ] && [ "$COMPLETED" != "None" ]; then
    assert "completed_at set" "not_null" "not_null"
  else
    assert "completed_at set" "not_null" "null"
  fi

  # Error: no title
  R=$(api POST "/tasks" '{"priority":"high"}')
  parse_response "$R"
  assert "Create without title rejected" "422" "$HTTP_CODE"

  # Error: invalid priority
  R=$(api POST "/tasks" '{"title":"Bad","priority":"ultra"}')
  parse_response "$R"
  assert "Invalid priority rejected" "422" "$HTTP_CODE"

  echo ""
}

test_daily_focus() {
  echo "--- Daily Focus Tests ---"
  local R

  # Create dependency tasks
  R=$(api POST "/tasks" "{\"title\":\"[TEST] Focus1 $TS\",\"priority\":\"high\"}")
  parse_response "$R"
  FTID1=$(json_get "$BODY" "d['data']['id']")

  R=$(api POST "/tasks" "{\"title\":\"[TEST] Focus2 $TS\",\"priority\":\"medium\"}")
  parse_response "$R"
  FTID2=$(json_get "$BODY" "d['data']['id']")

  # Create focus
  R=$(api POST "/daily-focus" "{\"task_id\":$FTID1,\"focus_date\":\"2026-03-07\",\"sort_order\":1,\"note\":\"Test note\"}")
  parse_response "$R"
  assert "Create daily focus" "201" "$HTTP_CODE" "$BODY"
  DFID=$(json_get "$BODY" "d['data']['id']")

  # List
  R=$(api GET "/daily-focus?date=2026-03-07")
  parse_response "$R"
  assert "List daily focus" "200" "$HTTP_CODE"

  # Update
  R=$(api PUT "/daily-focus/$DFID" '{"note":"Updated note","sort_order":2}')
  parse_response "$R"
  assert "Update daily focus" "200" "$HTTP_CODE"

  # Delete
  R=$(api DELETE "/daily-focus/$DFID")
  parse_response "$R"
  assert "Delete daily focus" "204" "$HTTP_CODE"

  # Cleanup
  api DELETE "/tasks/$FTID1" > /dev/null 2>&1
  api DELETE "/tasks/$FTID2" > /dev/null 2>&1

  echo ""
}

test_ideas() {
  echo "--- Ideas Tests ---"
  local R

  # Create
  R=$(api POST "/ideas" "{\"title\":\"[TEST] Idea $TS\",\"description\":\"Test idea\",\"category\":\"product\"}")
  parse_response "$R"
  assert "Create idea" "201" "$HTTP_CODE" "$BODY"
  IID=$(json_get "$BODY" "d['data']['id']")

  # List
  R=$(api GET "/ideas")
  parse_response "$R"
  assert "List ideas" "200" "$HTTP_CODE"

  # List filtered
  R=$(api GET "/ideas?status=inbox&category=product")
  parse_response "$R"
  assert "List ideas filtered" "200" "$HTTP_CODE"

  # Update
  R=$(api PUT "/ideas/$IID" '{"title":"[TEST] Updated Idea","category":"tech"}')
  parse_response "$R"
  assert "Update idea" "200" "$HTTP_CODE"

  # Convert to project
  R=$(api POST "/ideas/$IID/convert" '{"convert_to":"project"}')
  parse_response "$R"
  assert "Convert idea to project" "200" "$HTTP_CODE"

  # Create + convert to task
  R=$(api POST "/ideas" "{\"title\":\"[TEST] Idea->Task $TS\",\"category\":\"dev\"}")
  parse_response "$R"
  IID2=$(json_get "$BODY" "d['data']['id']")
  R=$(api POST "/ideas/$IID2/convert" "{\"convert_to\":\"task\",\"project_id\":$PID}")
  parse_response "$R"
  assert "Convert idea to task" "200" "$HTTP_CODE"

  # Create + discard
  R=$(api POST "/ideas" "{\"title\":\"[TEST] Discard $TS\"}")
  parse_response "$R"
  IID3=$(json_get "$BODY" "d['data']['id']")
  R=$(api PATCH "/ideas/$IID3/discard")
  parse_response "$R"
  assert "Discard idea" "200" "$HTTP_CODE"

  # Delete
  R=$(api DELETE "/ideas/$IID3")
  parse_response "$R"
  assert "Delete idea" "204" "$HTTP_CODE"

  # Error: no title
  R=$(api POST "/ideas" '{"category":"test"}')
  parse_response "$R"
  assert "Create without title rejected" "422" "$HTTP_CODE"

  echo ""
}

test_dashboard() {
  echo "--- Dashboard Tests ---"
  local R

  R=$(api GET "/dashboard/today")
  parse_response "$R"
  assert "Dashboard today" "200" "$HTTP_CODE"

  local KEYS=$(json_get "$BODY" "'ok' if all(k in d['data'] for k in ['daily_focuses','active_projects','overdue_tasks','recent_ideas_count','tasks_completed_this_week']) else 'missing'")
  assert "Dashboard has all required keys" "ok" "$KEYS"

  echo ""
}

# --- Cleanup ---

cleanup() {
  echo "--- Cleanup ---"
  [ -n "${TID:-}" ] && api DELETE "/tasks/$TID" > /dev/null 2>&1
  [ -n "${TID2:-}" ] && api DELETE "/tasks/$TID2" > /dev/null 2>&1
  [ -n "${PID:-}" ] && api DELETE "/projects/$PID" > /dev/null 2>&1
  echo "  Test data cleaned up"
  echo ""
}

# --- Run ---

case "$MODULE" in
  auth)         test_auth ;;
  projects)     test_auth; test_projects ;;
  tasks)        test_auth; test_projects; test_tasks ;;
  daily-focus)  test_auth; test_projects; test_tasks; test_daily_focus ;;
  ideas)        test_auth; test_projects; test_ideas ;;
  dashboard)    test_auth; test_dashboard ;;
  all)          test_auth; test_projects; test_tasks; test_daily_focus; test_ideas; test_dashboard ;;
  *)            echo "Unknown module: $MODULE"; echo "Available: all|auth|projects|tasks|daily-focus|ideas|dashboard"; exit 1 ;;
esac

cleanup

# --- Summary ---

echo "============================================================"
if [ "$FAIL" -eq 0 ]; then
  echo "  RESULTS: $PASS passed, $FAIL failed, $TOTAL total"
else
  echo "  RESULTS: $PASS passed, $FAIL failed, $TOTAL total"
  echo ""
  echo "  Failed tests:"
  echo -e "$FAILURES"
fi
echo "============================================================"

exit $FAIL
