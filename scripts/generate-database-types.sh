#!/bin/zsh

set -euo pipefail

project_ref=${SUPABASE_PROJECT_REF:-plyqezulrfowyblsfpzy}
output_file=src/lib/database.types.ts
generated_file=$(mktemp /private/tmp/attestatsiya-database-types.XXXXXX)

cleanup() {
  if [[ "$generated_file" == /private/tmp/attestatsiya-database-types.* ]]; then
    rm -f "$generated_file"
  fi
}

trap cleanup EXIT

supabase gen types typescript \
  --project-id "$project_ref" \
  --schema public \
  > "$generated_file"

rg -q 'exam_items:' "$generated_file"
rg -q 'profiles:' "$generated_file"
rg -q 'submit_answer:' "$generated_file"
rg -q 'user_role: "user" | "editor" | "admin"' "$generated_file"

mv "$generated_file" "$output_file"
printf 'Generated %s from Supabase project %s.\n' "$output_file" "$project_ref"
