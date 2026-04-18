export function GET() {
  return new Response("Gone", { status: 410, headers: { "Content-Type": "text/plain" } });
}
