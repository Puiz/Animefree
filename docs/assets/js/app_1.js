
let ALL=[];
let currentId=null;
let currentEp=1;

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
  if(!items.length){ grid.innerHTML='<div style=color:#9aa0aa;padding:20px>ไม่มีข้อมูล</div>'; return; }
  grid.innerHTML = items.map(it=>`
    <a class="card" href="#" onclick="openDetail('${it.id}');return false;">
      <div style="position:relative">
        <img src="${it.cover}" loading="lazy" onerror="this.onerror=null;this.src='https://picsum.photos/seed/${it.id}/400/560'">
        <span class="badge">${it.episode||it.type||'อัพเดท'}</span>
      </div>
      <div class="meta"><div class="title">${it.title}</div><div class="sub">${it.type||''} • ${it.episode||''}</div></div>
    </a>`).join('');
  const countEl=document.getElementById('count');
  if(countEl) countEl.textContent = ALL.length + ' เรื่อง';
  const top=document.getElementById('topList');
  if(top) top.innerHTML = items.slice(0,5).map(it=>`<a href="#" onclick="openDetail('${it.id}');return false;" style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #262631;text-decoration:none;color:#fff"><img src="${it.cover}" style="width:48px;height:64px;object-fit:cover;border-radius:6px" onerror="this.src='https://picsum.photos/seed/${it.id}/100/100'"><div><div style="font-size:13px;line-height:1.3">${it.title.slice(0,45)}</div><small style="color:#ff6b00">${it.episode}</small></div></a>`).join('');
}

function setup(){
  const q=document.getElementById('q');
  if(q && !q.dataset.bound){
    q.dataset.bound="1";
    q.addEventListener('input', e=>{
      const v=e.target.value.toLowerCase().trim();
      render(v? ALL.filter(it=>it.title.toLowerCase().includes(v) || it.id.includes(v)): ALL);
    });
  }
  document.querySelectorAll('[data-filter]').forEach(b=>{
    if(b.dataset.bound) return;
    b.dataset.bound="1";
    b.addEventListener('click',()=>{
      document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      const f=b.dataset.filter;
      render(f==='all'? ALL: ALL.filter(it=>(it.type||'').includes(f) || it.title.includes(f)));
    });
  });
}

function openDetail(id){
  const it=ALL.find(x=>x.id===id);
  if(!it) return;
  currentId=id;
  // parse total episodes from string like "ตอน 1-12" or "1-282"
  let total=12;
  const m = (it.episode||'').match(/(\d+)\s*-\s*(\d+)/);
  if(m) total = parseInt(m[2]);
  else {
    const m2 = (it.episode||'').match(/(\d+)/);
    if(m2) total = Math.min(100, Math.max(12, parseInt(m2[1])));
  }
  if(total>100) total=24; // limit for demo

  document.getElementById('main').innerHTML=`
    <div style="margin-top:18px;display:grid;grid-template-columns:280px 1fr;gap:20px" class="detail-wrap">
      <div>
        <img src="${it.cover}" style="width:100%;border-radius:14px;border:1px solid #262631" onerror="this.src='https://picsum.photos/seed/${it.id}/400/560'">
        <div style="margin-top:12px;background:#1a1a22;border:1px solid #262631;border-radius:12px;padding:12px;font-size:13px;color:#9aa0aa">
          ประเภท: ${it.type}<br>
          ตอน: ${it.episode}<br>
          ที่มา: <a href="${it.link}" target="_blank" style="color:#ff6b00">ต้นฉบับ</a>
        </div>
      </div>
      <div>
        <a href="#" onclick="goHome();return false;" style="color:#9aa0aa;font-size:14px">← กลับหน้าแรก</a>
        <h1 style="margin:10px 0 6px;font-size:26px;line-height:1.3">${it.title}</h1>
        <p style="color:#9aa0aa;margin:6px 0">${it.type} • ${it.episode} • อัพเดท ${it.date||''}</p>
        <div style="margin:16px 0;display:flex;gap:10px">
          <a class="btn" href="#" onclick="openWatch('${it.id}',${total});return false;" style="background:#ff6b00;color:#000;padding:12px 20px;border-radius:10px;font-weight:800;text-decoration:none">▶ ดูตอนล่าสุด (ตอนที่ ${total})</a>
          <a class="btn" href="#" onclick="openWatch('${it.id}',1);return false;" style="background:#1a1a22;color:#fff;border:1px solid #262631;padding:12px 20px;border-radius:10px;text-decoration:none">ดูตอนแรก</a>
        </div>
        <h3>ตอนทั้งหมด (${total} ตอน)</h3>
        <div class="ep-list" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">
          ${Array.from({length:total},(_,i)=>`<a href="#" onclick="openWatch('${it.id}',${i+1});return false;" style="padding:10px 14px;background:#1a1a22;border:1px solid #262631;border-radius:8px;color:#fff;text-decoration:none">ตอน ${i+1}</a>`).join('')}
        </div>
      </div>
    </div>`;
}

function openWatch(id, ep){
  const it=ALL.find(x=>x.id===id);
  if(!it) return;
  currentId=id; currentEp=ep;
  let total=24;
  const m = (it.episode||'').match(/(\d+)\s*-\s*(\d+)/);
  if(m) total = parseInt(m[2]);
  if(total>100) total=24;

  document.getElementById('main').innerHTML=`
    <div style="margin-top:16px">
      <a href="#" onclick="openDetail('${id}');return false;" style="color:#9aa0aa">← กลับไป ${it.title.slice(0,30)}</a>
      <h2 style="margin:12px 0">${it.title} - ตอนที่ ${ep}</h2>
      <div style="aspect-ratio:16/9;background:#000;border-radius:14px;overflow:hidden;position:relative;display:grid;place-items:center;border:1px solid #262631">
        <div style="text-align:center;color:#777;padding:20px">
          <div style="font-size:48px">▶</div>
          <div style="margin-top:8px;color:#fff;font-size:18px">กำลังเล่นตอนที่ ${ep}</div>
          <div style="margin-top:6px;color:#9aa0aa;font-size:13px">Player นี้พร้อมใส่ลิงก์วิดีโอถูกลิขสิทธิ์ของคุณ<br>รองรับ MP4, HLS, YouTube, Google Drive</div>
          <div style="margin-top:14px"><span style="background:#ff6b00;color:#000;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:700">DEMO PLAYER - ${it.type}</span></div>
        </div>
      </div>
      <div style="margin:16px 0;display:flex;gap:10px;flex-wrap:wrap">
        <a href="#" onclick="openWatch('${id}',${Math.max(1,ep-1)});return false;" style="padding:10px 16px;background:#1a1a22;border:1px solid #262631;border-radius:8px;color:#fff;text-decoration:none">← ตอนก่อน</a>
        <a href="#" onclick="openWatch('${id}',${Math.min(total,ep+1)});return false;" style="padding:10px 16px;background:#ff6b00;color:#000;border-radius:8px;font-weight:700;text-decoration:none">ตอนต่อไป →</a>
        <a href="#" onclick="goHome();return false;" style="padding:10px 16px;background:#1a1a22;border:1px solid #262631;border-radius:8px;color:#fff;text-decoration:none">หน้าแรก</a>
      </div>
      <h3>เลือกตอน</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">
        ${Array.from({length:total},(_,i)=>{
          const n=i+1;
          const active = n===ep ? 'background:#ff6b00;color:#000;border-color:#ff6b00' : 'background:#1a1a22;color:#fff;border:1px solid #262631';
          return `<a href="#" onclick="openWatch('${id}',${n});return false;" style="padding:10px 14px;border-radius:8px;text-decoration:none;${active}">ตอน ${n}</a>`;
        }).join('')}
      </div>
    </div>`;
}

function goHome(){
  location.reload();
}

document.addEventListener('DOMContentLoaded', load);
