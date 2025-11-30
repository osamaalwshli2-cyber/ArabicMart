import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { CustomerAuthModal } from "@/components/storefront/CustomerAuthModal";
import { CheckCircle, Package, Truck, Home, ArrowLeft } from "lucide-react";
import type { OrderWithItems } from "@shared/schema";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:orderNumber");
  const orderNumber = params?.orderNumber;
  const [showAuthModal, setShowAuthModal] = useState(true);

  const { data: order, isLoading } = useQuery<OrderWithItems>({
    queryKey: ["/api/orders/number", orderNumber],
    enabled: !!orderNumber,
    onSuccess: (data) => {
      // Save customer email to localStorage for My Orders feature
      if (data?.customerEmail) {
        localStorage.setItem("customerEmail", data.customerEmail);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Skeleton className="h-8 w-48 mb-8" />
            <Card>
              <CardContent className="p-8">
                <Skeleton className="h-20 w-20 rounded-full mx-auto mb-6" />
                <Skeleton className="h-8 w-64 mx-auto mb-4" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">الطلب غير موجود</h1>
            <Link href="/">
              <Button>العودة للرئيسية</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {order && (
        <CustomerAuthModal
          open={showAuthModal}
          orderEmail={order.customerEmail}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2" data-testid="text-order-success">
                تم تأكيد طلبك بنجاح!
              </h1>
              <p className="text-muted-foreground mb-4">
                شكراً لك على طلبك. سنقوم بمعالجته في أقرب وقت.
              </p>
              <div className="inline-block bg-muted px-4 py-2 rounded-lg">
                <span className="text-sm text-muted-foreground">رقم الطلب: </span>
                <span className="font-bold" data-testid="text-order-number">{order.orderNumber}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground mb-2">
                <CheckCircle className="h-6 w-6" />
              </div>
              <span className="text-xs text-center">تم الطلب</span>
            </div>
            <div className="flex-1 max-w-16 h-0.5 bg-muted self-center mt-[-24px]" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-xs text-center text-muted-foreground">قيد التجهيز</span>
            </div>
            <div className="flex-1 max-w-16 h-0.5 bg-muted self-center mt-[-24px]" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
                <Truck className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-xs text-center text-muted-foreground">تم الشحن</span>
            </div>
            <div className="flex-1 max-w-16 h-0.5 bg-muted self-center mt-[-24px]" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
                <Home className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-xs text-center text-muted-foreground">تم التسليم</span>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                <span>تفاصيل الطلب</span>
                <OrderStatusBadge status={order.status || "pending"} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">معلومات العميل</h3>
                  <p className="text-sm text-muted-foreground">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground" dir="ltr">{order.customerEmail}</p>
                  <p className="text-sm text-muted-foreground" dir="ltr">{order.customerPhone}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">عنوان الشحن</h3>
                  <p className="text-sm text-muted-foreground">{order.shippingCity}</p>
                  <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">المنتجات</h3>
                <div className="space-y-3">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.productNameAr}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {parseFloat(item.price).toFixed(2)} ر.س
                        </p>
                      </div>
                      <p className="font-medium">{parseFloat(item.total).toFixed(2)} ر.س</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{parseFloat(order.subtotal).toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الشحن</span>
                  <span>
                    {parseFloat(order.shippingCost || "0") === 0 ? (
                      <span className="text-green-600">مجاني</span>
                    ) : (
                      `${parseFloat(order.shippingCost || "0").toFixed(2)} ر.س`
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span className="text-primary">{parseFloat(order.total).toFixed(2)} ر.س</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-continue-shopping">
                متابعة التسوق
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
