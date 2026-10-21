# QA18 continuation: original block-scheme Q10 to safe textual Python

Drive source `Attestatsiya test 6.pdf`, physical original page **10** (inside titled Test #13). The diagram contains these exact decision and action steps: begin; input n; set i=2 and s=0; if i<=n, execute `s += i` and `i += 2` then loop; if not, output s and finish. The source asks for n=15.

The original algorithm was transcribed into a fenced `python` code example, preserving the conditional and iteration order. The values 2,4,6,8,10,12,14 sum to **56**, which appears as **source option C**. This is an independent solution proposal, not an original author answer key. No learner answer key or public question was set.

The private visual index was safely updated from `text_plus_figure` to `text_only` / `source_text_only` with `content_publish_ready=false`: all necessary flowchart semantics now exist as text, so its original third-party graphic need not be redistributed.

Offline no-network tests are at `scripts/tests/test_informatika_test13_flowchart_qa18.py` and cover the 7 iterations, original choice and nonpublication gates. This supplement modifies no production runtime, source PDF or public question table.
