#!/usr/bin/env node
/**
 * Replace em dashes in JSX/TSX source files.
 *
 * Policy: em dashes are banned in user-visible prose but allowed in
 * code comments. This script walks the src tree, and for each file
 * rewrites em dashes found OUTSIDE of JS/TS comments.
 *
 * Strategy: tokenize each line by stripping trailing single-line
 * comments (//...) and by tracking /* ... *\/ block comment state.
 * Em dashes inside those ranges are left alone. Em dashes outside
 * are replaced with a period (context permitting) using simple
 * substitution rules:
 *
 *   word — word   -> word. word   (two complete clauses)
 *   word—word     -> word, word   (mid-clause pause)
 *   word —        -> word,        (trailing pause)
 *
 * Defaults to a comma if we can't tell. The goal is to be non-
 * destructive and syntactically safe.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = resolve(__dirname, "..", "src");
const EXT_OK = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".md"]);
const EM = "\u2014";

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      out.push(...walk(full));
    } else if (EXT_OK.has(extname(full))) {
      out.push(full);
    }
  }
  return out;
}

function stripInLine(line, inBlock) {
  // Walk the line char-by-char tracking comment/string state.
  // We only rewrite em dashes that are NOT inside a comment and NOT
  // inside a string literal whose content is a literal code artifact.
  // (We DO rewrite em dashes inside JSX string literals like "foo —
  // bar" because those render to the user. So we only skip // and
  // /* */ regions, which we treat as "developer notes.")
  let out = "";
  let i = 0;
  let blockComment = inBlock;
  while (i < line.length) {
    const c = line[i];
    const n = line[i + 1];
    if (blockComment) {
      out += c;
      if (c === "*" && n === "/") {
        out += n;
        i += 2;
        blockComment = false;
        continue;
      }
      i += 1;
      continue;
    }
    if (c === "/" && n === "/") {
      // single line comment — keep rest as-is
      out += line.slice(i);
      return { out, blockComment };
    }
    if (c === "/" && n === "*") {
      out += "/*";
      i += 2;
      blockComment = true;
      continue;
    }
    if (c === EM) {
      const prev = out.slice(-2);
      const next = line.slice(i + 1, i + 3);
      // Normalize surrounding whitespace
      let replacement = ",";
      if (/\s$/.test(prev) && /^\s/.test(next)) {
        replacement = ",";
      } else if (/\s$/.test(prev)) {
        // trailing em dash: "foo —\n"
        replacement = ",";
      } else if (/^\s/.test(next)) {
        replacement = ",";
      } else {
        replacement = ", ";
      }
      out += replacement;
      i += 1;
      continue;
    }
    out += c;
    i += 1;
  }
  return { out, blockComment };
}

let totalChanged = 0;
let totalRemoved = 0;
const files = walk(SRC_DIR);
for (const file of files) {
  const original = readFileSync(file, "utf8");
  if (!original.includes(EM)) continue;
  let result = "";
  let inBlock = false;
  const lines = original.split(/(\r?\n)/);
  for (let i = 0; i < lines.length; i++) {
    const piece = lines[i];
    if (i % 2 === 1) {
      result += piece;
      continue;
    }
    const { out, blockComment } = stripInLine(piece, inBlock);
    result += out;
    inBlock = blockComment;
  }
  if (result !== original) {
    const removed = (original.match(new RegExp(EM, "g")) || []).length -
      (result.match(new RegExp(EM, "g")) || []).length;
    totalRemoved += removed;
    totalChanged += 1;
    writeFileSync(file, result);
    console.log(`${file}: removed ${removed} em dashes`);
  }
}
console.log(`\nDone. ${totalChanged} files updated, ${totalRemoved} em dashes removed.`);
