#!/usr/bin/env python3
"""Generate src/types/supabase.ts from live Supabase DB schema.

Usage:
  export SUPABASE_MANAGEMENT_KEY='your_key_here'
  python3 scripts/gen_supabase_types.py

Or provide key via env file (loaded by dotenv):
  SUPABASE_MANAGEMENT_KEY=your_key_here npm run gen-types
"""
import json, os, sys, urllib.request

PROJECT_ID = "julclavaqxzffslmaard"
API_URL = f"https://api.supabase.com/v1/projects/{PROJECT_ID}/database/query"

TYPE_MAP = {
    'bigint': 'number', 'integer': 'number', 'smallint': 'number',
    'real': 'number', 'double precision': 'number',
    'text': 'string', 'boolean': 'boolean', 'uuid': 'string', 'date': 'string',
    'jsonb': 'Json', 'json': 'Json',
    'timestamp with time zone': 'string', 'timestamp without time zone': 'string',
    'timestamp': 'string', 'time with time zone': 'string', 'time without time zone': 'string',
}


def pg_to_ts_type(pg_type):
    pg_type = pg_type.lower().strip()
    if pg_type in ('character varying', 'character'):
        return 'string'
    if pg_type.startswith('timestamp') or pg_type.startswith('time'):
        return 'string'
    if pg_type in ('bigint', 'smallint', 'integer'):
        return 'number'
    if pg_type in ('real', 'double precision', 'numeric'):
        return 'number'
    if pg_type in ('text', 'uuid'):
        return 'string'
    if pg_type == 'boolean':
        return 'boolean'
    if pg_type in ('jsonb', 'json'):
        return 'Json'
    if pg_type == 'date':
        return 'string'
    return 'string'


def fetch_schema(api_key):
    """Fetch column metadata from Supabase Management API."""
    query = (
        "SELECT table_name, column_name, data_type, is_nullable "
        "FROM information_schema.columns "
        "WHERE table_schema = 'public' "
        "ORDER BY table_name, ordinal_position"
    )
    payload = json.dumps({"query": query}).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            # Cloudflare WAF (error 1010) default User-Agent'ni bloklaydi
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
            "Accept": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def gen_table_type(columns, indent=6):
    """Generate Row/Insert/Update type for a table."""
    prefix = ' ' * indent
    lines = []
    for col in columns:
        ts_type = pg_to_ts_type(col['data_type'])
        nullable = col['is_nullable'] == 'YES'
        ts_str = f'{ts_type} | null' if nullable else ts_type
        lines.append(f'{prefix}{col["column_name"]}: {ts_str}')
    return '\n'.join(lines)


def generate(col_data):
    # Group by table
    tables = {}
    for row in col_data:
        tables.setdefault(row['table_name'], []).append(row)

    # Sort table list (known tables first, then alphabetically)
    priority_tables = [
        'achievements', 'adaptive_plans', 'daily_progress', 'duel_results', 'duels',
        'duo_streaks', 'elo_history', 'friendships', 'grammar_progress', 'grammar_topics',
        'lesson_exercise_answers', 'lesson_progress', 'lesson_sessions', 'lesson_skills',
        'lesson_viewed_tabs', 'lesson_vocab_progress', 'lessons', 'listening_lessons',
        'listening_progress', 'mock_tests', 'mocktest_listening', 'mocktest_questions',
        'mocktest_writing', 'phrase_progress', 'phrase_sessions', 'phrases',
        'profile_reactions', 'profile_rewards', 'reading_progress', 'reading_texts',
        'review_lessons', 'roleplay_sessions', 'sessions', 'speaking_progress',
        'speaking_prompts', 'study_buddies', 'system_words', 'tandem_pairs',
        'user_elo', 'user_words', 'users', 'vocabulary', 'vocabulary_progress',
        'vocabulary_sessions', 'weekly_duels', 'words', 'writing_prompts', 'writings',
    ]
    table_order = [t for t in priority_tables if t in tables]
    remaining = sorted([t for t in tables if t not in priority_tables])
    sorted_tables = table_order + remaining

    # Generate the output
    out = []
    out.append('export type Json =')
    out.append('  | string')
    out.append('  | number')
    out.append('  | boolean')
    out.append('  | null')
    out.append('  | { [key: string]: Json | undefined }')
    out.append('  | Json[]')
    out.append('')
    out.append('export type Database = {')
    out.append('  // Allows to automatically instantiate createClient with right options')
    out.append("  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)")
    out.append('  __InternalSupabase: {')
    out.append('    PostgrestVersion: "14.5"')
    out.append('  }')
    out.append('  graphql_public: {')
    out.append('    Tables: { [_ in never]: never }')
    out.append('    Views: { [_ in never]: never }')
    out.append('    Functions: {')
    out.append('      graphql: {')
    out.append('        Args: {')
    out.append('          extensions?: Json')
    out.append('          operationName?: string')
    out.append('          query?: string')
    out.append('          variables?: Json')
    out.append('        }')
    out.append('        Returns: Json')
    out.append('      }')
    out.append('    }')
    out.append('    Enums: { [_ in never]: never }')
    out.append('    CompositeTypes: { [_ in never]: never }')
    out.append('  }')
    out.append('  public: {')
    out.append('    Tables: {')

    for tn in sorted_tables:
        cols = tables[tn]
        out.append(f'      {tn}: {{')
        out.append(f'        Row: {{')
        out.append(gen_table_type(cols, indent=10))
        out.append('        }')
        # Insert
        out.append('        Insert: {')
        for col in cols:
            ts_type = pg_to_ts_type(col['data_type'])
            nullable = col['is_nullable'] == 'YES'
            col_name = col['column_name']
            if col_name in ('id', 'created_at', 'completed_at', 'updated_at'):
                out.append(f'          {col_name}?: {ts_type} | null' if nullable else f'          {col_name}?: {ts_type}')
            elif nullable:
                out.append(f'          {col_name}?: {ts_type} | null')
            else:
                out.append(f'          {col_name}: {ts_type}')
        out.append('        }')
        # Update (all optional)
        out.append('        Update: {')
        for col in cols:
            ts_type = pg_to_ts_type(col['data_type'])
            nullable = col['is_nullable'] == 'YES'
            out.append(f'          {col["column_name"]}?: {ts_type} | null' if nullable else f'          {col["column_name"]}?: {ts_type}')
        out.append('        }')
        out.append('        Relationships: []')
        out.append('      }')

    out.append('    }')
    out.append('    Views: {')
    out.append('      [_ in never]: never')
    out.append('    }')
    out.append('    Functions: {')

    # RPC functions
    rpcs = [
        ('get_content_stats', {'Args': 'never', 'Returns': 'Json'}),
        ('get_daily_words', {'Args': {'new_count?': 'number', 'user_uuid': 'string'}, 'Returns': '{ box: number; correct_count: number; english: string; example: string; is_learned: boolean; is_new: boolean; level: string; next_review: string; uzbek: string; word_id: number; wrong_count: number }[]'}),
        ('get_dashboard_stats', {'Args': {'user_uuid': 'string'}, 'Returns': 'Json'}),
        ('get_daily_phrases', {'Args': {'p_user_id': 'string', 'p_level?': 'string', 'p_offset?': 'number', 'p_limit?': 'number'}, 'Returns': '{ phrase_id: number; english: string; uzbek: string; level: string; category: string; box: number; next_review: string; is_learned: boolean; correct_count: number; wrong_count: number; is_new: boolean; last_rating: string | null }[]'}),
        ('get_phrases_for_review', {'Args': {'p_user_id': 'string'}, 'Returns': '{ phrase_id: number; english: string; uzbek: string; level: string; category: string; box: number; next_review: string; is_learned: boolean; correct_count: number; wrong_count: number; is_new: boolean; last_rating: string | null }[]'}),
        ('get_phrase_counts_by_level', {'Args': 'never', 'Returns': '{ level: string; total: number }[]'}),
        ('get_learned_phrase_counts_by_level', {'Args': {'p_user_uuid': 'string'}, 'Returns': '{ level: string; learned: number }[]'}),
        ('get_learned_counts_by_level', {'Args': {'user_uuid': 'string'}, 'Returns': '{ learned: number; level: string }[]'}),
        ('get_weekly_report', {'Args': {'user_uuid': 'string', 'week_number': 'number'}, 'Returns': 'Json'}),
        ('get_word_counts_by_level', {'Args': 'never', 'Returns': '{ level: string; total: number }[]'}),
        ('increment_weekly_xp', {'Args': {'p_pair_id': 'string', 'p_week_start': 'string', 'p_field': 'string', 'p_amount': 'number'}, 'Returns': 'void'}),
        ('lookup_user_by_invite_code', {'Args': {'p_code': 'string'}, 'Returns': 'string'}),
    ]

    for rpc_name, rpc_def in rpcs:
        args_str = rpc_def['Args']
        if isinstance(args_str, dict):
            args_lines = []
            for k, v in args_str.items():
                is_opt = k.endswith('?')
                clean_k = k.rstrip('?')
                args_lines.append(f'            {clean_k}{"?" if is_opt else ""}: {v}')
            args_str = '{\n' + '\n'.join(args_lines) + '\n          }'
        elif args_str == 'never':
            args_str = 'never'
        out.append(f'      {rpc_name}: {{ Args: {args_str}; Returns: {rpc_def["Returns"]} }}')

    out.append('    }')
    out.append('    Enums: {')
    out.append('      [_ in never]: never')
    out.append('    }')
    out.append('    CompositeTypes: {')
    out.append('      [_ in never]: never')
    out.append('    }')
    out.append('  }')
    out.append('}')
    out.append('')
    out.append('type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">')
    out.append('')
    out.append('type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]')
    out.append('')
    out.append('export type Tables<')
    out.append('  DefaultSchemaTableNameOrOptions extends')
    out.append('    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])')
    out.append('    | { schema: keyof DatabaseWithoutInternals },')
    out.append('  TableName extends DefaultSchemaTableNameOrOptions extends {')
    out.append('    schema: keyof DatabaseWithoutInternals')
    out.append('  }')
    out.append('    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &')
    out.append('        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])')
    out.append('    : never = never,')
    out.append('> = DefaultSchemaTableNameOrOptions extends {')
    out.append('  schema: keyof DatabaseWithoutInternals')
    out.append('}')
    out.append('  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &')
    out.append("      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {")
    out.append('      Row: infer R')
    out.append('    }')
    out.append('    ? R')
    out.append('    : never')
    out.append('  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &')
    out.append('        DefaultSchema["Views"])')
    out.append("    ? (DefaultSchema['Tables'] &")
    out.append("        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {")
    out.append('        Row: infer R')
    out.append('      }')
    out.append('      ? R')
    out.append('      : never')
    out.append('    : never')
    out.append('')
    out.append('export type TablesInsert<')
    out.append('  DefaultSchemaTableNameOrOptions extends')
    out.append('    | keyof DefaultSchema["Tables"]')
    out.append('    | { schema: keyof DatabaseWithoutInternals },')
    out.append('  TableName extends DefaultSchemaTableNameOrOptions extends {')
    out.append('    schema: keyof DatabaseWithoutInternals')
    out.append('  }')
    out.append('    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]')
    out.append('    : never = never,')
    out.append('> = DefaultSchemaTableNameOrOptions extends {')
    out.append('  schema: keyof DatabaseWithoutInternals')
    out.append('}')
    out.append("  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {")
    out.append('      Insert: infer I')
    out.append('    }')
    out.append('    ? I')
    out.append('    : never')
    out.append('  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]')
    out.append("    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {")
    out.append('        Insert: infer I')
    out.append('      }')
    out.append('      ? I')
    out.append('      : never')
    out.append('    : never')
    out.append('')
    out.append('export type TablesUpdate<')
    out.append('  DefaultSchemaTableNameOrOptions extends')
    out.append('    | keyof DefaultSchema["Tables"]')
    out.append('    | { schema: keyof DatabaseWithoutInternals },')
    out.append('  TableName extends DefaultSchemaTableNameOrOptions extends {')
    out.append('    schema: keyof DatabaseWithoutInternals')
    out.append('  }')
    out.append('    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]')
    out.append('    : never = never,')
    out.append('> = DefaultSchemaTableNameOrOptions extends {')
    out.append('  schema: keyof DatabaseWithoutInternals')
    out.append('}')
    out.append("  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {")
    out.append('      Update: infer U')
    out.append('    }')
    out.append('    ? U')
    out.append('    : never')
    out.append('  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]')
    out.append("    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {")
    out.append('        Update: infer U')
    out.append('      }')
    out.append('      ? U')
    out.append('      : never')
    out.append('    : never')
    out.append('')
    out.append('export type Enums<')
    out.append('  DefaultSchemaEnumNameOrOptions extends')
    out.append('    | keyof DefaultSchema["Enums"]')
    out.append('    | { schema: keyof DatabaseWithoutInternals },')
    out.append('  EnumName extends DefaultSchemaEnumNameOrOptions extends {')
    out.append('    schema: keyof DatabaseWithoutInternals')
    out.append('  }')
    out.append('    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]')
    out.append('    : never = never,')
    out.append('> = DefaultSchemaEnumNameOrOptions extends {')
    out.append('  schema: keyof DatabaseWithoutInternals')
    out.append('}')
    out.append('  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]')
    out.append('  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]')
    out.append('    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]')
    out.append('    : never')
    out.append('')
    out.append('export type CompositeTypes<')
    out.append('  PublicCompositeTypeNameOrOptions extends')
    out.append('    | keyof DefaultSchema["CompositeTypes"]')
    out.append('    | { schema: keyof DatabaseWithoutInternals },')
    out.append('  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {')
    out.append('    schema: keyof DatabaseWithoutInternals')
    out.append('  }')
    out.append('    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]')
    out.append('    : never = never,')
    out.append('> = PublicCompositeTypeNameOrOptions extends {')
    out.append('  schema: keyof DatabaseWithoutInternals')
    out.append('}')
    out.append('  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]')
    out.append('  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]')
    out.append('    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]')
    out.append('    : never')
    out.append('')
    out.append('export const Constants = {')
    out.append('  graphql_public: { Enums: {} },')
    out.append('  public: { Enums: {} },')
    out.append('} as const')

    with open('src/types/supabase.ts', 'w') as f:
        f.write('\n'.join(out))

    print(f'✅ Generated src/types/supabase.ts ({len(out)} lines, {len(tables)} tables)')


def load_dotenv(path='.env'):
    """Load a .env file into os.environ using stdlib (no pip deps)."""
    if not os.path.isfile(path):
        return
    with open(path, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            key, _, val = line.partition('=')
            key = key.strip()
            val = val.strip()
            if key not in os.environ:  # don't override already-set env vars
                os.environ[key] = val


def main():
    load_dotenv()

    api_key = os.environ.get('SUPABASE_MANAGEMENT_KEY')

    if not api_key:
        print('❌ SUPABASE_MANAGEMENT_KEY is not set.')
        print()
        print('   Add it to .env:')
        print('     SUPABASE_MANAGEMENT_KEY=sbp_your_key_here')
        print()
        print('   Or export it directly:')
        print('     export SUPABASE_MANAGEMENT_KEY="your_key_here"')
        print('     npm run gen-types')
        print()
        sys.exit(1)

    print('🔄 Fetching DB schema from Supabase...')
    try:
        col_data = fetch_schema(api_key)
    except urllib.error.HTTPError as e:
        print(f'❌ HTTP {e.code}: {e.reason}')
        print(f'   Response: {e.read().decode("utf-8")}')
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f'❌ Network error: {e.reason}')
        sys.exit(1)

    if isinstance(col_data, dict) and 'error' in col_data:
        if 'JWT' in str(col_data.get('message', '')) or 'token' in str(col_data.get('message', '')):
            print('❌ Invalid or expired SUPABASE_MANAGEMENT_KEY.')
            print('   Generate a new key at: https://supabase.com/dashboard/account/tokens')
        else:
            print(f'❌ API error: {col_data.get("message", col_data)}')
        sys.exit(1)

    print(f'   Found {len(col_data)} columns across {len(set(r["table_name"] for r in col_data))} tables')
    generate(col_data)


if __name__ == '__main__':
    main()
