const PACKINGS = {
  100: {
    sku: "01306",
    old: 349.2,
    current: 326.4,
  },
  500: {
    sku: "01307",
    old: 1646,
    current: 1432,
  },
  1000: {
    sku: "01308",
    old: 2592,
    current: 2064,
  },
  5000: {
    sku: "01309",
    old: 8710,
    current: 6320,
  },
};

const root = document.querySelector("[data-product]");
const skuEl = root.querySelector("[data-sku]");
const oldPriceEl = root.querySelector("[data-price-old]");
const currentPriceEl = root.querySelector("[data-price-current]");
const discountEl = root.querySelector("[data-discount]");
const packingButtons = [...root.querySelectorAll("[data-packing]")];
const cartButton = root.querySelector("[data-cart]");
const toast = document.querySelector("[data-toast]");

let selectedId = packingButtons.find((btn) => btn.classList.contains("is-active"))?.dataset.id ?? "100";
let toastTimer;

function formatPrice(value) {
  const hasFraction = Math.round(value * 100) % 100 !== 0;
  return (
    value.toLocaleString("ru-RU", {
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: hasFraction ? 2 : 0,
    }) + "\u00a0₽"
  );
}

function discountPercent(oldPrice, currentPrice) {
  return Math.round((1 - currentPrice / oldPrice) * 100);
}

function render(id) {
  const packing = PACKINGS[id];
  if (!packing) return;

  selectedId = id;
  skuEl.textContent = packing.sku;
  oldPriceEl.textContent = formatPrice(packing.old);
  currentPriceEl.textContent = formatPrice(packing.current);
  discountEl.textContent = `−${discountPercent(packing.old, packing.current)}%`;

  packingButtons.forEach((btn) => {
    const active = btn.dataset.id === id;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-checked", String(active));
    btn.tabIndex = active ? 0 : -1;
  });
}

function showToast(message) {
  toast.hidden = false;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 250);
  }, 2200);
}

packingButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    render(btn.dataset.id);
  });

  btn.addEventListener("keydown", (event) => {
    const nextKeys = ["ArrowRight", "ArrowDown"];
    const prevKeys = ["ArrowLeft", "ArrowUp"];
    if (![...nextKeys, ...prevKeys, "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    let nextIndex = index;
    if (nextKeys.includes(event.key)) nextIndex = (index + 1) % packingButtons.length;
    if (prevKeys.includes(event.key)) nextIndex = (index - 1 + packingButtons.length) % packingButtons.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = packingButtons.length - 1;

    const next = packingButtons[nextIndex];
    render(next.dataset.id);
    next.focus();
  });
});

cartButton.addEventListener("click", () => {
  const packing = PACKINGS[selectedId];
  const label = packingButtons.find((btn) => btn.dataset.id === selectedId)?.textContent.trim();
  showToast(`«Ананасовый улун», ${label} (${packing.sku}) добавлен в корзину`);
});

render(selectedId);
