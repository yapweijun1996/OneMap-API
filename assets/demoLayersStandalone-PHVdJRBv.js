import"./modulepreload-polyfill-B5Qt9EMX.js";const c=L.map("map").setView([1.3521,103.8198],12);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(c);const s=new Map,d=[{id:"schools",name:"Schools",category:"Education",icon:"🏫",queryName:"schools",description:"Primary, secondary, and junior colleges across Singapore"},{id:"parks",name:"Parks & Gardens",category:"Recreation",icon:"🌳",queryName:"nationalparks",description:"National parks, gardens, and green spaces"},{id:"libraries",name:"Public Libraries",category:"Community",icon:"📖",queryName:"libraries",description:"National Library Board libraries"},{id:"hawker",name:"Hawker Centres",category:"Food & Dining",icon:"🍜",queryName:"hawkercentres",description:"Licensed hawker centres"},{id:"supermarkets",name:"Supermarkets",category:"Shopping",icon:"🛒",queryName:"supermarkets",description:"Major supermarket locations"},{id:"childcare",name:"Childcare Centres",category:"Education",icon:"👶",queryName:"childcare",description:"Licensed childcare centres"},{id:"eldercare",name:"Eldercare Services",category:"Healthcare",icon:"👴",queryName:"eldercare",description:"Eldercare and senior activity centres"},{id:"dengue",name:"Dengue Clusters",category:"Health & Safety",icon:"🦟",queryName:"dengue_cluster",description:"Active dengue clusters (updated weekly)"},{id:"carpark",name:"HDB Car Parks",category:"Transport",icon:"🅿️",queryName:"hdb_car_park_information",description:"HDB car park locations and information"},{id:"cycling",name:"Cycling Paths",category:"Recreation",icon:"🚴",queryName:"cycling_path",description:"Park connector network and cycling paths"}];function l(e=""){const a=document.getElementById("layerList"),r=d.filter(t=>t.name.toLowerCase().includes(e.toLowerCase())||t.category.toLowerCase().includes(e.toLowerCase()));let n="",i="";r.forEach(t=>{t.category!==n&&(n!==""&&(i+="</div>"),i+=`<div class="mb-3">
            <div class="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2 px-2">${t.category}</div>
          `,n=t.category);const o=s.has(t.id);i+=`
          <div class="layer-item p-3 border-2 border-gray-200 rounded-xl cursor-pointer ${o?"layer-active":""}"
               data-layer-id="${t.id}">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xl">${t.icon}</span>
                <div>
                  <div class="font-semibold text-gray-900 text-sm">${t.name}</div>
                  <div class="text-xs text-gray-500">${t.description}</div>
                </div>
              </div>
              ${o?'<span class="text-purple-600 font-bold">✓</span>':""}
            </div>
          </div>
        `}),n!==""&&(i+="</div>"),a.innerHTML=i,document.querySelectorAll(".layer-item").forEach(t=>{t.addEventListener("click",()=>{const o=t.dataset.layerId;p(o)})})}async function p(e){const a=d.find(r=>r.id===e);if(a){if(s.has(e)){const r=s.get(e);c.removeLayer(r),s.delete(e)}else try{const r=await u(a);s.set(e,r)}catch(r){console.error("Failed to load layer:",r),alert(`Failed to load ${a.name}. This layer may not be available via the public API.`)}l(document.getElementById("layerSearch").value),m()}}async function u(e){const a=L.layerGroup().addTo(c);return y(e).forEach(n=>{const i=L.marker([n.lat,n.lng],{icon:L.divIcon({className:"custom-marker",html:`<div style="font-size: 24px;">${e.icon}</div>`,iconSize:[30,30]})});i.bindPopup(`
          <div class="p-2">
            <div class="font-bold text-lg mb-1">${e.icon} ${n.name}</div>
            <div class="text-sm text-gray-600">${e.name}</div>
            <div class="text-xs text-gray-500 mt-1">📍 ${n.lat.toFixed(4)}, ${n.lng.toFixed(4)}</div>
          </div>
        `),i.addTo(a)}),a}function y(e){const a=[],i=Math.floor(Math.random()*8)+5;for(let t=0;t<i;t++)a.push({name:`${e.name} ${t+1}`,lat:1.3521+(Math.random()-.5)*.1,lng:103.8198+(Math.random()-.5)*.1});return a}function m(){const e=document.getElementById("activeLayersInfo"),a=document.getElementById("activeLayersList");if(s.size===0){e.classList.add("hidden");return}e.classList.remove("hidden");let r="";s.forEach((n,i)=>{const t=d.find(o=>o.id===i);r+=`
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-white border-2 border-purple-200 rounded-lg text-sm">
            <span>${t.icon}</span>
            <span class="font-medium">${t.name}</span>
            <button class="ml-1 text-purple-600 hover:text-purple-800" onclick="toggleLayer('${i}')">✕</button>
          </span>
        `}),a.innerHTML=r}document.getElementById("layerSearch").addEventListener("input",e=>{l(e.target.value)});document.getElementById("btnClearLayers").addEventListener("click",()=>{s.forEach((e,a)=>{c.removeLayer(e)}),s.clear(),l(document.getElementById("layerSearch").value),m()});l();setTimeout(()=>{const e=document.getElementById("layerDetails"),a=document.getElementById("layerDetailsContent");a.innerHTML=`
        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p class="font-semibold text-yellow-900 mb-2">ℹ️ Demo Mode</p>
          <p class="text-sm text-yellow-800 mb-2">
            This demo shows sample data points. In a production environment, you would:
          </p>
          <ul class="text-sm text-yellow-800 list-disc list-inside space-y-1">
            <li>Use OneMap's <strong>Themes API</strong> to fetch real data</li>
            <li>Implement proper authentication with API tokens</li>
            <li>Handle pagination for large datasets</li>
            <li>Add filtering and search capabilities</li>
            <li>Display actual government data from various sources</li>
          </ul>
          <p class="text-sm text-yellow-800 mt-2">
            <strong>API Endpoint:</strong> <code class="bg-yellow-100 px-2 py-1 rounded">https://www.onemap.gov.sg/api/public/themesvc/retrieveTheme</code>
          </p>
        </div>
        <div class="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <p class="font-semibold text-purple-900 mb-2">📚 Available Theme Categories</p>
          <div class="grid grid-cols-2 gap-2 text-sm text-purple-800">
            <div>• Education (Schools, Childcare)</div>
            <div>• Healthcare (Hospitals, Clinics)</div>
            <div>• Recreation (Parks, Sports)</div>
            <div>• Transport (MRT, Bus Stops)</div>
            <div>• Community (Libraries, CCs)</div>
            <div>• Safety (Police, Fire Stations)</div>
            <div>• Planning (URA Master Plan)</div>
            <div>• Environment (Dengue, Weather)</div>
          </div>
        </div>
      `,e.classList.remove("hidden")},1e3);window.toggleLayer=p;
