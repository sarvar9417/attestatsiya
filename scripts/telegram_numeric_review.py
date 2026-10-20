#!/usr/bin/env python3
"""Offline, non-executing Python literal-expression check for private Telegram QA.

Input: private JSONL with candidate_id, source_message_id, question, answer_choices.
Output: private review suggestions, NEVER published question keys. Do not commit outputs.
"""
from __future__ import annotations

import argparse
import ast
import json
import operator
import re
from collections import Counter
from pathlib import Path

OPS = {
    ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul,
    ast.FloorDiv: operator.floordiv, ast.Mod: operator.mod,
    ast.BitAnd: operator.and_, ast.BitOr: operator.or_,
    ast.BitXor: operator.xor, ast.LShift: operator.lshift,
    ast.RShift: operator.rshift,
}
UNARY = {ast.UAdd: operator.pos, ast.USub: operator.neg,
         ast.Invert: operator.invert, ast.Not: operator.not_}
COMPARE = {ast.Eq: operator.eq, ast.NotEq: operator.ne,
           ast.Lt: operator.lt, ast.LtE: operator.le,
           ast.Gt: operator.gt, ast.GtE: operator.ge}
LIMIT = 10**12

class NeedsReview(Exception):
    """The source snippet is unsupported or ambiguous."""

def _bounded(value):
    if type(value) not in (int, bool):
        raise NeedsReview("non-numeric value")
    if type(value) is int and abs(value) > LIMIT:
        raise NeedsReview("numeric limit")
    return value

def interpret(tree: ast.AST, depth=0):
    """Evaluate a deliberately restricted AST subset. No eval/exec/calls/names."""
    if depth > 15:
        raise NeedsReview("nested input")
    if isinstance(tree, ast.Constant):
        return _bounded(tree.value)
    if isinstance(tree, ast.UnaryOp) and type(tree.op) in UNARY:
        return _bounded(UNARY[type(tree.op)](interpret(tree.operand, depth+1)))
    if isinstance(tree, ast.BoolOp) and type(tree.op) in (ast.And, ast.Or):
        result = interpret(tree.values[0], depth+1)
        for element in tree.values[1:]:
            if isinstance(tree.op, ast.And) and not result:
                break
            if isinstance(tree.op, ast.Or) and result:
                break
            result = interpret(element, depth+1)
        return _bounded(result)
    if isinstance(tree, ast.BinOp) and type(tree.op) in OPS:
        left, right = interpret(tree.left, depth+1), interpret(tree.right, depth+1)
        if isinstance(tree.op, (ast.LShift, ast.RShift)) and not 0 <= right <= 40:
            raise NeedsReview("shift limit")
        if isinstance(tree.op, (ast.Mod, ast.FloorDiv)) and right == 0:
            raise NeedsReview("division by zero")
        return _bounded(OPS[type(tree.op)](left, right))
    if isinstance(tree, ast.Compare):
        left = interpret(tree.left, depth+1)
        for op, child in zip(tree.ops, tree.comparators):
            fn = COMPARE.get(type(op))
            if fn is None:
                raise NeedsReview("unsupported comparison")
            right = interpret(child, depth+1)
            if not fn(left, right):
                return False
            left = right
        return True
    raise NeedsReview("unsupported expression AST")

def print_result(stem: str):
    match = re.search(r"(?<!\w)print\s*\(", stem)
    if match is None:
        raise NeedsReview("no print")
    start = match.end()-1
    depth = 0
    end = None
    for pos in range(start, len(stem)):
        if stem[pos] == "(":
            depth += 1
        elif stem[pos] == ")":
            depth -= 1
            if depth == 0:
                end = pos
                break
    if end is None:
        raise NeedsReview("unbalanced parentheses")
    expression = stem[start+1:end].strip()
    suffix = stem[end+1:].strip()
    if len(expression) > 180 or "\n" in expression or not re.fullmatch(r"[.!?\s]*", suffix):
        raise NeedsReview("multi-statement/long input")
    try:
        parsed = ast.parse(expression, mode="eval")
    except SyntaxError as err:
        raise NeedsReview("invalid Python") from err
    return expression, interpret(parsed.body)

def suggest(row):
    answers = row["answer_choices"]
    if len(answers) != 4 or len({a.strip().casefold() for a in answers}) != 4:
        return None
    expr, value = print_result(row["question"])
    wanted = str(value)
    matches = [i for i, answer in enumerate(answers) if answer.strip() == wanted]
    if len(matches) != 1:
        return None
    return {
        "candidate_id": row["candidate_id"],
        "source_message_id": row["source_message_id"],
        "suggested_answer_index": matches[0],
        "computed_output": wanted,
        "explanation_uz": f"Python ifodasi {expr} xavfsiz AST hisoblagichda hisoblandi. print() natijasi: {wanted}.",
        "verification_method": "restricted_python_ast_v1",
        "review_state": "machine_verified_review_only",
        "human_approved": False,
        "published": False,
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("candidate_jsonl", type=Path)
    parser.add_argument("review_output_jsonl", type=Path)
    args = parser.parse_args()
    stats = Counter()
    with args.candidate_jsonl.open(encoding="utf-8") as src, \
         args.review_output_jsonl.open("w", encoding="utf-8") as dest:
        for line in src:
            row = json.loads(line)
            if re.search(r"(?<!\w)print\s*\(", row["question"]) is None:
                continue
            stats["print_candidates"] += 1
            try:
                proposal = suggest(row)
                if proposal is None:
                    stats["no_unique_matching_choice"] += 1
                else:
                    dest.write(json.dumps(proposal, ensure_ascii=False)+"\n")
                    stats["suggestions"] += 1
            except (NeedsReview, ValueError, TypeError, OverflowError, ZeroDivisionError):
                stats["requires_manual_review"] += 1
    print(json.dumps(stats, indent=2))

if __name__ == "__main__":
    main()
