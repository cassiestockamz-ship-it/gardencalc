const SITE_ID = "17156a6b-a5cd-4caf-ac2c-c9c3977b436f"; // PlantingCalc in Supabase `sites`
const ENDPOINT = "https://project-dash-psi.vercel.app/api/track";

/**
 * Records a funnel step through the page-view pixel as path "<page>/_<step>", referrer null,
 * same session id, once per session per step. Lets us count how many landings reach a result
 * (sessions with "/frost-alert/_zip-result" over sessions landing on "/frost-alert").
 * Honours ?notrack (localStorage _no_track) like the pixel. Never throws.
 */
export function funnelStep(step: string): void {
  try {
    if (localStorage.getItem("_no_track") === "1") return;
    const sid = sessionStorage.getItem("_sid");
    if (!sid) return;
    const key = `_fs_${location.pathname}_${step}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    const d = screen.width < 768 ? "mobile" : screen.width < 1024 ? "tablet" : "desktop";
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        site_id: SITE_ID,
        path: `${location.pathname}/_${step}`,
        referrer: null,
        device_type: d,
        session_id: sid,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never break the page */
  }
}
