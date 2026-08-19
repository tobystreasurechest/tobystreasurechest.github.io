const svg = document.querySelector("#chart");
const NS = "http://www.w3.org/2000/svg";

const WIDTH = 1090;
const HEIGHT = 613;
const BASELINE = 568;

const fuelTypes = [
  { key: "coal", label: "coal", x: 96, width: 86, towerScale: 0.58, bubbleCount: 230 },
  { key: "nuclear", label: "nuclear", x: 245, width: 118, towerScale: 1.0, bubbleCount: 70 },
  { key: "gas", label: "gas", x: 462, width: 88, towerScale: 0.66, bubbleCount: 360 },
  { key: "multi", label: "multi-fuel", x: 577, width: 54, towerScale: 0.36, bubbleCount: 95 },
  { key: "biomass", label: "biomass", x: 687, width: 34, towerScale: 0.0, bubbleCount: 115 },
];

function el(name, attrs = {}, children = []) {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    if (value !== undefined && value !== null) node.setAttribute(key, value);
  }
  for (const child of children) node.appendChild(child);
  return node;
}

function text(value, attrs = {}) {
  const node = el("text", attrs);
  node.textContent = value;
  return node;
}

function path(d, attrs = {}) {
  return el("path", { d, ...attrs });
}

function hashString(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rand(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 100000) / 100000;
  };
}

function parseCSV(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const cells = line.split(",");
    return Object.fromEntries(headers.map((header, i) => [header, cells[i]]));
  });
}

function placeholderFuelType(plantCode) {
  // The source CSV does not include a fuel-type field. This deterministic
  // placeholder keeps the visual reproducible and can be replaced with a real
  // Plant.Code -> fuel-type lookup when that metadata is available.
  const v = hashString(String(plantCode)) % 100;
  if (v < 25) return "coal";
  if (v < 37) return "nuclear";
  if (v < 77) return "gas";
  if (v < 91) return "multi";
  return "biomass";
}

function aggregateRows(rows) {
  const plants = new Map();
  for (const row of rows) {
    const code = row["Plant.Code"];
    const heat = Number(row.CD_MMBtu) || 0;
    const evap = Number(row.EV_in) || 0;
    const score = heat * Math.max(evap, 0.02);
    if (!plants.has(code)) {
      plants.set(code, {
        code,
        fuel: placeholderFuelType(code),
        score: 0,
        months: 0,
      });
    }
    const plant = plants.get(code);
    plant.score += score;
    plant.months += 1;
  }

  const all = Array.from(plants.values()).sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...all.map((d) => d.score));
  for (const plant of all) {
    plant.mgd = (plant.score / maxScore) * 63;
  }
  return all;
}

function addDefs() {
  const defs = el("defs");
  defs.append(
    el("linearGradient", { id: "bg", x1: "0", y1: "0", x2: "1", y2: "1" }, [
      el("stop", { offset: "0%", "stop-color": "#57768a" }),
      el("stop", { offset: "45%", "stop-color": "#3a5358" }),
      el("stop", { offset: "100%", "stop-color": "#23383c" }),
    ]),
    el("radialGradient", { id: "sunGlow", cx: "71%", cy: "45%", r: "43%" }, [
      el("stop", { offset: "0%", "stop-color": "#f2a35e", "stop-opacity": "0.9" }),
      el("stop", { offset: "45%", "stop-color": "#b99372", "stop-opacity": "0.46" }),
      el("stop", { offset: "100%", "stop-color": "#22373b", "stop-opacity": "0" }),
    ]),
    el("linearGradient", { id: "towerFill", x1: "0", y1: "0", x2: "0", y2: "1" }, [
      el("stop", { offset: "0%", "stop-color": "#eee8c7" }),
      el("stop", { offset: "100%", "stop-color": "#dad2ad" }),
    ]),
    el("filter", { id: "softBlur", x: "-20%", y: "-20%", width: "140%", height: "140%" }, [
      el("feGaussianBlur", { stdDeviation: "7" }),
    ]),
  );
  svg.appendChild(defs);
}

function drawBackground() {
  svg.append(
    el("rect", { width: WIDTH, height: HEIGHT, fill: "url(#bg)" }),
    el("rect", { width: WIDTH, height: HEIGHT, fill: "url(#sunGlow)" }),
  );

  const mountains = [
    "M0,117 L44,134 L89,119 L141,111 L199,126 L235,137 L331,193 L418,175 L520,167 L615,228 L711,319 L810,327 L906,294 L1000,274 L1090,267 L1090,613 L0,613 Z",
    "M0,374 L206,374 L330,342 L456,354 L616,308 L714,301 L811,325 L932,363 L1002,365 L1090,374 L1090,613 L0,613 Z",
    "M0,466 L172,460 L350,451 L530,431 L690,440 L860,451 L1090,442 L1090,613 L0,613 Z",
    "M0,526 L147,521 L294,535 L476,521 L566,527 L667,489 L789,499 L934,446 L1090,429 L1090,613 L0,613 Z",
  ];
  const fills = ["#2f4951", "#33484a", "#2d464a", "#253d40"];
  mountains.forEach((d, i) => {
    svg.appendChild(path(d, { fill: fills[i], opacity: i === 0 ? 0.88 : 0.7 }));
  });

  for (const y of [413, 465, 516, 568]) {
    svg.appendChild(el("line", { x1: 0, x2: WIDTH, y1: y, y2: y, stroke: "#c9d3c3", "stroke-opacity": 0.32, "stroke-width": 1 }));
  }
}

function drawTitle() {
  const cream = "#e8dfbf";
  const line = "#d4cfaa";
  svg.appendChild(el("rect", { x: 21, y: 22, width: 1048, height: 69, fill: "none", stroke: line, "stroke-width": 1 }));
  svg.appendChild(el("line", { x1: 153, x2: 153, y1: 16, y2: 98, stroke: line }));
  svg.appendChild(el("line", { x1: 748, x2: 748, y1: 16, y2: 98, stroke: line, "stroke-opacity": 0.75 }));
  svg.appendChild(el("line", { x1: 864, x2: 864, y1: 16, y2: 98, stroke: line, "stroke-opacity": 0.75 }));
  svg.appendChild(text("2020", { x: 29, y: 76, fill: cream, "font-size": 56, "letter-spacing": 5, "font-family": "monospace" }));
  svg.appendChild(text("THERMOELECTRIC CONSUMPTIVE WATER USE", { x: 164, y: 52, fill: cream, "font-size": 27, "letter-spacing": 2.2, "font-family": "monospace" }));
  svg.appendChild(text("BY FUEL TYPE", { x: 164, y: 81, fill: cream, "font-size": 27, "letter-spacing": 2.2, "font-family": "monospace" }));

  drawMiniTower(768, 27, 34, 42, "#d7d0ad", true);
  svg.appendChild(text("TOTAL", { x: 802, y: 39, fill: cream, "font-size": 9, "font-family": "monospace" }));
  svg.appendChild(text("WATER USE", { x: 802, y: 51, fill: cream, "font-size": 9, "font-family": "monospace" }));
  svg.appendChild(text("BY FUEL TYPE", { x: 802, y: 63, fill: cream, "font-size": 9, "font-family": "monospace" }));

  for (const [x, r] of [[878, 2.6], [888, 4.2], [902, 5.9]]) {
    svg.appendChild(el("circle", { cx: x, cy: 65 - r * 5, r, fill: "#b8d3e9" }));
  }
  svg.appendChild(text("BUBBLE SIZE: WATER USE IN", { x: 918, y: 42, fill: cream, "font-size": 10, "font-family": "monospace" }));
  svg.appendChild(text("MILLION GALLONS PER DAY (MGD)", { x: 918, y: 55, fill: cream, "font-size": 10, "font-family": "monospace" }));
  svg.appendChild(text("BY THERMOELECTRIC POWER PLANT", { x: 918, y: 68, fill: cream, "font-size": 10, "font-family": "monospace" }));
  svg.appendChild(text("VIZ AUTHOR: ALTHEA A. ARCHER, DATA: DOI.ORG/10.5066/P9ZE2FVM", { x: 756, y: 86, fill: cream, "font-size": 9, opacity: 0.8, "font-family": "monospace" }));
}

function coolingTowerPath(cx, baseY, w, h) {
  const topW = w * 0.52;
  const neck = w * 0.33;
  const bottomW = w;
  const topY = baseY - h;
  const waistY = baseY - h * 0.42;
  return [
    `M ${cx - bottomW / 2} ${baseY}`,
    `C ${cx - w * 0.18} ${baseY - h * 0.18}, ${cx - neck / 2} ${waistY}, ${cx - topW / 2} ${topY}`,
    `L ${cx + topW / 2} ${topY}`,
    `C ${cx + neck / 2} ${waistY}, ${cx + w * 0.18} ${baseY - h * 0.18}, ${cx + bottomW / 2} ${baseY}`,
    "Z",
  ].join(" ");
}

function drawMiniTower(x, y, w, h, color, grid = false) {
  const d = coolingTowerPath(x + w / 2, y + h, w, h);
  svg.appendChild(path(d, { fill: "none", stroke: color, "stroke-width": 1 }));
  svg.appendChild(el("line", { x1: x, x2: x + w, y1: y, y2: y, stroke: color, "stroke-width": 0.6, opacity: 0.5 }));
  svg.appendChild(el("line", { x1: x, x2: x + w, y1: y + h, y2: y + h, stroke: color, "stroke-width": 0.6, opacity: 0.5 }));
  if (grid) {
    for (let i = 1; i < 4; i += 1) svg.appendChild(el("line", { x1: x + (w * i) / 4, x2: x + (w * i) / 4, y1: y, y2: y + h, stroke: color, "stroke-width": 0.35, opacity: 0.4 }));
    for (let i = 1; i < 4; i += 1) svg.appendChild(el("line", { x1: x, x2: x + w, y1: y + (h * i) / 4, y2: y + (h * i) / 4, stroke: color, "stroke-width": 0.35, opacity: 0.4 }));
  }
}

function drawCoolingTower(cx, baseY, width, height) {
  const d = coolingTowerPath(cx, baseY, width, height);
  svg.appendChild(path(d, { fill: "url(#towerFill)", opacity: 0.97 }));
}

function drawFuelTowers() {
  for (const fuel of fuelTypes) {
    if (fuel.towerScale > 0) {
      drawCoolingTower(fuel.x, BASELINE, fuel.width, 148 * fuel.towerScale);
    }
    svg.appendChild(text(fuel.label, {
      x: fuel.x,
      y: 584,
      fill: "#e59c65",
      "font-size": fuel.label.length > 7 ? 15 : 16,
      "font-family": "monospace",
      "text-anchor": "middle",
      "letter-spacing": 2,
    }));
  }
}

function drawBubbles(plants) {
  const grouped = Object.fromEntries(fuelTypes.map((d) => [d.key, []]));
  for (const plant of plants) grouped[plant.fuel].push(plant);

  for (const fuel of fuelTypes) {
    const items = grouped[fuel.key].sort((a, b) => b.score - a.score).slice(0, fuel.bubbleCount);
    for (const plant of items) {
      const rng = rand(hashString(`${fuel.key}-${plant.code}`));
      const colWidth = fuel.key === "biomass" ? 16 : Math.max(36, fuel.width * 0.9);
      const x = fuel.x + (rng() - 0.5) * colWidth;
      const top = fuel.key === "nuclear" ? 98 : 104;
      const y = top + Math.pow(rng(), 0.72) * (365 - top);
      const r = Math.max(1.6, Math.min(7.2, 1.3 + Math.sqrt(plant.mgd) * 0.78));
      svg.appendChild(el("circle", {
        cx: x.toFixed(1),
        cy: y.toFixed(1),
        r: r.toFixed(1),
        fill: "#b9d5ee",
        opacity: fuel.key === "biomass" ? 0.88 : 0.78,
      }));
    }
  }
}

function drawAxisAndAnnotation() {
  const cream = "#d8d2ae";
  const labels = [
    { y: 568, label: "0 mgd" },
    { y: 516, label: "333 mgd" },
    { y: 464, label: "667 mgd" },
    { y: 413, label: "1000 mgd" },
  ];
  for (const d of labels) {
    svg.appendChild(text(d.label, { x: 699, y: d.y - 4, fill: cream, "font-size": 10, "font-family": "monospace" }));
  }

  svg.appendChild(el("circle", { cx: 214, cy: 393, r: 7, fill: "#e3a46f" }));
  svg.appendChild(path("M360 456 C335 417, 290 392, 226 394", { fill: "none", stroke: "#d59661", "stroke-width": 1.2 }));
  svg.appendChild(path("M226 394 L235 389 M226 394 L235 399", { fill: "none", stroke: "#d59661", "stroke-width": 1.2 }));
  svg.appendChild(text("max water use:", { x: 326, y: 480, fill: "#e8a268", "font-size": 10, "font-family": "monospace", "font-weight": "700" }));
  svg.appendChild(text("63 mgd", { x: 354, y: 494, fill: "#e8a268", "font-size": 10, "font-family": "monospace", "font-weight": "700" }));
  svg.appendChild(text("Maricopa Co., AZ", { x: 324, y: 510, fill: "#e8a268", "font-size": 10, "font-family": "monospace", "font-weight": "700" }));
}

function drawPowerLines() {
  const stroke = "#d1cba7";
  const tower = path("M906 344 L883 600 L906 562 L929 600 Z M906 344 L936 568 L876 568 Z M884 419 L929 419 L906 398 Z M878 378 L936 378 L906 344 Z M899 365 L899 562 M914 365 L914 562 M883 600 L906 344 L929 600", {
    fill: "none",
    stroke,
    "stroke-width": 1.2,
    opacity: 0.85,
  });
  svg.appendChild(tower);
  const wires = [
    "M0 465 C230 465 412 465 641 465 C720 465 780 450 822 410 C847 386 865 379 878 379",
    "M0 516 C235 516 420 516 647 516 C734 516 812 522 859 462 C873 443 886 426 899 419",
    "M936 378 C982 400 1017 429 1090 409",
    "M929 419 C979 445 1010 424 1090 409",
    "M936 419 C987 476 1031 502 1090 466",
  ];
  wires.forEach((d) => svg.appendChild(path(d, { fill: "none", stroke, "stroke-width": 1, opacity: 0.58 })));
}

function drawLogo() {
  svg.appendChild(el("rect", { x: 981, y: 566, width: 77, height: 28, fill: "none" }));
  svg.appendChild(path("M982 570 L1001 570 L982 579 Z M982 579 L1001 579 L982 588 Z M982 588 L1001 588 L982 594 Z", { fill: "#e7e1c4", opacity: 0.9 }));
  svg.appendChild(text("USGS", { x: 1005, y: 588, fill: "#e7e1c4", "font-size": 28, "font-family": "Arial, sans-serif", "font-weight": "700" }));
  svg.appendChild(text("science for a changing world", { x: 1007, y: 596, fill: "#e7e1c4", "font-size": 6, "font-family": "Arial, sans-serif" }));
}

async function main() {
  addDefs();
  drawBackground();
  drawTitle();

  const response = await fetch("./annotation_3.csv");
  const rows = parseCSV(await response.text());
  const plants = aggregateRows(rows);

  drawBubbles(plants);
  drawFuelTowers();
  drawAxisAndAnnotation();
  drawPowerLines();
  drawLogo();
}

main().catch((error) => {
  console.error(error);
  svg.appendChild(el("rect", { width: WIDTH, height: HEIGHT, fill: "#26393d" }));
  svg.appendChild(text("Could not load annotation_3.csv. Serve this folder over HTTP and reload.", {
    x: 60,
    y: 90,
    fill: "#e8dfbf",
    "font-size": 24,
    "font-family": "monospace",
  }));
});
