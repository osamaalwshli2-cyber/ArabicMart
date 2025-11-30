import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Package, Truck, CheckCircle, Clock } from "lucide-react";
import type { Order } from "@shared/schema";

function OrderSkeleton() {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "قيد المعالجة", color: "bg-blue-100 text-blue-800", icon: Package },
  shipped: { label: "تم الشحن", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "تم التسليم", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "ملغى", color: "bg-red-100 text-red-800", icon: AlertCircle },
};

export default function MyOrders() {
  const [, setLocation] = useLocation();
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get customer email from localStorage
    const email = localStorage.getItem("customerEmail");
    if (!email) {
      setLocation("/");
      return;
    }
    setCustomerEmail(email);
  }, [setLocation]);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/by-email", customerEmail],
    enabled: !!customerEmail,
    queryFn: async () => {
      if (!customerEmail) return [];
      const response = await fetch(`/api/orders/by-email?email=${encodeURIComponent(customerEmail)}`);
      return response.json();
    },
  });

  if (!customerEmail) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-my-orders-title">طلباتي</h1>
          <p className="text-muted-foreground">تتبع جميع طلباتك هنا</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={order.id} className="hover-elevate" data-testid={`card-order-${order.id}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg" data-testid={`text-order-number-${order.id}`}>
                          طلب: {order.orderNumber}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={statusInfo.color} data-testid={`badge-status-${order.id}`}>
                          <StatusIcon className="w-3 h-3 ml-2" />
                          {statusInfo.label}
                        </Badge>
                        <span className="text-lg font-bold text-primary" data-testid={`text-total-${order.id}`}>
                          {parseFloat(order.total).toFixed(2)} ر.س
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">المدينة</p>
                        <p className="font-medium" data-testid={`text-city-${order.id}`}>{order.shippingCity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">طريقة الدفع</p>
                        <p className="font-medium" data-testid={`text-payment-${order.id}`}>
                          {order.paymentMethod === "cod" ? "عند الاستلام" : "بطاقة"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">عدد المنتجات</p>
                        <p className="font-medium">-</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">الرقم المرجعي</p>
                        <p className="text-xs font-mono text-muted-foreground" data-testid={`text-ref-${order.id}`}>
                          {order.id}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 pb-4 border-t">
                      <div className="flex justify-between pt-4">
                        <span className="text-muted-foreground">المجموع الجزئي:</span>
                        <span>{parseFloat(order.subtotal).toFixed(2)} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الشحن:</span>
                        <span>{parseFloat(order.shippingCost).toFixed(2)} ر.س</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a href={`/order-confirmation/${order.orderNumber}`}>
                        <Button variant="outline" size="sm" data-testid={`button-details-${order.id}`}>
                          عرض التفاصيل
                        </Button>
                      </a>
                      {order.status === "shipped" && (
                        <Button variant="outline" size="sm" data-testid={`button-track-${order.id}`}>
                          تتبع الشحنة
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">لا توجد طلبات لديك حالياً</p>
            <a href="/">
              <Button data-testid="button-continue-shopping">
                استمر في التسوق
              </Button>
            </a>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
