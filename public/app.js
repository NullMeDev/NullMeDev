const $ = s => document.querySelector(s);
const fmt = n => new Intl.NumberFormat().format(n);

function starsBG() {
  const c = document.getElementById('stars');
  const d = c.getContext('2d');
  let w, h, s;
  function resize(){ w = c.width = innerWidth; h = c.height = innerHeight; s = Array.from({length:260}, ()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.8+0.2,dx:(Math.random()-.5)*0.05,dy:(Math.random()-.5)*0.05})); }
  function frame(){ d.clearRect(0,0,w,h); d.fillStyle = '#fff'; for(const p of s){ p.x+=p.dx; p.y+=p.dy; if(p.x<0||p.x>w) p.dx*=-1; if(p.y<0||p.y>h) p.dy*=-1; d.globalAlpha = 0.6; d.beginPath(); d.arc(p.x,p.y,p.r,0,Math.PI*2); d.fill(); } requestAnimationFrame(frame); }
  addEventListener('resize', resize); resize(); frame();
}

function renderCharts(data){
  const ctx1 = document.getElementById('langChart');
  new Chart(ctx1, { type: 'doughnut',
    data: { labels: data.languages.map(l => l.name), datasets: [{ data: data.languages.map(l => l.percent) }] },
    options: { plugins: { legend: { position: 'bottom' } } }
  });

  const ctx2 = document.getElementById('starsChart');
  new Chart(ctx2, { type: 'bar',
    data: { labels: data.starsTop.map(r => r.name), datasets: [{ data: data.starsTop.map(r => r.stars), label: 'Stars' }] },
    options: { plugins: { legend: { display: false } }, scales: { x: { ticks: { autoSkip: false } } } }
  });

  const ctx3 = document.getElementById('repoYearChart');
  new Chart(ctx3, { type: 'line',
    data: { labels: data.reposPerYear.map(d => d.year), datasets: [{ data: data.reposPerYear.map(d => d.count), label: 'Repos', fill: false }] },
    options: { plugins: { legend: { display: false } } }
  });
}

function unique(arr){ return Array.from(new Set(arr)); }

function buildGrid(data){
  const all = data.repoList;
  const grid = $('#grid');
  const search = $('#search');
  const langSel = $('#langFilter');
  const sortSel = $('#sort');
  const prev = $('#prev');
  const next = $('#next');
  const pageLbl = $('#page');

  unique(all.map(r => r.language).filter(Boolean)).sort().forEach(l => {
    const opt = document.createElement('option');
    opt.value = l; opt.textContent = l;
    langSel.appendChild(opt);
  });

  let page = 1;
  const pageSize = 9;

  function getFiltered(){
    let out = all.slice();
    const q = search.value.trim().toLowerCase();
    if(q) out = out.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    if(langSel.value) out = out.filter(r => r.language === langSel.value);
    if(sortSel.value === 'stars') out.sort((a,b)=>b.stars-a.stars);
    if(sortSel.value === 'name') out.sort((a,b)=>a.name.localeCompare(b.name));
    if(sortSel.value === 'updated') out.sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at));
    return out;
  }

  function render(){
    const out = getFiltered();
    const totalPages = Math.max(1, Math.ceil(out.length / pageSize));
    if(page > totalPages) page = totalPages;
    const slice = out.slice((page-1)*pageSize, page*pageSize);
    grid.innerHTML = '';
    slice.forEach(r => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      const home = r.homepage ? ` • <a href="${r.homepage}" target="_blank">site</a>` : '';
      tile.innerHTML = `<a href="${r.url}" target="_blank"><h3>${r.name}</h3><p class="muted">${r.description}</p></a><div class="meta"><span>${r.language||''}</span><span>${r.stars} ★</span></div>`;
      grid.appendChild(tile);
    });
    pageLbl.textContent = `Page ${page} / ${totalPages}`;
    prev.disabled = page<=1; next.disabled = page>=totalPages;
  }

  search.addEventListener('input', ()=>{ page=1; render(); });
  langSel.addEventListener('change', ()=>{ page=1; render(); });
  sortSel.addEventListener('change', ()=>{ page=1; render(); });
  prev.addEventListener('click', ()=>{ if(page>1){ page--; render(); } });
  next.addEventListener('click', ()=>{ page++; render(); });

  render();
}

async function run(){
  starsBG();
  const data = await fetch('./data.json').then(r => r.json());
  document.getElementById('avatar').src = data.user.avatar_url;
  document.getElementById('name').textContent = data.user.name;
  document.getElementById('bio').textContent = data.user.bio;
  document.getElementById('followers').textContent = `${fmt(data.user.followers)} followers`;
  document.getElementById('following').textContent = `${fmt(data.user.following)} following`;
  document.getElementById('repos').textContent = `${fmt(data.user.public_repos)} repos`;

  renderCharts(data);
  buildGrid(data);
}

run();