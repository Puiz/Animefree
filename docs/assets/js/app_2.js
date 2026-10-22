
let ALL=[];let currentId=null;let currentEp=1;
async function load(){
  try{const res=await fetch('./api/latest.json?t='+Date.now());ALL=await res.json();}catch(e){ALL=[];}
  render(ALL);setup();
}
function render(items){
  const grid=document.getElementById('grid');if(!grid)return;
  grid.innerHTML=items.map(it=>`<a class="card" href="#" onclick="openDetail('${it.id}');return false;"><div style="position:relative"><img src="${it.cover}" loading="lazy" onerror="this.src='https://picsum.photos/seed/${it.id}/400/560'"><span class="badge">${it.episode||it.type}</span></div><div class="meta"><div class="title">${it.title}</div><div class="sub">${it.type}</div></div></a>`).join('');
  document.getElementById('count').textContent=ALL.length+' เรื่อง';
  const top=document.getElementById('topList');if(top)top.innerHTML=items.slice(0,5).map(it=>`<a href="#" onclick="openDetail('${it.id}');return false;" style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #262631;color:#fff;text-decoration:none"><img src="${it.cover}" style="width:48px;height:64px;object-fit:cover;border-radius:6px"><div><div style="font-size:13px">${it.title.slice(0,42)}</div><small style="color:#ff6b00">${it.episode}</small></div></a>`).join('');
}
function setup(){
  const q=document.getElementById('q');
  if(q&&!q.dataset.bound){q.dataset.bound="1";q.addEventListener('input',e=>{const v=e.target.value.toLowerCase();render(v?ALL.filter(it=>it.title.toLowerCase().includes(v)):ALL);});}
}
function openDetail(id){
  const it=ALL.find(x=>x.id===id);if(!it)return;
  let total=12;const m=(it.episode||'').match(/(\d+)\s*-\s*(\d+)/);if(m)total=parseInt(m[2]);
  if(total>100)total=24;
  document.getElementById('main').innerHTML=`<div style="margin-top:18px;display:grid;grid-template-columns:280px 1fr;gap:20px"><div><img src="${it.cover}" style="width:100%;border-radius:14px" onerror="this.src='https://picsum.photos/seed/${it.id}/400/560'"><div style="margin-top:12px;background:#1a1a22;border:1px solid #262631;border-radius:12px;padding:12px;font-size:13px;color:#9aa0aa">ประเภท: ${it.type}<br>ตอน: ${it.episode}<br><a href="${it.link}" target="_blank" style="color:#ff6b00">ต้นฉบับ</a></div></div><div><a href="#" onclick="goHome();return false;" style="color:#9aa0aa">← กลับ</a><h1>${it.title}</h1><div style="margin:16px 0;display:flex;gap:10px"><a class="btn" href="#" onclick="openWatch('${it.id}',${total});return false;" style="background:#ff6b00;color:#000;padding:12px 20px;border-radius:10px;font-weight:800;text-decoration:none">▶ ดูตอนล่าสุด</a><a class="btn" href="#" onclick="openWatch('${it.id}',1);return false;" style="background:#1a1a22;color:#fff;border:1px solid #262631;padding:12px 20px;border-radius:10px;text-decoration:none">ดูตอนแรก</a></div><h3>ตอนทั้งหมด (${total})</h3><div style="display:flex;flex-wrap:wrap;gap:8px">${Array.from({length:total},(_,i)=>`<a href="#" onclick="openWatch('${it.id}',${i+1});return false;" style="padding:10px 14px;background:#1a1a22;border:1px solid #262631;border-radius:8px;color:#fff;text-decoration:none">ตอน ${i+1}</a>`).join('')}</div></div></div>`;
}
function openWatch(id,ep){
  const it=ALL.find(x=>x.id===id);let total=24;const m=(it.episode||'').match(/(\d+)\s*-\s*(\d+)/);if(m)total=parseInt(m[2]);if(total>100)total=24;
  document.getElementById('main').innerHTML=`<div style="margin-top:16px"><a href="#" onclick="openDetail('${id}');return false;" style="color:#9aa0aa">← กลับ</a><h2>${it.title} - ตอนที่ ${ep}</h2><div style="aspect-ratio:16/9;background:#000;border-radius:14px;display:grid;place-items:center;border:1px solid #262631"><div style="text-align:center"><div style="font-size:48px">▶</div><div style="color:#fff">กำลังเล่นตอนที่ ${ep}</div><div style="color:#9aa0aa;font-size:13px">ใส่ลิงก์วิดีโอของคุณใน latest.json field embed</div></div></div><div style="margin:16px 0;display:flex;gap:10px"><a href="#" onclick="openWatch('${id}',${Math.max(1,ep-1)});return false;" style="padding:10px 16px;background:#1a1a22;border:1px solid #262631;border-radius:8px;color:#fff;text-decoration:none">← ก่อน</a><a href="#" onclick="openWatch('${id}',${Math.min(total,ep+1)});return false;" style="padding:10px 16px;background:#ff6b00;color:#000;border-radius:8px;font-weight:700;text-decoration:none">ต่อไป →</a></div><div style="display:flex;flex-wrap:wrap;gap:8px">${Array.from({length:total},(_,i)=>{const n=i+1;const a=n===ep?'background:#ff6b00;color:#000':'background:#1a1a22;color:#fff;border:1px solid #262631';return `<a href="#" onclick="openWatch('${id}',${n});return false;" style="padding:10px 14px;border-radius:8px;text-decoration:none;${a}">ตอน ${n}</a>`}).join('')}</div></div>`;
}
function goHome(){location.reload();}
document.addEventListener('DOMContentLoaded',load);
