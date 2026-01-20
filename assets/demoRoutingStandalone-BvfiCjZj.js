import"./modulepreload-polyfill-B5Qt9EMX.js";const n=L.map("map").setView([1.3521,103.8198],12);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(n);let r=null,v=null,p=null;const g=document.getElementById("startLat"),x=document.getElementById("startLng"),y=document.getElementById("endLat"),b=document.getElementById("endLng"),f=document.getElementById("routeType"),m=document.getElementById("btnRoute"),$=document.getElementById("btnSwap"),R=document.getElementById("btnClear"),h=document.getElementById("errorMsg"),w=document.getElementById("routeSummary"),M=document.getElementById("summaryContent"),k=document.getElementById("directionsPanel"),S=document.getElementById("directionsContent");document.querySelectorAll(".example-btn").forEach(e=>{e.addEventListener("click",()=>{const[t,s]=e.dataset.start.split(","),[a,l]=e.dataset.end.split(",");g.value=t,x.value=s,y.value=a,b.value=l,B()})});async function B(){const e=parseFloat(g.value),t=parseFloat(x.value),s=parseFloat(y.value),a=parseFloat(b.value);if(!e||!t||!s||!a){E("Please enter valid start and end coordinates");return}h.classList.add("hidden"),m.disabled=!0,m.textContent="🔄 Calculating Route...";try{const l=new URLSearchParams({start:`${e},${t}`,end:`${s},${a}`,routeType:f.value}),i=await(await fetch(`https://www.onemap.gov.sg/api/public/routingsvc/route?${l}`)).json();i.status_message==="Found route between points"?_(i,e,t,s,a):E("No route found. Please try different locations.")}catch(l){E("Route calculation failed: "+l.message)}finally{m.disabled=!1,m.textContent="🗺️ Get Route"}}function _(e,t,s,a,l){r&&n.removeLayer(r),v&&n.removeLayer(v),p&&n.removeLayer(p);const d=F(e.route_geometry);r=L.polyline(d,{color:"#10b981",weight:5,opacity:.7}).addTo(n),v=L.marker([t,s],{icon:L.divIcon({className:"custom-marker",html:'<div style="background: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">A</div>',iconSize:[32,32]})}).addTo(n),p=L.marker([a,l],{icon:L.divIcon({className:"custom-marker",html:'<div style="background: #ef4444; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">B</div>',iconSize:[32,32]})}).addTo(n),n.fitBounds(r.getBounds().pad(.1));const i=Math.round(e.route_summary.total_time/60),o=(e.route_summary.total_distance/1e3).toFixed(2);if(M.innerHTML=`
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-green-50 rounded-xl text-center">
            <div class="text-3xl mb-2">⏱️</div>
            <div class="text-2xl font-bold text-green-900">${i} min</div>
            <div class="text-sm text-green-700">Estimated Time</div>
          </div>
          <div class="p-4 bg-blue-50 rounded-xl text-center">
            <div class="text-3xl mb-2">📏</div>
            <div class="text-2xl font-bold text-blue-900">${o} km</div>
            <div class="text-sm text-blue-700">Total Distance</div>
          </div>
          <div class="p-4 bg-purple-50 rounded-xl text-center">
            <div class="text-3xl mb-2">${P(f.value)}</div>
            <div class="text-2xl font-bold text-purple-900">${j(f.value)}</div>
            <div class="text-sm text-purple-700">Route Type</div>
          </div>
        </div>
      `,w.classList.remove("hidden"),e.route_instructions&&e.route_instructions.length>0){let c='<div class="space-y-2">';e.route_instructions.forEach((u,I)=>{const T=(u[2]/1e3).toFixed(2),C=Math.round(u[3]/60);c+=`
            <div class="route-step p-4 border-2 border-gray-200 rounded-xl">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  ${I+1}
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 mb-1">${u[9]||"Continue"}</p>
                  <div class="flex gap-4 text-sm text-gray-600">
                    <span>📏 ${T} km</span>
                    <span>⏱️ ${C} min</span>
                  </div>
                </div>
              </div>
            </div>
          `}),c+="</div>",S.innerHTML=c,k.classList.remove("hidden")}}function F(e){const t=[];let s=0,a=0,l=0;for(;s<e.length;){let d,i=0,o=0;do d=e.charCodeAt(s++)-63,o|=(d&31)<<i,i+=5;while(d>=32);const c=o&1?~(o>>1):o>>1;a+=c,i=0,o=0;do d=e.charCodeAt(s++)-63,o|=(d&31)<<i,i+=5;while(d>=32);const u=o&1?~(o>>1):o>>1;l+=u,t.push([a/1e5,l/1e5])}return t}function P(e){return{drive:"🚗",walk:"🚶",cycle:"🚴",pt:"🚌"}[e]||"🚗"}function j(e){return{drive:"Driving",walk:"Walking",cycle:"Cycling",pt:"Public Transport"}[e]||"Driving"}function E(e){h.textContent=e,h.classList.remove("hidden")}m.addEventListener("click",B);$.addEventListener("click",()=>{const e=g.value,t=x.value;g.value=y.value,x.value=b.value,y.value=e,b.value=t});R.addEventListener("click",()=>{g.value="",x.value="",y.value="",b.value="",f.value="drive",h.classList.add("hidden"),w.classList.add("hidden"),k.classList.add("hidden"),r&&n.removeLayer(r),v&&n.removeLayer(v),p&&n.removeLayer(p),n.setView([1.3521,103.8198],12)});
