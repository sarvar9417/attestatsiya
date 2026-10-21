# TASK-356 — Live-auth E2E fixture credential hygiene

The previous Playwright live-auth fixture contained a literal test-account password. Git history is permanent: rotate/disable the previous test account's password immediately through Supabase Auth and do not recycle it. This change removes plaintext credentials from HEAD and requires `E2E_LIVE_EMAIL` plus `E2E_LIVE_PASSWORD` in a secured test runner environment. Tests skip cleanly in CI without live credentials.

Do not print credentials, commit `.env` files, or run destructive/authenticated production E2E from untrusted branches. If real live tests are desired, use a dedicated least-privilege test account in an isolated test environment and protected CI secrets.
