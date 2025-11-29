import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { OrderStatusBadge, getStatusOptions } from "@/components/admin/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowRight, MapPin, Phone, Mail, CreditCard } from "lucide-react";
import type { OrderWithItems } from "@shared/schema";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function AdminOrderDetails() {
  const [, params] = useRoute("/admin/orders/:id");
  const orderId = params?.id;
  const { toast } = useToast();

  const { data: order, isLoading } = useQuery<OrderWithItems>({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "تم تحديث حالة الطلب" });
    },
    onError: () => {
      toast({ title: "حدث خطأ", variant: "destructive" });
    },
  });

  const statusOptions = getStatusOptions();

  if (isLoading) {
    return (
      <AdminLayout title="تفاصيل الطلب">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="تفاصيل الطلب">
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">الطلب غير موجود</p>
          <Link href="/admin/orders">
            <Button>العودة للطلبات</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const paymentMethodLabel = order.paymentMethod === "cod" ? "الدفع عند الاستلام" : "بطاقة ائتمان";

  return (
    <AdminLayout
      title={`طلب #${order.orderNumber}`}
      description={
        order.createdAt
          ? format(new Date(order.createdAt), "dd MMMM yyyy - HH:mm", { locale: ar })
          : undefined
      }
      actions={
        <Link href="/admin/orders">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            العودة للطلبات
          </Button>
        </Link>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <CardTitle>حالة الطلب</CardTitle>
              <Select
                value={order.status || "pending"}
                onValueChange={(status) =>
                  updateStatusMutation.mutate({ id: order.id, status })
                }
              >
                <SelectTrigger className="w-40" data-testid="select-update-status">
                  <SelectValue>
                    <OrderStatusBadge status={order.status || "pending"} />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المنتج</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">الإجمالي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productNameAr}</TableCell>
                      <TableCell>{parseFloat(item.price).toFixed(2)} ر.س</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{parseFloat(item.total).toFixed(2)} ر.س</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{parseFloat(order.subtotal).toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between">
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
                  <span className="text-primary" data-testid="text-order-total">
                    {parseFloat(order.total).toFixed(2)} ر.س
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>ملاحظات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات العميل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium" data-testid="text-customer-name">{order.customerName}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span dir="ltr">{order.customerEmail}</span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span dir="ltr">{order.customerPhone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>عنوان الشحن</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  {order.shippingCity && (
                    <p className="font-medium">{order.shippingCity}</p>
                  )}
                  <p className="text-muted-foreground">{order.shippingAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>طريقة الدفع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>{paymentMethodLabel}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
