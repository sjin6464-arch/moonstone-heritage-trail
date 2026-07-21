const stations = {
  food: { number: '01', name: 'Food Stalls', icon: '🥢', prompt: 'Check in when you arrive', content: `The food stalls around Moonstone Lane are everyday social landmarks. They offer affordable meals, familiar faces and a natural reason to spend time in the estate.`, info: `<strong>Sample stall guide</strong><br>Morning drinks & toast — 7:00am–2:00pm<br>Local rice & noodle dishes — 10:30am–8:00pm<br>Snacks & cold drinks — 11:00am–9:00pm<br><small>Opening hours and stalls are placeholders—verify before publishing.</small>`, activity: `<p>Tap below while you are at the station. We will save the time on this device.</p><button class="button secondary" id="check-in">Create check-in timestamp</button><p class="activity-status" id="activity-status"></p>` },
  temple: { number: '02', name: 'Chinese Temple', icon: '🏮', prompt: 'Temple respect quiz', content: `This Chinese temple is part of Moonstone Lane's living cultural landscape. Beyond its architecture, it carries community practices, memories and relationships across generations.`, info: `<strong>Visit respectfully</strong><br>Keep voices low, follow posted signs, do not block entrances and ask before photographing people or ceremonies.`, activity: `<p>Which is the most respectful action in an active cultural space?</p><label class="radio-option"><input type="radio" name="quiz" value="a"> Photograph worshippers without asking</label><label class="radio-option"><input type="radio" name="quiz" value="b"> Speak quietly and follow posted guidance</label><label class="radio-option"><input type="radio" name="quiz" value="c"> Move ritual objects for a better view</label><button class="button secondary" id="check-quiz">Check answer</button><p class="activity-status" id="activity-status"></p>` },
  keramat: { number: '03', name: 'Warehouse & Keramat', icon: '🌿', prompt: 'Pause and reflect', content: `Near the warehouse area is a quiet grave or keramat—a hidden heritage feature that reveals how different layers of memory remain within a changing urban landscape. Its presence calls for care, not spectacle.`, info: `<strong>Respect first</strong><br>Please do not photograph the grave or enter restricted areas. Observe only from a safe, public location and avoid disturbing offerings or the surrounding space.`, activity: `<label for="reflection">How can a neighbourhood protect quiet or sacred heritage while helping people understand it?</label><textarea id="reflection" maxlength="300" placeholder="Write a short reflection…"></textarea><button class="button secondary" id="save-reflection">Save reflection</button><p class="activity-status" id="activity-status"></p>` },
  factory: { number: '04', name: 'Former Water Factory', icon: '🏭', prompt: 'Then versus now', content: `The former water factory reflects Moonstone Lane's industrial past. Building scale, materials, loading areas and older façades can offer clues to how the estate once worked and changed.`, info: `<strong>Look from public space</strong><br>Compare the older industrial form with today's uses. Do not enter private property or block vehicle access.`, activity: `<label for="then-now">What feature best reveals the area's industrial past?</label><select id="then-now"><option value="">Choose one…</option><option>Building shape or façade</option><option>Loading and access areas</option><option>Materials and old signage</option><option>Another detail I noticed</option></select><label for="factory-photo">Optional: upload an exterior photo (not stored after this page closes)</label><input type="file" id="factory-photo" accept="image/*"><button class="button secondary" id="save-factory">Save observation</button><p class="activity-status" id="activity-status"></p>` }
};

const storageKey = 'moonstoneTrailProgressV1';
let progress = loadProgress();
const stationDialog = document.querySelector('#station-dialog');
const keepsakeDialog = document.querySelector('#keepsake-dialog');

function loadProgress(){
  try { return JSON.parse(localStorage.getItem(storageKey)) || {stamps:{}, startedAt:null, completedAt:null}; }
  catch { return {stamps:{}, startedAt:null, completedAt:null}; }
}
function saveProgress(){ localStorage.setItem(storageKey, JSON.stringify(progress)); render(); }
function completedCount(){ return Object.keys(progress.stamps).length; }
function formatTime(value){ return value ? new Date(value).toLocaleString([], {dateStyle:'medium', timeStyle:'short'}) : ''; }
function toast(message){ const el=document.querySelector('#toast'); el.textContent=message; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2600); }

function render(){
  const count=completedCount();
  document.querySelector('#nav-count').textContent=`${count}/4`;
  document.querySelector('#trail-count').textContent=count;
  document.querySelectorAll('.station-card').forEach(card=>card.classList.toggle('completed',Boolean(progress.stamps[card.dataset.station])));
  document.querySelector('#stamp-card').innerHTML=Object.entries(stations).map(([id,s])=>`<article class="stamp ${progress.stamps[id]?'collected':''}"><div><div class="stamp-seal">${progress.stamps[id]?s.icon:'?'}</div><strong>${s.name}</strong><small>${progress.stamps[id]?formatTime(progress.stamps[id]):'Not collected yet'}</small></div></article>`).join('');
  const reward=document.querySelector('#reward');
  reward.classList.toggle('locked',count<4);
  document.querySelector('#view-keepsake').hidden=count<4;
  document.querySelector('#reward-title').textContent=count===4?'Moonstone Explorer unlocked!':'Keep exploring';
  document.querySelector('#reward-copy').textContent=count===4?`Trail completed ${formatTime(progress.completedAt)}. Your digital keepsake is ready.`:'Collect all four stamps to unlock your Moonstone Explorer digital keepsake.';
}

function openStation(id){
  const s=stations[id];
  if(!progress.startedAt){progress.startedAt=new Date().toISOString();saveProgress();}
  document.querySelector('#dialog-content').innerHTML=`<div class="dialog-hero"><p class="eyebrow">Station ${s.number}</p><h2>${s.name}</h2><p>${s.content}</p></div><div class="dialog-body"><div class="info-box">${s.info}</div><div class="activity"><p class="eyebrow">Activity</p><h3>${s.prompt}</h3>${s.activity}</div><button class="button primary collect-button" id="collect-stamp" disabled>${progress.stamps[id]?'Stamp collected ✓':'Complete activity to collect stamp'}</button></div>`;
  stationDialog.showModal();
  wireActivity(id);
  if(progress.stamps[id]) document.querySelector('#collect-stamp').disabled=true;
}

function unlockActivity(message){
  document.querySelector('#activity-status').textContent=message;
  const button=document.querySelector('#collect-stamp');
  button.disabled=false;button.textContent='Collect this stamp';
}
function wireActivity(id){
  if(id==='food') document.querySelector('#check-in').onclick=()=>unlockActivity(`Checked in: ${formatTime(new Date().toISOString())}`);
  if(id==='temple') document.querySelector('#check-quiz').onclick=()=>{const answer=document.querySelector('input[name="quiz"]:checked');if(!answer) return document.querySelector('#activity-status').textContent='Choose an answer first.';answer.value==='b'?unlockActivity('Correct—quiet, attentive visits show respect.'):document.querySelector('#activity-status').textContent='Try again. Think about the people actively using this space.';};
  if(id==='keramat') document.querySelector('#save-reflection').onclick=()=>{const text=document.querySelector('#reflection').value.trim();text.length>=10?unlockActivity('Reflection saved on this device.'):document.querySelector('#activity-status').textContent='Write at least a short sentence before continuing.';};
  if(id==='factory') document.querySelector('#save-factory').onclick=()=>{document.querySelector('#then-now').value?unlockActivity('Observation saved. Nice heritage spotting!'):document.querySelector('#activity-status').textContent='Choose one feature before continuing.';};
  document.querySelector('#collect-stamp').onclick=()=>collectStamp(id);
}
function collectStamp(id){
  if(progress.stamps[id]) return;
  progress.stamps[id]=new Date().toISOString();
  if(completedCount()===4) progress.completedAt=new Date().toISOString();
  saveProgress();stationDialog.close();toast(`${stations[id].name} stamp collected!`);
  if(completedCount()===4) setTimeout(openKeepsake,700);
}
function openKeepsake(){
  document.querySelector('#keepsake-content').innerHTML=`<div class="keepsake"><p class="eyebrow">Digital trail keepsake</p><div class="keepsake-badge">MOONSTONE<br>EXPLORER</div><h2>Hidden stories, found.</h2><p>This certifies that you completed the Moonstone Heritage Stamp Trail.</p><div class="mini-stamps">${Object.values(stations).map(s=>`<span title="${s.name}">${s.icon}</span>`).join('')}</div><p><strong>Completed</strong><br>${formatTime(progress.completedAt)}</p><small>Screenshot this card to keep or share your achievement.</small></div>`;
  keepsakeDialog.showModal();
}

document.querySelectorAll('.open-station').forEach(button=>button.addEventListener('click',()=>openStation(button.dataset.open)));
document.querySelectorAll('.dialog-close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelector('#view-keepsake').addEventListener('click',openKeepsake);
document.querySelector('.nav-toggle').addEventListener('click',e=>{const nav=document.querySelector('#site-nav');const open=nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',open);});
document.querySelectorAll('#site-nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('#site-nav').classList.remove('open')));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog) dialog.close();}));
render();

// QR codes can point directly to a stop, for example: index.html?station=temple
const linkedStation = new URLSearchParams(window.location.search).get('station');
if (linkedStation && stations[linkedStation]) setTimeout(() => openStation(linkedStation), 250);
