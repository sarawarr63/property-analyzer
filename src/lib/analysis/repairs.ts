import type { PropertySummary, RepairRecommendation } from "./types";

interface RepairTemplate {
  category: string;
  title: string;
  description: string;
  baseCost: number;
  priority: RepairRecommendation["priority"];
  roiImpact: RepairRecommendation["roiImpact"];
  conditions: PropertySummary["condition"][];
}

const REPAIR_TEMPLATES: RepairTemplate[] = [
  {
    category: "Exterior",
    title: "Roof replacement",
    description: "Replace aging shingles and repair underlying decking to prevent water intrusion.",
    baseCost: 12000,
    priority: "high",
    roiImpact: "high",
    conditions: ["poor", "fair"],
  },
  {
    category: "Exterior",
    title: "Exterior paint & siding repair",
    description: "Refresh curb appeal with new paint and repair damaged siding panels.",
    baseCost: 6500,
    priority: "medium",
    roiImpact: "high",
    conditions: ["poor", "fair", "good"],
  },
  {
    category: "Kitchen",
    title: "Kitchen refresh",
    description: "Update cabinets, countertops, and fixtures for a modern, functional kitchen.",
    baseCost: 15000,
    priority: "high",
    roiImpact: "high",
    conditions: ["poor", "fair", "good"],
  },
  {
    category: "Bathrooms",
    title: "Bathroom remodel",
    description: "Replace vanity, tile, and fixtures to meet current buyer expectations.",
    baseCost: 9000,
    priority: "medium",
    roiImpact: "medium",
    conditions: ["poor", "fair", "good"],
  },
  {
    category: "Flooring",
    title: "Flooring replacement",
    description: "Install new LVP or hardwood throughout main living areas.",
    baseCost: 7500,
    priority: "medium",
    roiImpact: "medium",
    conditions: ["poor", "fair"],
  },
  {
    category: "Systems",
    title: "HVAC service or replacement",
    description: "Ensure heating and cooling systems are efficient and code-compliant.",
    baseCost: 5500,
    priority: "high",
    roiImpact: "medium",
    conditions: ["poor", "fair", "good"],
  },
  {
    category: "Systems",
    title: "Electrical panel upgrade",
    description: "Upgrade to 200-amp service for safety and modern appliance loads.",
    baseCost: 3200,
    priority: "high",
    roiImpact: "low",
    conditions: ["poor", "fair"],
  },
  {
    category: "Interior",
    title: "Drywall repair & interior paint",
    description: "Patch holes, skim coat, and apply fresh neutral paint throughout.",
    baseCost: 4500,
    priority: "medium",
    roiImpact: "medium",
    conditions: ["poor", "fair", "good"],
  },
  {
    category: "Landscaping",
    title: "Landscaping & curb appeal",
    description: "Trim overgrowth, add mulch, and improve front-yard presentation.",
    baseCost: 2500,
    priority: "low",
    roiImpact: "high",
    conditions: ["poor", "fair", "good", "excellent"],
  },
  {
    category: "Windows",
    title: "Window replacement (select units)",
    description: "Replace drafty or damaged windows to improve energy efficiency.",
    baseCost: 4800,
    priority: "low",
    roiImpact: "medium",
    conditions: ["poor", "fair"],
  },
];

function scaleCost(baseCost: number, squareFeet: number): number {
  const factor = squareFeet / 1500;
  return Math.round(baseCost * Math.max(0.75, Math.min(1.5, factor)));
}

/**
 * Generates repair recommendations based on property condition and size.
 */
export function generateRepairRecommendations(
  summary: PropertySummary
): RepairRecommendation[] {
  const applicable = REPAIR_TEMPLATES.filter((t) =>
    t.conditions.includes(summary.condition)
  );

  const age = new Date().getFullYear() - summary.yearBuilt;
  const extraSystems =
    age > 30 && !applicable.some((t) => t.title.includes("HVAC"))
      ? []
      : [];

  const selected = [...applicable.slice(0, 6), ...extraSystems];

  if (summary.condition === "excellent") {
    return [
      {
        id: "maint-1",
        category: "Maintenance",
        title: "Preventive maintenance package",
        description:
          "Minor touch-ups, gutter cleaning, and HVAC tune-up to preserve value.",
        estimatedCost: scaleCost(1800, summary.squareFeet),
        priority: "low",
        roiImpact: "medium",
      },
      {
        id: "land-1",
        category: "Landscaping",
        title: "Landscaping refresh",
        description: "Seasonal landscaping to maximize curb appeal before listing.",
        estimatedCost: scaleCost(2500, summary.squareFeet),
        priority: "low",
        roiImpact: "high",
      },
    ];
  }

  return selected.map((template, index) => ({
    id: `repair-${index + 1}`,
    category: template.category,
    title: template.title,
    description: template.description,
    estimatedCost: scaleCost(template.baseCost, summary.squareFeet),
    priority: template.priority,
    roiImpact: template.roiImpact,
  }));
}

export function sumRepairCosts(repairs: RepairRecommendation[]): number {
  return repairs.reduce((sum, r) => sum + r.estimatedCost, 0);
}
