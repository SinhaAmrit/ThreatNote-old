import { cn } from "@/lib/utils";

export type SeverityLevel = "critical" | "high" | "medium" | "low" | "informational";

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

const severityConfig = {
  critical: {
    label: "Critical",
    className: "severity-critical"
  },
  high: {
    label: "High", 
    className: "severity-high"
  },
  medium: {
    label: "Medium",
    className: "severity-medium"
  },
  low: {
    label: "Low",
    className: "severity-low"
  },
  informational: {
    label: "Informational",
    className: "severity-informational"
  }
} as const;

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  
  return (
    <span className={cn(config.className, className)}>
      {config.label}
    </span>
  );
}