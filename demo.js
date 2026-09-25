/* DataClear demo engine — chat renderer, workspace tabs, stage progression */
(function () {
"use strict";
const state = { stage: -1, revealed: 0, timers: [], busy: false };
const CHAT = document.getElementById("chat");
const TYPING = document.getElementById("typing");
const CHIPS = document.getElementById("chips");
const INPUT = document.getElementById("chatin");
const SEND = document.getElementById("chatsend");
const STATUS = document.getElementById("status-pill");
const TABS = { trace: [], artifacts: [], people: [], systems: [] };

/* ── helpers ── */
function esc(s){ const d=document.createElement("div"); d.textContent=s; return d.innerHTML; }
function later(fn,ms){ state.timers.push(setTimeout(fn,ms)); }
function clearTimers(){ state.timers.forEach(clearTimeout); state.timers=[]; }
function initials(n){ return n.split(/\s+/).map(w=>w[0]).join("").replace(/[^A-Za-z]/g,"").slice(0,2).toUpperCase(); }
function scrollChat(){ CHAT.scrollTop = CHAT.scrollHeight; }

/* ── stepper ── */
function renderStepper(){
  const wrap = document.getElementById("stepper"); wrap.innerHTML = "";
  STAGES.forEach((s,i)=>{
    if(i){ const c=document.createElement("span"); c.className="step-link"; wrap.appendChild(c); }
    const p=document.createElement("button");
    p.className="step"; p.type="button"; p.title=s.title; p.textContent=s.n;
    p.setAttribute("aria-label", "Stage "+s.n+": "+s.title);
    wrap.appendChild(p);
  });
}
function paintStepper(){
  document.querySelectorAll("#stepper .step").forEach((p,i)=>{
    p.classList.toggle("done", i < state.stage);
    p.classList.toggle("active", i === state.stage);
  });
}
function paintStatus(){
  const s = STAGES[state.stage];
  const m = {intake:"INTAKE", log:"CLOSING"}[s.id] || "IN PROGRESS";
  STATUS.textContent = "STAGE " + s.n + "/14 · " + m;
}

/* ── chat ── */
function addDivider(txt){
  const d=document.createElement("div"); d.className="divider";
  d.innerHTML='<span>'+esc(txt)+'</span>'; CHAT.appendChild(d); scrollChat();
}
function addBubble(m){
  const row=document.createElement("div"); row.className="msg "+m.who;
  const av=document.createElement("div"); av.className="avatar "+m.who;
  av.textContent = m.who==="bot" ? "DC" : (m.name?initials(m.name):"?");
  const body=document.createElement("div"); body.className="bubble";
  body.innerHTML = '<div class="who">'+esc(m.who==="bot"?"DataClear":(m.name||""))+'</div><div class="text">'+esc(m.text)+'</div>';
  row.appendChild(av); row.appendChild(body); CHAT.appendChild(row); scrollChat();
}
function addFallback(){
  addBubble({who:"bot", text:"This demo runs on a scripted path — pick one of the suggested replies below to keep the journey moving."});
}
function showTyping(b){ TYPING.classList.toggle("show", !!b); if(b) scrollChat(); }

/* ── workspace tabs ── */
function fillTab(kind, items){
  const list = document.getElementById("tab-"+kind); list.innerHTML="";
  TABS[kind] = [];
  (items||[]).forEach(it=>{
    const li=document.createElement("li"); li.className="tabitem"; li.style.display="none";
    if(kind==="trace"){
      li.innerHTML='<div class="t-head"><span class="t-dot"></span><span class="t-label">'+esc(it.label)+'</span></div>'
        +'<div class="t-detail">'+esc(it.detail)+'</div>'
        +'<div class="t-cite" title="'+esc(it.cite)+'">⌁ '+esc(it.cite)+'</div>';
    } else if(kind==="artifacts"){
      li.innerHTML='<div class="a-head"><span class="a-icon">'+it.icon+'</span><span class="a-title">'+esc(it.title)+'</span><span class="a-status">'+esc(it.status)+'</span></div>'
        +'<ul class="a-lines">'+it.lines.map(l=>'<li>'+esc(l)+'</li>').join("")+'</ul>';
    } else if(kind==="people"){
      li.innerHTML='<div class="p-av">'+initials(it.name)+'</div><div class="p-body"><div class="p-name">'+esc(it.name)+' <span class="p-role">'+esc(it.role)+'</span></div><div class="p-action">'+esc(it.action)+'</div></div>';
    } else {
      li.innerHTML='<div class="s-row"><span class="s-name">'+esc(it.name)+'</span><span class="s-action">'+esc(it.action)+'</span><span class="s-status '+(/✓|SEALED|APPLIED/.test(it.status)?"ok":"")+'">'+esc(it.status)+'</span></div>';
    }
    list.appendChild(li); TABS[kind].push(li);
  });
  if(!TABS[kind].length){
    const li=document.createElement("li"); li.className="tabitem empty"; li.textContent="—";
    list.appendChild(li);
  }
}
function revealItem(kind, delay){
  later(()=>{
    const li = TABS[kind].shift();
    if(li){ li.style.display=""; li.classList.add("pop"); }
  }, delay);
}
function revealAllTabs(startDelay){
  let d = startDelay;
  ["trace","artifacts","people","systems"].forEach(kind=>{
    TABS[kind].forEach(()=>{ revealItem(kind, d); d += 160; });
  });
}

/* ── stage flow ── */
function renderChips(){
  CHIPS.innerHTML="";
  STAGES[state.stage].chips.forEach(c=>{
    const b=document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=c;
    b.addEventListener("click", ()=>pick(c));
    CHIPS.appendChild(b);
  });
}
function showChips(){ renderChips(); CHIPS.classList.add("show"); }
function finishStage(){
  revealAllTabs(120);
  const total = TABS.trace.length + TABS.artifacts.length + TABS.people.length + TABS.systems.length;
  later(showChips, 120 + total*160 + 250);
  state.busy = false;
}
function revealNext(){
  const msgs = STAGES[state.stage].chat;
  if(state.revealed >= msgs.length){ finishStage(); return; }
  const m = msgs[state.revealed];
  if(m.who==="bot"){
    showTyping(true);
    later(()=>{ showTyping(false); addBubble(m); state.revealed++; revealNext(); }, 650 + Math.min(m.text.length*6, 900));
  } else {
    later(()=>{ addBubble(m); state.revealed++; revealNext(); }, 350);
  }
}
function enterStage(i, instant){
  clearTimers();
  state.stage = i; state.revealed = 0; state.busy = true;
  CHIPS.classList.remove("show"); CHIPS.innerHTML="";
  const s = STAGES[i];
  ["trace","artifacts","people","systems"].forEach(k=>fillTab(k, s[k]));
  paintStepper(); paintStatus();
  document.getElementById("stage-title").textContent = s.n + " · " + s.title;
  addDivider("— Stage " + s.n + " · " + s.title + " —");
  if(instant){
    s.chat.forEach(addBubble);
    state.revealed = s.chat.length;
    ["trace","artifacts","people","systems"].forEach(k=>TABS[k].forEach(li=>li.style.display=""));
    TABS.trace=[]; TABS.artifacts=[]; TABS.people=[]; TABS.systems=[];
    showChips(); state.busy=false;
  } else {
    later(revealNext, 450);
  }
}
function pick(chipText){
  if(state.busy) return;
  addBubble({who:"user", name:"Priya Sharma", text: chipText});
  CHIPS.classList.remove("show");
  if(state.stage === STAGES.length-1){ later(restart, 800); return; }
  state.busy = true;
  later(()=>enterStage(state.stage+1), 900);
}
function submitTyped(){
  const t = INPUT.value.trim(); if(!t || state.busy) return;
  INPUT.value = "";
  const norm = t.toLowerCase();
  const ok = STAGES[state.stage].expected.some(w => norm.indexOf(w) !== -1);
  if(ok){
    const chips = STAGES[state.stage].chips;
    pick(chips[chips.length-1]);
  } else addFallback();
}
function jump(delta){
  const t = state.stage + delta;
  if(t < 0 || t > STAGES.length-1 || state.busy) return;
  enterStage(t, true);
}
function restart(){
  clearTimers(); CHAT.innerHTML=""; state.busy=false;
  enterStage(0);
}

/* ── wiring ── */
document.querySelectorAll(".tabbtn").forEach(b=>{
  b.addEventListener("click", ()=>{
    document.querySelectorAll(".tabbtn").forEach(x=>x.classList.remove("active"));
    document.querySelectorAll(".tabpanel").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    document.getElementById("tab-"+b.dataset.tab).classList.add("active");
  });
});
SEND.addEventListener("click", submitTyped);
INPUT.addEventListener("keydown", e=>{ if(e.key==="Enter"){ e.preventDefault(); submitTyped(); }});
document.getElementById("btn-restart").addEventListener("click", restart);
document.getElementById("btn-prev").addEventListener("click", ()=>jump(-1));
document.getElementById("btn-next").addEventListener("click", ()=>jump(1));
document.addEventListener("keydown", e=>{
  if(document.activeElement === INPUT) return;
  if(e.key === "ArrowRight") jump(1);
  if(e.key === "ArrowLeft") jump(-1);
});

/* ── boot ── */
renderStepper();
restart();
})();
