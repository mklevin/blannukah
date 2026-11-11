
type LegendCandidate = {
  name: string;
};

const LEGEND_COLORS = [
  "var(--map-option-a)",
  "var(--map-option-b)",
];

export function createLegend(
  candidates: [LegendCandidate, LegendCandidate]
): HTMLDivElement {
  const legend = document.createElement("div");
  legend.className = "map-legend";
  legend.setAttribute("aria-label", "Map color legend");

  candidates.forEach((candidate, index) => {
    const item = document.createElement("span");
    item.className = "map-legend__item";

    const swatch = document.createElement("span");
    swatch.className = "map-legend__swatch";
    swatch.style.backgroundColor = LEGEND_COLORS[index];

    const text = document.createElement("span");
    text.textContent = candidate.name;

    item.append(swatch, text);
    legend.appendChild(item);
  });

  return legend;
}
