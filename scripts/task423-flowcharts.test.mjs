import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const sourceId = '13k9q8hDA5b-s-5x8p1apCAnRqJaLKtmi';

function load(n) {
  return readFileSync(resolve(root, 'docs/qa/task423-flowcharts', 'savol_' + n + '.dot'), 'utf8');
}

function parseGraph(dot) {
  const nodes = Array.from(dot.matchAll(/^\s*(\w+)\s+\[label=".*?",shape=(\w+)\];$/gm), ([, id, shape]) => ({ id, shape }));
  const edges = Array.from(dot.matchAll(/^\s*(\w+)\s+->\s+(\w+)(?:\s+\[label="([^"]+)"\])?;$/gm), ([, from, to, label]) => ({ from, to, label }));
  return { nodes, edges };
}

for (let n = 15; n <= 24; n += 1) {
  test('TASK-423: savol ' + n + ' source and graph safety', () => {
    const source = load(n);
    assert.match(source, new RegExp('digraph savol_' + n + '\\s*\\{'));
    assert.ok(source.includes('PDF page ' + (n - 6)));
    assert.ok(source.includes(sourceId));
    assert.doesNotMatch(source, /\b(?:image|href|URL)\s*=|<script|javascript:/i);
    const { nodes, edges } = parseGraph(source);
    const nodeIds = new Set(nodes.map(({ id }) => id));
    assert.ok(nodes.length >= 6, 'at least 6 graph nodes');
    assert.equal(nodeIds.size, nodes.length, 'unique graph IDs');
    assert.ok(nodeIds.has('start') && nodeIds.has('end'));
    assert.ok(edges.length >= 6, 'graph edges included');
    assert.ok(edges.every(({ from, to }) => nodeIds.has(from) && nodeIds.has(to)));
    const reachable = new Set(['start']);
    let changed = true;
    while (changed) {
      changed = false;
      for (const { from, to } of edges) {
        if (reachable.has(from) && !reachable.has(to)) {
          reachable.add(to);
          changed = true;
        }
      }
    }
    assert.equal(reachable.size, nodes.length, 'all nodes reachable');
    assert.ok(reachable.has('end'));
    if (n !== 17) {
      assert.ok(edges.some(({ label }) => label === 'ha'));
      assert.ok(edges.some(({ label }) => label === "yo'q"));
    } else {
      assert.match(source, /i = 1 \.\. 5/);
    }
  });
}

test('TASK-423: Graphviz renders all sources and exposes no scripts', (t) => {
  const available = spawnSync('dot', ['-V'], { encoding: 'utf8' });
  if (available.error?.code === 'ENOENT') {
    t.skip('Graphviz not installed; run on CI with graphviz installed');
    return;
  }
  assert.equal(available.status, 0);
  for (let n = 15; n <= 24; n += 1) {
    const result = spawnSync('dot', ['-Tsvg'], { input: load(n), encoding: 'utf8' });
    assert.equal(result.status, 0, 'Graphviz render failed for savol_' + n + ': ' + result.stderr);
    assert.match(result.stdout, /<svg[\s>]/);
    assert.doesNotMatch(result.stdout, /<script|onload\s*=|<foreignObject|<image|xlink:href\s*=\s*["']https?:/i);
  }
});
