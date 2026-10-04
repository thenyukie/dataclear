/* DataClear demo engine v0.4 — graph walker + dynamic stepper.
   Walks FLOW.nodes via chip goto. Stepper: pinned START/FINISH caps,
   intermediate pills fill in as visited. Alt trace rows render muted. */
(function () {
"use strict";
const PATH = FLOW.path;
const NODES = FLOW.nodes;
const state = { cur: null, visited: [], revealed: 0, timers: [], busy: false };
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

/* ── dynamic stepper: START cap · pills fill as visited · FINISH cap ── */
function renderStepper(){
  const wrap = document.getElementById("stepper"); wrap.innerHTML = "";
  const caps = [["START","cap start"],["FINISH","cap finish"]];
  // START cap
  const s=document.createElement("span"); s.className="step-cap start"; s.textContent="START"; wrap.appendChild(s);
  // intermediate slots (as many as PATH nodes, all unfilled initially)
  PATH.forEach((id,i)=>{
    if(i){ const c=document.createElement("span"); c.className="step-link"; wrap.appendChild(c); }
    const p=document.createElement("button");
    p.className="step unfilled"; p.type="button"; p.dataset.node=id;
    p.setAttribute("aria-label", NODES[id].title);
    wrap.appendChild(p);
  });
  // FINISH cap
  const f=document.createElement("span"); f.className="step-cap finish"; f.textContent="FINISH"; wrap.appendChild(f);
}
function paintStepper(){
  const idx = PATH.indexOf(state.cur);
  document.querySelectorAll("#stepper .step").forEach((p)=>{
    const nid = p.dataset.node;
    const vi = state.visited.indexOf(nid);
    const n = NODES[nid];
    p.classList.remove("unfilled","done","active");
    if(vi !== -1){
      p.classList.add(vi === state.visited.length-1 && nid === state.cur ? "active" : "done");
      p.textContent = PATH.indexOf(nid)+1;
      p.title = n.title;
    } else {
      p.textContent = "?";
      p.title = "Not yet reached";
    }
  });
  // status pill
  const n = NODES[state.cur];
  const num = PATH.indexOf(state.cur)+1;
  const m = state.cur==="intake" ? "INTAKE" : state.cur==="log" ? "CLOSING" : n.actor.toUpperCase();
  STATUS.textContent = "STEP " + num + "/" + PATH.length + " · " + n.title.toUpperCase() + " · " + m;
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
  const who = m.who==="bot" ? (m.role ? "DataClear · "+m.role : "DataClear") : (m.name||"");
  body.innerHTML = '<div class="who">'+esc(who)+'</div><div class="text">'+esc(m.text)+'</div>';
  row.appendChild(av); row.appendChild(body); CHAT.appendChild(row); scrollChat();
}
function addFallback(){
  addBubble({who:"bot", text:"This run follows a scripted path — tap a suggested reply below to keep moving."});
}
function showTyping(b){ TYPING.classList.toggle("show", !!b); if(b) scrollChat(); }

/* ── workspace tabs ── */
function fillTab(kind, items){
  const list = document.getElementById("tab-"+kind); list.innerHTML="";
  TABS[kind] = [];
  (items||[]).forEach(it=>{
    const li=document.createElement("li"); li.className="tabitem"; li.style.display="none";
    if(kind==="trace"){
      const alt = !!it.alt;
      if(alt) li.classList.add("altrow");
      li.innerHTML='<div class="t-head"><span class="t-dot'+(alt?' altdot':'')+'"></span><span class="t-label">'+esc(it.label)+'</span></div>'
        +'<div class="t-detail">'+esc(it.detail)+'</div>'
        +(alt ? '' : '<div class="t-cite" title="'+esc(it.cite)+'">⌁ '+esc(it.cite)+'</div>');
    } else if(kind==="artifacts"){
      li.innerHTML='<div class="a-head"><span class="a-icon">'+it.icon+'</span><span class="a-title">'+esc(it.title)+'</span><span class="a-status">'+esc(it.status)+'</span></div>'
        +'<ul class="a-lines">'+it.lines.map(l=>'<li>'+esc(l)+'</li>').join("")+'</ul>';
    } else if(kind==="people"){
      li.innerHTML='<div class="p-av">'+initials(it.name)+'</div><div class="p-body"><div class="p-name">'+esc(it.name)+' <span class="p-role">'+esc(it.role)+'</span></div><div class="p-action">'+esc(it.action)+'</div></div>';
    } else {
      li.innerHTML='<div class="s-row"><span class="s-name">'+esc(it.name)+'</span><span class="s-action">'+esc(it.action)+'</span><span class="s-status '+(/✓|SEALED|APPLIED|OK|RECORDED/.test(it.status)?"ok":"")+'">'+esc(it.status)+'</span></div>';
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
  return d;
}

/* ── stage flow ── */
function renderChips(){
  CHIPS.innerHTML="";
  NODES[state.cur].chips.forEach(c=>{
    const b=document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=c.text;
    b.addEventListener("click", ()=>pick(c));
    CHIPS.appendChild(b);
  });
}
function showChips(){ renderChips(); CHIPS.classList.add("show"); }
function finishStage(){
  const lastDelay = revealAllTabs(120);
  later(showChips, lastDelay + 250);
  state.busy = false;
}
function revealNext(){
  const msgs = NODES[state.cur].chat;
  if(state.revealed >= msgs.length){ finishStage(); return; }
  const m = msgs[state.revealed];
  if(m.who==="bot"){
    showTyping(true);
    later(()=>{ showTyping(false); addBubble(m); state.revealed++; revealNext(); }, 650 + Math.min(m.text.length*6, 900));
  } else {
    later(()=>{ addBubble(m); state.revealed++; revealNext(); }, 350);
  }
}
function enterNode(id, instant){
  clearTimers();
  state.cur = id; state.revealed = 0; state.busy = true;
  CHIPS.classList.remove("show"); CHIPS.innerHTML="";
  const n = NODES[id];
  if(state.visited[state.visited.length-1] !== id) state.visited.push(id);
  ["trace","artifacts","people","systems"].forEach(k=>fillTab(k, n[k]));
  paintStepper();
  document.getElementById("stage-title").textContent = (PATH.indexOf(id)+1) + " · " + n.title + " — " + n.actor;
  addDivider("— Step " + (PATH.indexOf(id)+1) + " · " + n.title + " · " + n.actor + " —");
  if(instant){
    n.chat.forEach(addBubble);
    state.revealed = n.chat.length;
    ["trace","artifacts","people","systems"].forEach(k=>{
      TABS[k].forEach(li=>li.style.display="");
      TABS[k] = [];
    });
    showChips(); state.busy=false;
  } else {
    later(revealNext, 450);
  }
}
function pick(chip){
  if(state.busy) return;
  addBubble({who:"user", name: (FLOW.meta && FLOW.meta.requester) || "Requester", text: chip.text});
  CHIPS.classList.remove("show");
  if(chip.goto === "__restart"){ later(restart, 800); return; }
  state.busy = true;
  later(()=>enterNode(chip.goto), 900);
}
function submitTyped(){
  const t = INPUT.value.trim(); if(!t || state.busy) return;
  INPUT.value = "";
  const norm = t.toLowerCase();
  const n = NODES[state.cur];
  const ok = (n.expected||[]).some(w => norm.indexOf(w) !== -1);
  if(ok){
    const chip = n.chips[n.chips.length-1];
    pick(chip);
  } else addFallback();
}
function jump(delta){
  const i = PATH.indexOf(state.cur) + delta;
  if(i < 0 || i > PATH.length-1 || state.busy) return;
  enterNode(PATH[i], true);
}
function restart(){
  clearTimers(); CHAT.innerHTML=""; state.busy=false;
  state.visited = [];
  enterNode(PATH[0]);
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
