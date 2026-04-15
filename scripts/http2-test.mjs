#!/usr/bin/env node
/**
 * Reach plantingcalc.com via HTTP/2 (Chrome's default) and report
 * protocol errors. Chrome's "This page couldn't load" is usually
 * a protocol-level abort. Node's undici supports HTTP/2.
 */
import { request } from "https";
import { connect } from "http2";

const HOST = "plantingcalc.com";
const PATH = "/";

console.log("=== HTTPS (HTTP/1.1) via node:https ===");
const req = request({ host: HOST, path: PATH, method: "GET" }, (res) => {
  console.log(`  status: ${res.statusCode}`);
  console.log(`  headers:`);
  for (const [k, v] of Object.entries(res.headers)) {
    console.log(`    ${k}: ${v}`);
  }
  let bytes = 0;
  res.on("data", (chunk) => (bytes += chunk.length));
  res.on("end", () => console.log(`  body: ${bytes} bytes\n`));
});
req.on("error", (e) => console.error("  ERROR:", e.message));
req.end();

console.log("=== HTTP/2 via node:http2 ===");
const client = connect(`https://${HOST}`);
client.on("error", (err) => {
  console.error("  CLIENT ERROR:", err.code, err.message);
});
client.on("connect", () => console.log("  h2 connected"));
client.on("goaway", (errorCode, lastStreamID, opaqueData) =>
  console.error("  GOAWAY:", errorCode, lastStreamID, opaqueData?.toString())
);

const h2req = client.request({
  ":method": "GET",
  ":path": PATH,
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "accept-encoding": "gzip, deflate, br, zstd",
  "accept-language": "en-US,en;q=0.9",
});
h2req.on("response", (headers) => {
  console.log(`  status: ${headers[":status"]}`);
  for (const [k, v] of Object.entries(headers)) {
    if (k !== ":status") console.log(`    ${k}: ${v}`);
  }
});
let h2bytes = 0;
h2req.on("data", (chunk) => (h2bytes += chunk.length));
h2req.on("end", () => {
  console.log(`  body: ${h2bytes} bytes`);
  client.close();
});
h2req.on("error", (err) =>
  console.error("  STREAM ERROR:", err.code, err.message)
);
h2req.end();
