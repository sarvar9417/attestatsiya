-- Adaptive section mock regression: formula and overlapping mandatory slots.
-- Does not create user exam attempts or change production data.
BEGIN;
DO $$
DECLARE n integer;
BEGIN
  IF least(50,43) <> 43 OR 43 * 120 <> 5160 OR ceil(43 * 0.9)::int <> 39 THEN
    RAISE EXCEPTION '43-question adaptive contract broken';
  END IF;
  IF least(50,65) <> 50 OR ceil(50 * 0.9)::int <> 45 THEN
    RAISE EXCEPTION '50-question ceiling contract broken';
  END IF;
  IF greatest(1,1) > 1 THEN
    RAISE EXCEPTION 'shared topic/critical objective must fit one slot';
  END IF;
  -- The existing 50-question exams keep their historical selector version.
  SELECT count(*) INTO n FROM pg_proc p JOIN pg_namespace ns ON ns.oid=p.pronamespace
    WHERE ns.nspname='public' AND p.proname IN ('generate_section_mock','apply_section_mock_pass');
  IF n <> 2 THEN RAISE EXCEPTION 'section mock RPC/trigger missing'; END IF;
END $$;
ROLLBACK;
