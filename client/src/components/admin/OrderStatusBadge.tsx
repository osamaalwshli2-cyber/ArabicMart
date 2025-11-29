import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderStatusBadgeProps {
  status: string;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "قيد الانتظار", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  processing: { label: "قيد التجهيز", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  shipped: { label: "تم الشحن", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  delivered: { label: "تم التسليم", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  cancelled: { label: "ملغي", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status as OrderStatus] || statusConfig.pending;
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

export function getStatusOptions() {
  return Object.entries(statusConfig).map(([value, { label }]) => ({
    value,
    label,
  }));
}
