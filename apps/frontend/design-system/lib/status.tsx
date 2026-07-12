import {
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  Info,
  TriangleAlert,
} from "lucide-react";

/**
 * Shared status vocabulary (product spec §14.4). Status always combines
 * text, an icon or shape, and color as reinforcement — never color alone.
 *
 * - success: deterministically verified success only
 * - danger: errors, failures, destructive actions only
 * - proposal: unapplied assistant-originated changes only
 */
export type Status = "neutral" | "info" | "success" | "warning" | "danger" | "proposal";

const icons = {
  neutral: Circle,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
  proposal: CircleDashed,
} as const;

export function StatusIcon({
  status,
  size = 14,
  className,
}: {
  status: Status;
  size?: number;
  className?: string;
}) {
  const Icon = icons[status];
  return <Icon size={size} aria-hidden className={className} />;
}
