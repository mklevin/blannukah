
const LEGEND_ITEMS = [
  {
    label: "Option A",
    color: "var(--map-option-a)",
  },
  {
    label: "Option B",
    color: "var(--map-option-b)",
  },
];

export function createLegend(): HTMLDivElement {
  const legend = document.createElement("div");
  legend.className = "map-legend";
  legend.setAttribute("aria-label", "Map color legend");

  LEGEND_ITEMS.forEach(({ label, color }) => {
    const item = document.createElement("span");
    item.className = "map-legend__item";

    const swatch = document.createElement("span");
    swatch.className = "map-legend__swatch";
    swatch.style.backgroundColor = color;

    const text = document.createElement("span");
    text.textContent = label;

    item.append(swatch, text);
    legend.appendChild(item);
  });

  return legend;
}
