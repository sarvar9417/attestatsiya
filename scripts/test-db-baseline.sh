#!/bin/zsh

set -euo pipefail

test_root=$(mktemp -d /private/tmp/attestatsiya-pg.XXXXXX)
test_port=55432
cluster_started=0

cleanup() {
  if [[ ${cluster_started} -eq 1 ]]; then
    pg_ctl -D "${test_root}/data" -m fast -w stop >/dev/null
  fi
  if [[ "${test_root}" == /private/tmp/attestatsiya-pg.* ]]; then
    rm -rf "${test_root}"
  fi
}

trap cleanup EXIT

mkdir "${test_root}/socket"
initdb \
  -D "${test_root}/data" \
  --auth=trust \
  --username=postgres \
  --no-locale \
  >/dev/null

pg_ctl \
  -D "${test_root}/data" \
  -o "-F -p ${test_port} -k ${test_root}/socket" \
  -w start \
  >/dev/null
cluster_started=1

createdb \
  -h "${test_root}/socket" \
  -p "${test_port}" \
  -U postgres \
  attestatsiya_test

createdb \
  -h "${test_root}/socket" \
  -p "${test_port}" \
  -U postgres \
  attestatsiya_upgrade_test

psql \
  -X \
  -v ON_ERROR_STOP=1 \
  -h "${test_root}/socket" \
  -p "${test_port}" \
  -U postgres \
  -d attestatsiya_test \
  -f supabase/tests/bootstrap_local.sql \
  -f supabase/migrations/20260730000000_uuid_baseline.sql \
  -f supabase/migrations/20260730000008_taxonomy_contract.sql \
  -f supabase/migrations/20260730000009_official_2026_seed.sql \
  -f supabase/seed.sql \
  -c "select count(*) as modules from public.modules;" \
  -c "select count(*) as quotas, sum(question_count) as questions, sum(n_bilish) as bilish, sum(n_qollash) as qollash, sum(n_mulohaza) as mulohaza from public.blueprint_quotas;" \
  -c "select count(*) as active_constructs from public.constructs where is_active;" \
  -c "select duration_min, total_questions, points_per_item from public.blueprints where is_active;"

psql \
  -X \
  -v ON_ERROR_STOP=1 \
  -h "${test_root}/socket" \
  -p "${test_port}" \
  -U postgres \
  -d attestatsiya_upgrade_test \
  -f supabase/tests/bootstrap_local.sql \
  -f supabase/migrations/20260730000000_uuid_baseline.sql \
  -f supabase/tests/remote_drift_fixture.sql \
  -f supabase/migrations/20260730000008_taxonomy_contract.sql \
  -f supabase/migrations/20260730000009_official_2026_seed.sql \
  -f supabase/tests/remote_drift_assertions.sql \
  -c "select count(*) as modules from public.modules;" \
  -c "select count(*) as quotas, sum(question_count) as questions, sum(n_bilish) as bilish, sum(n_qollash) as qollash, sum(n_mulohaza) as mulohaza from public.blueprint_quotas;" \
  -c "select count(*) as active_constructs from public.constructs where is_active;" \
  -c "select duration_min, total_questions, points_per_item from public.blueprints where is_active;" \
  -c "select count(*) as preserved_lessons from public.lessons lesson join public.modules module on module.id = lesson.module_id where module.code = 'M01';" \
  -c "select count(*) as preserved_legacy_questions from public.questions question join public.constructs construct on construct.id = question.construct_id where construct.code = 'LEGACY.01' and not construct.is_active;"
