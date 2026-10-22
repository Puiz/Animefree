
let ALL=[];
async function load(){
  try{
    const res = await fetch('./api/latest.json?t='+Date.now());
    ALL = await res.json();
  }catch(e){ ALL=[]; }
  render(ALL);
  setup();
}
function render(items){
  const grid=document.getElementById('grid');
  if(!grid) return;
  if(!items.length){ grid.innerHTML='<div style=color:#9aa0aa>รอ GitHub Actions สร้าง api/latest.json</div>'; return; }
  grid.innerHTML = items.map(it=>`
    <a class="card" href="#" onclick="openDetail('${it.id}');return false;">
      <div style="position:relative"><img src="${it.cover}" loading="lazy" onerror="this.src='https://picsum.photos/seed/'+it.id+'/300/400'"><span class="badge">${it.episode||it.type}</span></div>
      <div class="meta"><div class="title">${it.title}</div><div class="sub">${it.type||''}</div></div>
    </a>`).join('');
  document.getElementById('count').textContent = ALL.length + ' เรื่อง';
  const top=document.getElementById('topList');
  if(top) top.innerHTML = items.slice(0,5).map(it=>`<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #262631"><img src="${it.cover}" style="width:48px;height:64px;object-fit:cover;border-radius:6px"><div><div style="font-size:13px">${it.title.slice(0,42)}</div><small style="color:#ff6b00">${it.episode}</small></div></div>`).join('');
}
function setup(){
  const q=document.getElementById('q');
  if(q) q.addEventListener('input', e=>{
    const v=e.target.value.toLowerCase();
    render(v? ALL.filter(it=>it.title.toLowerCase().includes(v)): ALL);
  });
  document.querySelectorAll('[data-filter]').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      const f=b.dataset.filter;
      render(f==='all'? ALL: ALL.filter(it=>(it.type||'').includes(f)));
    });
  });
}
function openDetail(id){
  const it=ALL.find(x=>x.id===id);
  document.getElementById('main').innerHTML=`<div style="margin-top:20px"><h1>${it.title}</h1><p style="color:#9aa0aa">${it.type} ${it.episode}</p><p>ที่มา: ${it.link}</p><a class="btn" href="#" onclick="location.reload();return false;">← กลับหน้าแรก</a></div>`;
}
document.addEventListener('DOMContentLoaded', load);
