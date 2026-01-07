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

// ===== ELEMENTS =====
const scoreEl = document.getElementById('score');
const clickBtn = document.getElementById('clickBtn');
const meBtn = document.getElementById('meBtn');
const mePopup = document.getElementById('mePopup');
const meCloseBtn = document.getElementById('meCloseBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Bottom nav
const tabBtns = document.querySelectorAll('#bottomBar .tabBtn');
const screens = document.querySelectorAll('.screen');

// Shop tabs
const tabs = document.querySelectorAll("#shopTabs .tab");
const panels = document.querySelectorAll(".shopPanel");

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

// ===== LOCAL STORAGE =====
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

// ===== SCORE =====
function updateScore() {
  scoreEl.textContent = "Aura: " + Math.round(aura * 100) / 100;
  saveLocal();
}

// ===== CLICK LOGIC =====
let canClick = true;
clickBtn.addEventListener("click", () => {
  if (!canClick) return;
  canClick = false;
  aura += clickMultiplier;
  updateScore();
  setTimeout(() => { canClick = true; }, 300);
});

// ===== BUY UPGRADES (with your original descriptions) =====
function buyUpgrade(name) {
  const up = upgrades[name];
  if (aura >= up.cost) {
    aura -= up.cost;
    up.count++;
    up.cost = Math.ceil(up.cost * 1.25);

    // Update UI numbers
    document.getElementById(name + "Cost").textContent = up.cost;
    document.getElementById(name + "Owned").textContent = up.count;

    // Exact descriptions from your GitHub history
    const descEl = document.querySelector(`#${name}Btn`).nextElementSibling.nextElementSibling; // <small>
    switch(name){
      case "seven": 
        descEl.textContent = "Little iPad kid who gains 1 aura every 5 seconds."; 
        break;
      case "boomer": 
        descEl.textContent = "Boomer who tries to be cool but ain’t, 1 aura every 3 seconds."; 
        break;
      case "genZ": 
        descEl.textContent = "Nerd who thinks memes are ehh, 50/50 chance for either 5 or -5 aura every 5 seconds."; 
        break;
      case "rizz": 
        descEl.textContent = "He ain’t the rizz god, the ladies he got are people no one else wanted to date. 1 Aura every second."; 
        break;
      case "skibidi": 
        descEl.textContent = "He fell off harder than OHIO. Still better than Fake Rizz God. 2 Aura every second."; 
        break;
    }

    updateScore();
  }
}


// Upgrade buttons
document.getElementById("sevenBtn").onclick = () => buyUpgrade("seven");
document.getElementById("boomerBtn").onclick = () => buyUpgrade("boomer");
document.getElementById("genZBtn").onclick = () => buyUpgrade("genZ");
document.getElementById("rizzBtn").onclick = () => buyUpgrade("rizz");
document.getElementById("skibidiBtn").onclick = () => buyUpgrade("skibidi");

// Bombardillo Crocodillo
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

// ===== AUTO INCOME =====
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
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.getAttribute("data-tab")).classList.add("active");
  });
});

// ===== ME POPUP =====
meBtn.addEventListener('click', () => { mePopup.style.display = "block"; updateMEPopup(); });
meCloseBtn.addEventListener('click', () => mePopup.style.display = "none");

function updateMEPopup() {
  let ownedCount = 0;
  let totalPossible = 0;

  // Upgrades (7yo, boomer, genZ, rizz, skibidi)
  for (const key in upgrades) {
    totalPossible++;
    if (upgrades[key].count > 0) ownedCount++;
  }

  // Brainrot items
  totalPossible++; // Bombardillo Crocodillo
  if (bcBought) ownedCount++;

  document.getElementById("progressInfo").textContent =
    Math.round((ownedCount / totalPossible) * 100) + "%";


  let worth = 0;
  for (const key in upgrades) worth += upgrades[key].count * upgrades[key].cost;
  if (bcBought) worth += 10000;
  document.getElementById("worthInfo").textContent = Math.round((worth + aura) * 100)/100;

  const aura5s = upgrades.seven.count + upgrades.boomer.count * (5/3) + upgrades.genZ.count * 5 + upgrades.rizz.count * 5 + upgrades.skibidi.count * 10;
  document.getElementById("apsInfo").textContent = Math.round(aura5s * 100)/100;

  const user = auth.currentUser;
  document.getElementById("accountInfo").textContent =
  user ? user.email : "Guest (not logged in)";

}

// ===== BOTTOM NAV =====
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    if (!target) return; // locked
    screens.forEach(s => s.classList.remove('active'));
    tabBtns.forEach(b => b.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    btn.classList.add('active');
  });
});

// ===== LOGIN / LOGOUT =====
loginBtn.addEventListener("click", () => {
  window.location.href = "https://accounts.monkeymechanics.github.io";
});


document.getElementById("loginClose").addEventListener("click", () => {
  document.getElementById("loginPopup").style.display = "none";
});

document.getElementById("loginSubmit").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await user.sendEmailVerification();
      alert("Email not verified! Check inbox.");
      await auth.signOut();
    } else {
      localStorage.setItem("loggedInUser", JSON.stringify({ uid: user.uid, email: user.email }));
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      document.getElementById("loginPopup").style.display = "none";
      updateMEPopup();
      window.location.href = "https://accounts.monkeymechanics.github.io";
    }
  } catch (err) { alert(err.message); }
});

logoutBtn.addEventListener("click", async () => {
  await auth.signOut();
  localStorage.removeItem("loggedInUser");
  location.reload();
});

// ===== LOAD LOCAL PROGRESS =====
loadLocal();

// ===== AUTH STATE =====
auth.onAuthStateChanged(user => {
  if(user){ loginBtn.style.display="none"; logoutBtn.style.display="inline-block"; } 
  else { loginBtn.style.display="inline-block"; logoutBtn.style.display="none"; loadLocal(); }
});
