const SITE_ID = "17156a6b-a5cd-4caf-ac2c-c9c3977b436f"; // PlantingCalc in Supabase `sites`
const ENDPOINT = "https://project-dash-psi.vercel.app/api/track";
const SNIPPET = `(function(){try{if(new URLSearchParams(location.search).has('notrack')){localStorage.setItem('_no_track','1')}if(localStorage.getItem('_no_track')==='1')return;var s=sessionStorage.getItem('_sid');if(!s){s=Math.random().toString(36).slice(2)+Date.now().toString(36);sessionStorage.setItem('_sid',s)}var d=screen.width<768?'mobile':screen.width<1024?'tablet':'desktop';fetch('${ENDPOINT}',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site_id:'${SITE_ID}',path:location.pathname,referrer:document.referrer||null,device_type:d,session_id:s}),keepalive:true}).catch(function(){})}catch(e){}})();`;
/** Project Dash page-view pixel. Fires once per hard page load; ?notrack=1 opts a browser out. */
export default function TrackingPixel() {
  return <script dangerouslySetInnerHTML={{ __html: SNIPPET }} />;
}
