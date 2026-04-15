#!/usr/bin/env node
/**
 * Fix ` , ` patterns that were produced by the em-dash stripper when
 * the surrounding context needed a colon or period break. Runs on the
 * whole src tree, line by line, with two rules:
 *
 *  1. If a line contains a title/name/template/default/headline key
 *     (meaning the em dash was separating a title from a subtitle),
 *     replace ` , ` with `: `.
 *
 *  2. Otherwise, treat it as prose and replace ` , ` with `. ` and
 *     capitalize the next letter. This turns parenthetical em-dash
 *     breaks into sentence breaks, which reads cleanly.
 *
 * Both rules are idempotent: a second run on clean text is a no-op
 * because the input pattern (space comma space) is gone.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = resolve(__dirname, "..", "src");
const EXT_OK = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".md"]);

const TITLE_HINTS = /\b(title|name|template|default|headline|label|desc|description)\s*[:=]/;

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

function fixLine(line) {
  if (!line.includes(" , ")) return line;
  if (TITLE_HINTS.test(line)) {
    return line.replace(/ , /g, ": ");
  }
  return line.replace(/ , (\S)/g, (_m, ch) => `. ${ch.toUpperCase()}`);
}

let changed = 0;
const files = walk(SRC_DIR);
for (const file of files) {
  const original = readFileSync(file, "utf8");
  if (!original.includes(" , ")) continue;
  const next = original
    .split(/(\r?\n)/)
    .map((part, i) => (i % 2 === 1 ? part : fixLine(part)))
    .join("");
  if (next !== original) {
    writeFileSync(file, next);
    const removed =
      (original.match(/ , /g) || []).length -
      (next.match(/ , /g) || []).length;
    console.log(`${file}: fixed ${removed} comma breaks`);
    changed += 1;
  }
}
console.log(`\n${changed} files updated.`);
