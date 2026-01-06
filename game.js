// ===== FIREBASE SETUP =====
const firebaseConfig = {
  apiKey: "AIzaSyCF3esrFmnrLo3czErYRy1wkbRqEZfHliY",
  authDomain: "monkeymechanicsaccounts.firebaseapp.com",
  projectId: "monkeymechanicsaccounts",
  storageBucket: "monkeymechanicsaccounts.firebasestorage.app",
  messagingSenderId: "210326823006",
  appId: "1:210326823006:web:28d87c66a7d1c5a35594cf"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ===== UI ELEMENTS =====
const scoreEl = document.getElementById('score');
const clickBtn = document.getElementById('clickBtn');
const meBtn = document.getElementById('meBtn');
const mePopup = document.getElementById('mePopup');
const meCloseBtn = document.getElementById('meCloseBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

// ===== GAME VARIABLES =====
let aura = 0;
let clickMultiplier = 1;
let bcBought = false;

const upgrades = {
  seven: { count: 0, cost: 1 },
  boomer: { count: 0, cost: 2 },
  genZ: { count: 0, cost: 3 },
  rizz: { count: 0, cost: 50 },
  skibidi: { count: 0, cost: 100 }
};

// ===== HELPER FUNCTIONS =====
function updateScore() {
  scoreEl.textContent = "Aura: " + Math.round(aura * 100) / 100;
  saveLocal();
}

function saveLocal() {
  localStorage.setItem('memeClickerProgress', JSON.stringify({ aura, clickMultiplier, upgrades, bcBought }));
}

function loadLocal() {
  const p = localStorage.getItem('memeClickerProgress');
  if (p) {
    const data = JSON.parse(p);
    aura = data.aura || 0;
    clickMultiplier = data.clickMultiplier || 1;
    bcBought = data.bcBought || false;
    for (const key in upgrades) {
      if (data.upgrades && data.upgrades[key]) upgrades[key] = data.upgrades[key];
    }
  }
  updateScore();
}
loadLocal();

// ===== CLICK BUTTON =====
clickBtn.addEventListener('click', () => {
  aura += clickMultiplier;
  updateScore();
});

// ===== UPGRADE LOGIC =====
function buyUpgrade(name) {
  const up = upgrades[name];
  if (aura >= up.cost) {
    aura -= up.cost;
    up.count++;
    up.cost = Math.ceil(up.cost * 1.25);
    document.getElementById(name + "Cost").textContent = up.cost;
    document.getElementById(name + "Owned").textContent = up.count;
    updateScore();
  }
}

document.getElementById("sevenBtn").onclick = () => buyUpgrade("seven");
document.getElementById("boomerBtn").onclick = () => buyUpgrade("boomer");
document.getElementById("genZBtn").onclick = () => buyUpgrade("genZ");
document.getElementById("rizzBtn").onclick = () => buyUpgrade("rizz");
document.getElementById("skibidiBtn").onclick = () => buyUpgrade("skibidi");

// ===== AUTO-INCOME =====
setInterval(() => { aura += upgrades.seven.count * clickMultiplier; updateScore(); }, 5000);
setInterval(() => { aura += upgrades.boomer.count * clickMultiplier; updateScore(); }, 3000);
setInterval(() => {
  for (let i = 0; i < upgrades.genZ.count; i++) {
    aura += (Math.random() < 0.5 ? 5 : -5) * clickMultiplier;
    if (aura < 0) aura = 0;
  }
  updateScore();
}, 5000);
setInterval(() => { aura += upgrades.rizz.count * clickMultiplier; updateScore(); }, 1000);
setInterval(() => { aura += upgrades.skibidi.count * 2 * clickMultiplier; updateScore(); }, 1000);

// ===== SHOP TABS =====
const tabs = document.querySelectorAll("#shopTabs .tab");
const panels = document.querySelectorAll(".shopPanel");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    const panelId = tab.getAttribute("data-tab");
    document.getElementById(panelId).classList.add("active");
  });
});

// ===== BOMBARDILLO CROCODILLO =====
const bcBtn = document.getElementById("bcBtn");
bcBtn.onclick = () => {
  if (!bcBought && aura >= 10000) {
    aura -= 10000;
    bcBought = true;
    clickMultiplier = 1.1;
    bcBtn.disabled = true;
    bcBtn.textContent = "Bombardillo Crocodillo (Bought)";
    updateScore();
  }
};

// ===== ME POPUP =====
meBtn.addEventListener('click', () => {
  mePopup.style.display = "block";
  updateMEPopup();
});
meCloseBtn.addEventListener('click', () => mePopup.style.display = "none");

function updateMEPopup() {
  const totalItems = upgrades.seven.count + upgrades.boomer.count + upgrades.genZ.count + upgrades.rizz.count + upgrades.skibidi.count + (bcBought ? 1 : 0);
  const totalPossible = 6;
  document.getElementById("progressInfo").textContent = Math.round(totalItems / totalPossible * 100) + "%";

  let worth = 0;
  for (const key in upgrades) { worth += upgrades[key].count * upgrades[key].cost; }
  if (bcBought) worth += 10000;
  document.getElementById("worthInfo").textContent = Math.round((worth + aura) * 100) / 100;

  const aura5s = upgrades.seven.count + upgrades.boomer.count * (5 / 3) + upgrades.genZ.count * 5 + upgrades.rizz.count * 5 + upgrades.skibidi.count * 10;
  document.getElementById("apsInfo").textContent = Math.round(aura5s * 100) / 100;

  const user = auth.currentUser;
  document.getElementById("accountInfo").textContent = user ? user.email : "-";
}

// ===== LOCAL + FIRESTORE SYNC =====
async function syncProgress(user) {
  const local = localStorage.getItem('memeClickerProgress');
  const doc = await db.collection('users').doc(user.uid).get();

  if (doc.exists && doc.data().progress) {
    const data = doc.data().progress;
    aura = data.aura || 0;
    clickMultiplier = data.clickMultiplier || 1;
    bcBought = data.bcBought || false;
    for (const key in upgrades) { if (data.upgrades && data.upgrades[key]) upgrades[key] = data.upgrades[key]; }
  } else if (local) {
    await db.collection('users').doc(user.uid).set({ progress: JSON.parse(local) }, { merge: true });
  }
  updateScore();
}

setInterval(async () => {
  const user = auth.currentUser;
  saveLocal();
  if (user) await db.collection('users').doc(user.uid).set({ progress: { aura, clickMultiplier, upgrades, bcBought } }, { merge: true });
}, 5000);

// ===== LOGIN / LOGOUT BUTTONS =====
loginBtn.onclick = () => window.location.href = "login.html";

logoutBtn.onclick = async () => {
  await auth.signOut();
  location.reload();
};

auth.onAuthStateChanged(user => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});
