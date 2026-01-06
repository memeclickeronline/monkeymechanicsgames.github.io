// ===== Aura =====
let aura = 0;
const scoreEl = document.getElementById("score");

// ===== Upgrade counts =====
let sevenCount = 0;
let boomerCount = 0;
let genZCount = 0;
let rizzCount = 0;
let skibidiCount = 0;

// ===== Costs =====
let sevenCost = 1;
let boomerCost = 2;
let genZCost = 3;
let rizzCost = 50;
let skibidiCost = 100;

// ===== Buttons =====
const clickBtn = document.getElementById("clickBtn");
const sevenBtn = document.getElementById("sevenBtn");
const boomerBtn = document.getElementById("boomerBtn");
const genZBtn = document.getElementById("genZBtn");
const rizzBtn = document.getElementById("rizzBtn");
const skibidiBtn = document.getElementById("skibidiBtn");

// ===== UI =====
const sevenCostEl = document.getElementById("sevenCost");
const boomerCostEl = document.getElementById("boomerCost");
const genZCostEl = document.getElementById("genZCost");
const rizzCostEl = document.getElementById("rizzCost");
const skibidiCostEl = document.getElementById("skibidiCost");

const sevenOwnedEl = document.getElementById("sevenOwned");
const boomerOwnedEl = document.getElementById("boomerOwned");
const genZOwnedEl = document.getElementById("genZOwned");
const rizzOwnedEl = document.getElementById("rizzOwned");
const skibidiOwnedEl = document.getElementById("skibidiOwned");

// ===== Click Meme =====
clickBtn.addEventListener("click", () => {
  aura++;
  updateScore();
});

// ===== Buy Upgrades =====
sevenBtn.addEventListener("click", () => {
  if (aura >= sevenCost) {
    aura -= sevenCost;
    sevenCount++;
    sevenCost = Math.ceil(sevenCost * 1.25);

    sevenOwnedEl.textContent = sevenCount;
    sevenCostEl.textContent = sevenCost;
    updateScore();
  }
});

boomerBtn.addEventListener("click", () => {
  if (aura >= boomerCost) {
    aura -= boomerCost;
    boomerCount++;
    boomerCost = Math.ceil(boomerCost * 1.25);

    boomerOwnedEl.textContent = boomerCount;
    boomerCostEl.textContent = boomerCost;
    updateScore();
  }
});

genZBtn.addEventListener("click", () => {
  if (aura >= genZCost) {
    aura -= genZCost;
    genZCount++;
    genZCost = Math.ceil(genZCost * 1.25);

    genZOwnedEl.textContent = genZCount;
    genZCostEl.textContent = genZCost;
    updateScore();
  }
});

rizzBtn.addEventListener("click", () => {
  if (aura >= rizzCost) {
    aura -= rizzCost;
    rizzCount++;
    rizzCost = Math.ceil(rizzCost * 1.25);

    rizzOwnedEl.textContent = rizzCount;
    rizzCostEl.textContent = rizzCost;
    updateScore();
  }
});

skibidiBtn.addEventListener("click", () => {
  if (aura >= skibidiCost) {
    aura -= skibidiCost;
    skibidiCount++;
    skibidiCost = Math.ceil(skibidiCost * 1.25);

    skibidiOwnedEl.textContent = skibidiCount;
    skibidiCostEl.textContent = skibidiCost;
    updateScore();
  }
});

// ===== Auto Income =====
setInterval(() => {
  aura += sevenCount;
  updateScore();
}, 5000);

setInterval(() => {
  aura += boomerCount;
  updateScore();
}, 3000);

setInterval(() => {
  for (let i = 0; i < genZCount; i++) {
    aura += Math.random() < 0.5 ? 5 : -5;
    if (aura < 0) aura = 0;
  }
  updateScore();
}, 5000);

setInterval(() => {
  aura += rizzCount * 1;
  updateScore();
}, 1000);

setInterval(() => {
  aura += skibidiCount * 2;
  updateScore();
}, 1000);

// ===== Update UI =====
function updateScore() {
  scoreEl.textContent = "Aura: " + aura;
}
