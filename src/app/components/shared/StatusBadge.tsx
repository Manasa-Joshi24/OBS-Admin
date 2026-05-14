import { Badge } from "../Badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "ready":
      case "active":
      case "completed":
      case "matched":
      case "delivered":
      case "credit":
        return "success";
      case "processing":
      case "pending":
      case "mismatch":
        return "warning";
      case "failed":
      case "rejected":
      case "error":
      case "failed posting":
        return "danger";
      case "duplicate":
        return "purple";
      case "debit":
      case "scheduled":
        return "info";
      default:
        return "neutral";
    }
  };

  return <Badge label={status} variant={getVariant(status)} />;
}
