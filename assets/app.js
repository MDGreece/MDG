const DATA_PATH = 'data/results.json';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) toggle.addEventListener('click', () => links.classList.toggle('open'));
  loadData();
});

async function loadData(){
  try{
    const res = await fetch(DATA_PATH);
    const data = await res.json();
    renderHomeLeaderboard(data);
    renderLeaderboard(data);
    renderWeekly(data);
    renderTeams(data);
  }catch(err){
    console.error('Could not load tournament data', err);
  }
}

function rankResults(rows){
  return [...rows].sort((a,b) => b.points - a.points || timeToSeconds(a.time) - timeToSeconds(b.time));
}
function timeToSeconds(time){
  if(!time) return 999999;
  const parts = time.split(':').map(Number);
  return parts.length === 3 ? parts[0]*3600 + parts[1]*60 + parts[2] : parts[0]*60 + parts[1];
}
function seasonLeaderboard(data){
  const map = {};
  data.weeks.forEach(week => week.results.forEach(r => {
    if(!map[r.team]) map[r.team] = {team:r.team, points:0, bestTime:r.time, weeks:0};
    map[r.team].points += Number(r.points || 0);
    map[r.team].weeks += 1;
    if(timeToSeconds(r.time) < timeToSeconds(map[r.team].bestTime)) map[r.team].bestTime = r.time;
  }));
  return Object.values(map).sort((a,b)=>b.points-a.points || timeToSeconds(a.bestTime)-timeToSeconds(b.bestTime));
}
function tableHTML(headers, rows){
  return `<thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody>`;
}
function renderHomeLeaderboard(data){
  const table = document.getElementById('homeLeaderboard');
  if(!table) return;
  const rows = seasonLeaderboard(data).slice(0,5).map((r,i)=>`<tr><td class="rank">#${i+1}</td><td>${r.team}</td><td>${r.points}</td><td>${r.bestTime}</td></tr>`);
  table.innerHTML = tableHTML(['Rank','Team','Points','Best Time'], rows);
}
function renderLeaderboard(data){
  const table = document.getElementById('leaderboardTable');
  if(!table) return;
  const filter = document.getElementById('teamFilter');
  const draw = () => {
    const q = (filter?.value || '').toLowerCase();
    const rows = seasonLeaderboard(data).filter(r=>r.team.toLowerCase().includes(q)).map((r,i)=>`<tr><td class="rank">#${i+1}</td><td>${r.team}</td><td>${r.points}</td><td>${r.weeks}</td><td>${r.bestTime}</td></tr>`);
    table.innerHTML = tableHTML(['Rank','Team','Total Points','Weeks Played','Best Time'], rows);
  };
  filter?.addEventListener('input', draw);
  draw();
}
function renderWeekly(data){
  const wrap = document.getElementById('weeklyResults');
  if(!wrap) return;
  wrap.innerHTML = data.weeks.map(week => {
    const rows = rankResults(week.results).map((r,i)=>`<tr><td class="rank">#${i+1}</td><td>${r.team}</td><td>${week.dungeon}</td><td>${r.key}</td><td>${r.time}</td><td>${r.deaths}</td><td>${r.points}</td><td>${r.proof ? `<a href="${r.proof}" target="_blank">Proof</a>` : '-'}</td></tr>`).join('');
    return `<article class="week-card"><h2>Week ${week.week}: ${week.title}</h2><div class="table-card"><table>${tableHTML(['Rank','Team','Dungeon','Key','Time','Deaths','Points','Proof'], [rows])}</table></div></article>`;
  }).join('');
}
function renderTeams(data){
  const grid = document.getElementById('teamsGrid');
  if(!grid) return;
  grid.innerHTML = data.teams.map(t => `<article class="card"><h2>${t.name}</h2><p>${t.description || 'Greek community M+ team.'}</p><ul class="team-roster">${t.players.map(p=>`<li>${p}</li>`).join('')}</ul></article>`).join('');
}
