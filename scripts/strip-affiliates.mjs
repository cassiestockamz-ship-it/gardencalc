#!/usr/bin/env node
/**
 * Strip Amazon affiliate product cards + AMAZON_TAG constants from every
 * calculator page. AdSense "Low value content" recovery.
 *
 * Strategy: find the `{/* Affiliate Cards *\/}` marker line, then from the
 * next line find the opening `<div className="mt-10">` and walk forward
 * counting `<div` opens vs `</div>` closes until we reach matching depth 0.
 * That gives us the exact end of the wrapper div. Remove everything from
 * the marker through that closing </div> inclusive.
 *
 * Run: node scripts/strip-affiliates.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      yield* walk(full);
    } else if (entry === "page.tsx") {
      yield full;
    }
  }
}

const MARKER = "{/* Affiliate Cards */}";
const OPEN_WRAPPER = '<div className="mt-10">';

function stripFile(file) {
  const original = readFileSync(file, "utf8");
  if (!original.includes(MARKER)) return { touched: false };

  const lines = original.split("\n");
  const markerIdx = lines.findIndex((l) => l.includes(MARKER));
  if (markerIdx < 0) return { touched: false };

  // Find the opening wrapper div on the next non-blank line
  let openIdx = -1;
  for (let i = markerIdx + 1; i < lines.length; i++) {
    if (lines[i].includes(OPEN_WRAPPER)) {
      openIdx = i;
      break;
    }
    if (lines[i].trim() !== "") break; // stop if we hit something unexpected
  }
  if (openIdx < 0) {
    console.warn(`  WARN no wrapper div after marker: ${path.relative(root, file)}`);
    return { touched: false };
  }

  // Walk forward counting <div / </div> until depth reaches 0 after the opener
  let depth = 0;
  let closeIdx = -1;
  for (let i = openIdx; i < lines.length; i++) {
    const line = lines[i];
    // Count opens (ignoring </div>)
    const opens = (line.match(/<div(\s|>)/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    depth += opens - closes;
    if (depth === 0) {
      closeIdx = i;
      break;
    }
  }
  if (closeIdx < 0) {
    console.warn(`  WARN could not find close for wrapper: ${path.relative(root, file)}`);
    return { touched: false };
  }

  // Remove lines [markerIdx .. closeIdx] inclusive
  const before = lines.slice(0, markerIdx);
  const after = lines.slice(closeIdx + 1);

  // If the line right before the marker is blank, leave it; we're fine.
  // Also drop a trailing blank line if it makes sense
  let newLines = [...before, ...after];

  // Also strip `const AMAZON_TAG = "...";` line and any blank line around it
  newLines = newLines.filter((l, i, arr) => {
    if (/^\s*const\s+AMAZON_TAG\s*=\s*"[^"]*";\s*$/.test(l)) return false;
    return true;
  });

  // Collapse runs of 3+ blank lines to 1 blank line
  const collapsed = [];
  let blanks = 0;
  for (const l of newLines) {
    if (l.trim() === "") {
      blanks++;
      if (blanks <= 1) collapsed.push(l);
    } else {
      blanks = 0;
      collapsed.push(l);
    }
  }

  const updated = collapsed.join("\n");
  if (updated === original) return { touched: false };

  writeFileSync(file, updated, "utf8");
  return {
    touched: true,
    removed: original.length - updated.length,
    linesRemoved: (closeIdx - markerIdx + 1),
  };
}

const appDir = path.join(root, "src", "app");
let modified = 0;
for (const file of walk(appDir)) {
  const res = stripFile(file);
  if (res.touched) {
    modified++;
    console.log(`  stripped ${res.linesRemoved} lines from ${path.relative(root, file)} (-${res.removed} chars)`);
  }
}
console.log(`\nDone. Modified ${modified} file(s).`);
