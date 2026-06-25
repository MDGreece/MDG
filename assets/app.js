const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const lang=localStorage.getItem('mdg_lang')||'el';
async function getJSON(path){const res=await fetch(path,{cache:'no-store'});return res.json()}
function setNav(){document.querySelectorAll('[data-lang]').forEach(b=>{b.classList.toggle('active',b.dataset.lang===lang);b.onclick=()=>{localStorage.setItem('mdg_lang',b.dataset.lang);location.reload()}})}
function nav(){
return `
<div class="nav">
    <div class="container nav-inner">

        <a class="brand" href="index.html">
            <span>MDG</span>: Mythic Dungeon Greece
        </a>

        <div class="links">
            <a href="index.html">🏠 Home</a>
            <a href="leaderboard.html">🏆 Leaderboard</a>
            <a href="brackets.html">🏟️ Brackets</a>
            <a href="weekly.html">📅 Weekly Results</a>
            <a href="teams.html">👥 Teams</a>
            <a href="rules.html">📜 Rules</a>
            <a href="halloffame.html">🏅 Hall of Fame</a>
            <a href="news.html">📰 News</a>
        </div>

        <div class="lang">
            <button data-lang="el">EL</button>
            <button data-lang="en">EN</button>
        </div>

    </div>
</div>
`;
}
async function boot(){document.body.insertAdjacentHTML('afterbegin',nav());setNav();try{const tr=await getJSON('data/translations.json');$$('[data-t]').forEach(el=>el.textContent=tr[lang]?.[el.dataset.t]||el.textContent)}catch(e){}}
function timeToSec(t){let [m,s]=String(t).split(':').map(Number);return (m||0)*60+(s||0)}
function leaderboard(teams,results){const map={};teams.forEach(t=>map[t.id]={team:t,points:0,runs:0,best:null});results.forEach(w=>w.runs.forEach(r=>{if(!map[r.teamId])return;map[r.teamId].points+=Number(r.points||0);map[r.teamId].runs++;const sec=timeToSec(r.time);if(map[r.teamId].best==null||sec<map[r.teamId].best)map[r.teamId].best=sec}));return Object.values(map).sort((a,b)=>b.points-a.points||((a.best??99999)-(b.best??99999)))}
async function renderHome(){await boot();const s=await getJSON('data/settings.json');$('#heroTitle').textContent=s.heroTitle?.[lang]||s.heroTitle?.en;$('#heroSubtitle').textContent=s.heroSubtitle?.[lang]||s.heroSubtitle?.en;$('#season').textContent=s.seasonName}
async function renderLeaderboard(){await boot();const [teams,results]=await Promise.all([getJSON('data/teams.json'),getJSON('data/results.json')]);const rows=leaderboard(teams,results).map((x,i)=>`<tr><td class="rank">#${i+1}</td><td>${x.team.name}</td><td>${x.points}</td><td>${x.runs}</td><td>${x.best?Math.floor(x.best/60)+':'+String(x.best%60).padStart(2,'0'):'-'}</td></tr>`).join('');$('#leaderboardBody').innerHTML=rows}
async function renderTeams(){await boot();const teams=await getJSON('data/teams.json');$('#teamsGrid').innerHTML=teams.map(t=>`<article class="card"><span class="pill">${t.faction||''} • ${t.realm||''}</span><h2>${t.name}</h2><p class="muted">Captain: ${t.captain||'-'}</p><p>${(t.members||[]).join(' • ')}</p></article>`).join('')}
async function renderWeekly(){await boot();const [teams,results]=await Promise.all([getJSON('data/teams.json'),getJSON('data/results.json')]);const names=Object.fromEntries(teams.map(t=>[t.id,t.name]));$('#weeks').innerHTML=results.map(w=>`<section class="card"><h2>Week ${w.week}: ${w.dungeon}</h2><p class="muted">${w.date||''} ${w.affix?'• '+w.affix:''}</p><div class="table-wrap"><table><thead><tr><th>Rank</th><th>Team</th><th>Key</th><th>Time</th><th>Points</th><th>Proof</th></tr></thead><tbody>${[...w.runs].sort((a,b)=>timeToSec(a.time)-timeToSec(b.time)).map((r,i)=>`<tr><td class="rank">#${i+1}</td><td>${names[r.teamId]||r.teamId}</td><td>+${r.keyLevel}</td><td>${r.time}</td><td>${r.points}</td><td>${r.proof&&r.proof!=='#'?`<a href="${r.proof}">Link</a>`:'-'}</td></tr>`).join('')}</tbody></table></div></section>`).join('')}
async function renderRules(){await boot();const rules=await getJSON('data/rules.json');$('#rulesList').innerHTML=(rules[lang]||rules.en).map(r=>`<article class="card"><h2>${r.title}</h2><p class="muted">${r.body}</p></article>`).join('')}
