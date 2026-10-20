// Generates every value in the browser with the Web Crypto CSPRNG; nothing is
// sent anywhere. A reload, the ↻ button or R makes a fresh set.

const COUNT = 5;
const ALNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Rejection sampling keeps every character equally likely: 248 is the largest
// multiple of 62 that fits in a byte, so b % 62 has no bias below it.
function alnum(length) {
  let out = "";
  while (out.length < length) {
    for (const b of crypto.getRandomValues(new Uint8Array(length))) {
      if (b < 248 && out.length < length) out += ALNUM[b % 62];
    }
  }
  return out;
}

const hex = (bytes) =>
  Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (b) => b.toString(16).padStart(2, "0")).join("");

const KINDS = [
  { title: "UUID v4", meta: "36 chars", make: () => crypto.randomUUID() },
  { title: "Alphanumeric", meta: "32 chars · A–Z a–z 0–9", make: () => alnum(32) },
  { title: "Hex", meta: "32 bytes · 64 chars · AES-256, SHA-256", make: () => hex(32) },
];

const main = document.querySelector("main");
const status = document.getElementById("status");
if (matchMedia("(hover: none)").matches) document.querySelector(".hint").textContent = "tap to copy";

function render() {
  main.replaceChildren(
    ...KINDS.map((kind) => {
      const section = document.createElement("section");
      section.innerHTML = `<h2>${kind.title} <span class="meta">${kind.meta}</span></h2><ul></ul>`;
      const list = section.querySelector("ul");
      for (let i = 0; i < COUNT; i++) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "value";
        button.textContent = kind.make();
        const item = document.createElement("li");
        item.append(button);
        list.append(item);
      }
      return section;
    })
  );
}

main.addEventListener("click", async (event) => {
  const button = event.target.closest(".value");
  if (!button) return;
  await navigator.clipboard.writeText(button.textContent);
  for (const el of main.querySelectorAll(".copied")) el.classList.remove("copied");
  void button.offsetWidth; // restart the flash when the same value is copied again
  button.classList.add("copied");
  status.textContent = "Copied";
  clearTimeout(button.timer);
  button.timer = setTimeout(() => button.classList.remove("copied"), 1200);
});

document.getElementById("again").addEventListener("click", render);
addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "r" && !event.metaKey && !event.ctrlKey && !event.altKey) render();
});

render();
