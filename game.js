let aura = 0;

const score = document.getElementById("score");

function update() {
  score.textContent = "Aura: " + aura;
}

// ===== Click =====
document.getElementById("clickBtn").onclick = () => {
  aura++;
  update();
};

// ===== Data =====
const upgrades = {
  seven: { count: 0, cost: 1, rate: () => aura += upgrades.seven.count },
  boomer: { count: 0, cost: 2, rate: () => aura += upgrades.boomer.count },
  genZ: {
    count: 0,
    cost: 3,
    rate: () => {
      for (let i = 0; i < upgrades.genZ.count; i++) {
        aura += Math.random() < 0.5 ? 5 : -5;
        if (aura < 0) aura = 0;
      }
    }
  },
  rizz: { count: 0, cost: 50, rate: () => aura += upgrades.rizz.count },
  skibidi: { count: 0, cost: 100, rate: () => aura += upgrades.skibidi.count * 2 }
};

// ===== Buy Functions =====
function buy(id, costEl, ownedEl) {
  const up = upgrades[id];
  if (aura >= up.cost) {
    aura -= up.cost;
    up.count++;
    up.cost = Math.ceil(up.cost * 1.25);
    costEl.textContent = up.cost;
    ownedEl.textContent = up.count;
    update();
  }
}

// ===== Button Bindings =====
document.getElementById("sevenBtn").onclick =
  () => buy("seven", sevenCost, sevenOwned);

document.getElementById("boomerBtn").onclick =
  () => buy("boomer", boomerCost, boomerOwned);

document.getElementById("genZBtn").onclick =
  () => buy("genZ", genZCost, genZOwned);

document.getElementById("rizzBtn").onclick =
  () => buy("rizz", rizzCost, rizzOwned);

document.getElementById("skibidiBtn").onclick =
  () => buy("skibidi", skibidiCost, skibidiOwned);

// ===== Timers =====
setInterval(() => { upgrades.seven.rate(); update(); }, 5000);
setInterval(() => { upgrades.boomer.rate(); update(); }, 3000);
setInterval(() => { upgrades.genZ.rate(); update(); }, 5000);
setInterval(() => { upgrades.rizz.rate(); update(); }, 1000);
setInterval(() => { upgrades.skibidi.rate(); update(); }, 1000);
