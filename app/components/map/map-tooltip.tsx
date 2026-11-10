import type { ElectionResult } from "@/app/lib/election-data";

export function createTooltip(id: string): HTMLDivElement {
  const tooltip = document.createElement("div");

  tooltip.id = id;
  tooltip.setAttribute("role", "tooltip");
  tooltip.setAttribute("aria-live", "polite");
  tooltip.setAttribute("aria-atomic", "true");

  tooltip.style.cssText = `
    position: absolute;
    display: none;
    pointer-events: none;
    z-index: 10;
    min-width: 190px;
    padding: 12px 14px;
    color: var(--map-tooltip-color);
    background: var(--map-tooltip-background);
    border: 1px solid var(--map-tooltip-border);
    border-radius: 6px;
    box-shadow: var(--map-tooltip-shadow);
    font: 13px/1.5 sans-serif;
  `;

  return tooltip;
}

export function populateTooltip(
  tooltip: HTMLDivElement,
  result: ElectionResult,
  displayName: string
) {
  tooltip.replaceChildren();

  const heading = document.createElement("div");
  heading.textContent = result.coolName || displayName;
  heading.style.cssText = `
    font-size: 14px;
    font-weight: 700;
  `;
  tooltip.appendChild(heading);

  if (result.coolName) {
    const subtitle = document.createElement("div");
    subtitle.textContent = displayName;
    subtitle.style.cssText = `
      color: var(--map-tooltip-muted);
      font-size: 12px;
      margin-bottom: 8px;
    `;
    tooltip.appendChild(subtitle);
  } else {
    heading.style.marginBottom = "8px";
  }

  result.candidates.forEach((candidate) => {
    const row = document.createElement("div");

    row.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    `;

    // Candidate name and color swatch.
    const nameGroup = document.createElement("span");
    nameGroup.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 7px;
    `;

    const swatch = document.createElement("span");
    swatch.style.cssText = `
      display: inline-block;
      width: 11px;
      height: 11px;
      flex-shrink: 0;
      border-radius: 3px;
      background: ${
        candidate.name === "Option A"
          ? "var(--map-option-a)"
          : "var(--map-option-b)"
      };
    `;
    swatch.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.textContent = candidate.name;

    nameGroup.append(swatch, name);

    const percentage = document.createElement("strong");
    percentage.textContent = `${candidate.percentage.toFixed(1)}%`;

    row.append(nameGroup, percentage);
    tooltip.appendChild(row);

    const total = document.createElement("div");
    total.textContent = `${candidate.total.toLocaleString()} votes`;
    total.style.cssText = `
      color: var(--map-tooltip-muted);
      font-size: 11px;
      margin-bottom: 4px;
    `;

    tooltip.appendChild(total);
  });
}