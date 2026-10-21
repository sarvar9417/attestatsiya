# QA20 — Original Scratch source page 11, zero image dependency

Source: connected Drive original `Attestatsiya test 6.pdf`, titled inside `Attestatsiya test №13`, physical PDF page 11. This review uses the original graphic; no binary source media enters public Git.

## Exact source program recovered

Green-flag event:
1. Move sprite to stage `(x=0,y=0)`.
2. Reset two **custom variables** named `x` and `y` to 0.
3. Repeat exactly five times: turn **left (counterclockwise) by 90 degrees**; move 10 steps; increase custom variable `x` by the sprite's `x position`; increase custom variable `y` by the sprite's `y position`.
4. Initial Scratch direction 0 degrees points upward. These semantics are also described in [Kansas State's Scratch motion guide](https://textbooks.cs.ksu.edu/intro-scratch/02-blocks/04-motion/index.print.html), distinguishing clockwise and counterclockwise turn pictograms.

Stage positions after the five rotations/moves are `(-10,0),(-10,-10),(0,-10),(0,0),(-10,0)`. Adding each stage position to the custom variables gives final **x=-30, y=-20**, original **option D**. Note the final stage *position* `(-10,0)` is NOT the final *custom-variable value*.

In private staging, the original motion block graphic is represented by a complete ordered text description, under `source_text_only`. The original answer-choice options remain in their original order; independently proposed D is unapproved, no source-author answer key has been recorded. `content_publish_ready=false`.

`scripts/tests/test_informatika_test13_scratch_source_qa20.py` provides three no-network, no-DB tests covering five positions, original choice and different stage/custom variables.

No source image upload, public lesson/question mutation, migration or production deployment.
