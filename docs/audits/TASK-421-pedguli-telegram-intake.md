# TASK-421 — PedMahoratGuli Telegram test intake audit

## Scope

- Drive source: `attestatsiya/pedagogika/result.json`
- Telegram export: `Pedmahorat|Guli` (`@PedMahoratGuli`)
- Messages inspected mechanically: **21,085**
- Export date range: **2025-02-03 — 2026-10-19**
- Poll messages: **1,910**
- Non-poll messages containing 3–6 answer markers: **2,488**

## Screening result

Telegram polls do not contain a reliable correct-answer field in the export, so none was imported automatically. Among text candidates, 560 messages had exactly one bold answer marker. Exact repeated messages were collapsed to 429 unique candidates. Database comparison then found:

| Classification | Count | Treatment |
| --- | ---: | --- |
| Existing Telegram source reference | 37 | Not imported again |
| Exact active content match | 18 | Not imported again |
| Same stem requiring editorial comparison | 16 | Held out |
| Source/content-novel candidate | 358 | Expert screening queue |

The bold marker was treated only as the channel's proposed key. It was not accepted as evidence of correctness.

## Accepted wave

The first expert-screened wave contains **16 rewritten Y1 questions**. Each item has:

- a stable Telegram message locator;
- a canonical KS or PM.GEN construct and published source lesson;
- four distinct options and one structurally valid key;
- an independent explanation;
- `review` status, preserving the required human publication gate.

Coverage: KS.01 (3), KS.02 (2), KS.03 (3), KS.04 (3), KS.06 (1), PM.GEN.06 (1), PM.GEN.08 (3).

## Full-history archive parity

The JSON contains 21,085 records: 20,591 ordinary messages and 494 Telegram service events. Production private archive contains 20,588 ordinary messages. The three non-archived message IDs were checked directly: two are empty posts (2889 and 12675), and one is a personal motivational story with score screenshots (19894). None is an attestation test. Therefore no test-bearing ordinary message is missing from the private archive.

## Rejection rules

The following were not imported:

- polls without a trustworthy answer key;
- questions whose answer depends on a missing photo, table or preceding message;
- advertisements, personal messages and course logistics;
- exact/semantic duplicates already present in the active bank;
- ambiguous questions with more than one defensible option;
- outdated or unsupported terminology;
- source keys contradicted by the task itself or canonical lesson content.

Examples include message 2481, whose marked Bloom answer does not match the stated activity; message 2572, where demonstration and laboratory activity are not separated clearly; and bare “Moslashtiring” messages without the referenced visual context.

## Release rule

This migration intentionally stages the accepted questions as `review`. It does not publish learner-visible content and does not deploy the application. Promotion to `published` requires a separate human editorial decision.

## Production postflight

- Questions inserted: 16
- Status `review`: 16
- Canonical lessons: 7
- Constructs: 7
- Four options + valid key + non-empty explanation: 16/16
- Application deploy: not performed
