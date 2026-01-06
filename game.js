
let clickMultiplier = 1;
let aura = 0;

const score = document.getElementById("score");

function updateScore() {
  score.textContent = "Aura: " + Math.round(aura*100)/100;
}

// Click Button
document.getElementById("clickBtn").addEventListener("click", () => {
  aura += clickMultiplier;
  updateScore();
});

// Upgrades
const upgrades = {
  seven: { count:0, cost:1 },
  boomer: { count:0, cost:2 },
  genZ: { count:0, cost:3 },
  rizz: { count:0, cost:50 },
  skibidi: { count:0, cost:100 }
};

// Buy Function
function buyUpgrade(name) {
  const up = upgrades[name];
  if (aura >= up.cost) {
    aura -= up.cost;
    up.count++;
    up.cost = Math.ceil(up.cost*1.25);
    document.getElementById(name+"Cost").textContent = up.cost;
    document.getElementById(name+"Owned").textContent = up.count;
    updateScore();
  }
}

// Buttons
document.getElementById("sevenBtn").onclick = () => buyUpgrade("seven");
document.getElementById("boomerBtn").onclick = () => buyUpgrade("boomer");
document.getElementById("genZBtn").onclick = () => buyUpgrade("genZ");
document.getElementById("rizzBtn").onclick = () => buyUpgrade("rizz");
document.getElementById("skibidiBtn").onclick = () => buyUpgrade("skibidi");

// Auto Income
setInterval(()=>{ aura += upgrades.seven.count * clickMultiplier; updateScore(); }, 5000);
setInterval(()=>{ aura += upgrades.boomer.count * clickMultiplier; updateScore(); }, 3000);
setInterval(()=>{
  for(let i=0;i<upgrades.genZ.count;i++){ aura += (Math.random()<0.5?5:-5)*clickMultiplier; if(aura<0)aura=0; }
  updateScore();
},5000);
setInterval(()=>{ aura += upgrades.rizz.count * clickMultiplier; updateScore(); },1000);
setInterval(()=>{ aura += upgrades.skibidi.count * 2 * clickMultiplier; updateScore(); },1000);

// Tabs
const tabs = document.querySelectorAll("#shopTabs .tab");
const panels = document.querySelectorAll(".shopPanel");
tabs.forEach(tab => {
  tab.addEventListener("click", ()=>{
    tabs.forEach(t=>t.classList.remove("active"));
    panels.forEach(p=>p.classList.remove("active"));
    tab.classList.add("active");
    const panelId = tab.getAttribute("data-tab");
    document.getElementById(panelId).classList.add("active");
  });
});

// Bombardillo Crocodillo
let bcBought = false;
const bcBtn = document.getElementById("bcBtn");
bcBtn.onclick = ()=>{
  if(!bcBought && aura >= 10000){
    aura -= 10000;
    bcBought = true;
    clickMultiplier = 1.1;
    bcBtn.disabled = true;
    bcBtn.textContent = "Bombardillo Crocodillo (Bought)";
    updateScore();
  }
};

// ME Popup
const meBtn = document.getElementById("meBtn");
const mePopup = document.getElementById("mePopup");
const meCloseBtn = document.getElementById("meCloseBtn");

meBtn.addEventListener("click", ()=>{
  mePopup.style.display="block";
  updateMEPopup();
});
meCloseBtn.addEventListener("click", ()=>{
  mePopup.style.display="none";
});

function updateMEPopup(){
  const totalItems = upgrades.seven.count + upgrades.boomer.count + upgrades.genZ.count + upgrades.rizz.count + upgrades.skibidi.count + (bcBought?1:0);
  const totalPossible = 6;
  document.getElementById("progressInfo").textContent = Math.round(totalItems/totalPossible*100)+"%";

  let worth = 0;
  for(const key in upgrades){ worth += upgrades[key].count * upgrades[key].cost; }
  if(bcBought) worth += 10000;
  document.getElementById("worthInfo").textContent = Math.round((worth + aura)*100)/100;


  const aura5s = upgrades.seven.count + upgrades.boomer.count*(5/3) + upgrades.genZ.count*5 + upgrades.rizz.count*5 + upgrades.skibidi.count*10;
  document.getElementById("apsInfo").textContent = Math.round(aura5s*100)/100;
}
// Save current progress to Firestore and localStorage
async function saveProgress(user, progress) {
  // Save locally
  localStorage.setItem('memeClickerProgress', JSON.stringify(progress));

  if (!user) return; // not logged in yet

  // Save to Firestore under UID
  await db.collection('users').doc(user.uid).set({
    progress
  }, { merge: true }); // merge keeps username intact
}

// Load progress for current session
async function loadProgress(user) {
  let progress = { score: 0, level: 1 }; // default

  // Load from Firestore if logged in
  if (user) {
    const doc = await db.collection('users').doc(user.uid).get();
    if (doc.exists && doc.data().progress) {
      progress = doc.data().progress;
    }
  } else {
    // Load from localStorage if not logged in
    const local = localStorage.getItem('memeClickerProgress');
    if (local) progress = JSON.parse(local);
  }

  return progress;
}

// When user logs in or signs up
async function onUserLogin(user) {
  const local = localStorage.getItem('memeClickerProgress');
  const doc = await db.collection('users').doc(user.uid).get();

  if (doc.exists && doc.data().progress) {
    // Account has progress → load it
    localStorage.setItem('memeClickerProgress', JSON.stringify(doc.data().progress));
  } else if (local) {
    // No progress yet → use local progress and save it to Firestore
    await db.collection('users').doc(user.uid).set({
      progress: JSON.parse(local)
    }, { merge: true });
  }
}
document.getElementById("loginBtn").onclick = () => {
  window.location.href = "https://accounts.monkeymechanics.github.io";
};

