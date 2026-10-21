# QA18 — Original Test #13 visual alternatives and source release gates

Date: 2026-10-21. Source: `Attestatsiya test 6.pdf`, titled within the file `Attestatsiya test №13`, Drive ID `1QNeDPscVBVUDYwQTsme3EgQbE-UJMf3I`.

This is an **independent visual/source inspection**, not a source-author answer key. Source images are private and are not embedded in this Git commit.

## Source physical page 2: MS Access table

Transcribed all five source book rows (title/year/pages/type), including O‘tkan kunlar 2020/220/Roman; Informatika 2021/368/Darslik; Shum bola 2005/192/Qissa; Oltin zanglamas 2013/540/Roman; Molxona 2024/102/Qissa. The original query filters for book type `LIKE "*i*"` OR more than 150 pages. All five rows satisfy at least one arm: independently proposed **B (5 rows)**. The complete source table and fenced SQL are now authored within the private question text; visual index changed to `source_text_only`, but **content_publish_ready=false**. Its source image is not needed to compute the answer.

## Source physical page 3: HTML table alternative figures

Source HTML specifies `cellspacing="2"`, `cellpadding="5"`, three `<th>` header cells, `rowspan="2"` for Tashkent, `colspan="2"` for Total. Original four answer figures contrast whether cell borders are spaced and whether headers are bold. Independent comparison: **D**, because cells have spacing and headers are bold. The four options have been *semantically paraphrased* into text but original figures remain required before learner publication. Proposed D is not the original author key and was not human-approved. The original figure index remains `pdf_figure_not_exported_to_platform`, `content_publish_ready=false`.

## Source physical page 19: CSS specificity

Source CSS: `body{color:black}`, `p{color:gray}`, `.a{color:blue}`, `#b{color:green;background-color:pink}`, `img{display:block;margin:0 auto}`, with `<p class="a" id="b">`. The ID selector wins against the class and element styles: foreground **green** and background **pink**; the image is displayed as a centered block if the source image exists. In the original four visual options **B** matches those properties. Private answer figure descriptions and a proposed B were recorded, but the source graphic and external image dependency remain held for editorial review. No production figure publication.

## Source physical page 17: ambiguous animation timing

The segment graphic reads C, 0 and 2, consisting of approximately 4+6+5=15 drawn parts. At 12 FPS, two blank frames after **each of the three characters** makes 21 frames/12 = **1.75 sec**, absent from original A/B/C/D choices; two blank frames **only between** characters gives 19/12 = approx 1.583 sec, near source option 1.6. The question does not explicitly say whether to reserve blank frames after the last character or how to round. This ambiguity is source-grounded and a **private** release blocker was added under `ambiguous_or_nonunique_answer`; no answer key was guessed.

## Repeatable verification and nonpublication

`scripts/tests/test_informatika_test13_visual_qa18.py` supplies **8 offline standard-library checks**, covering the five-row SQL result and ordering, HTML cell properties, CSS specificity and image positioning, blank-frame ambiguity and unchanged learner release gates.

Immediately after the private DB writes, original Q2 had 4 choices, proposed B and `source_text_only`; Q3 had 4 semantically described choices, proposed D but still original graphic required. Q19 had 4 semantically described choices and proposed B, original graphic required. Q17 received a blocker; none of these source-derived proposed options are official keys.

**No original third-party PDF or image bytes in Git; zero human approvals claimed; zero learner publishing; no migrations or production deployment.**
