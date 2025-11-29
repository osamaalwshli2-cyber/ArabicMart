import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, FolderTree, ShoppingBag, Users, Eye } from "lucide-react";
import { Link } from "wouter";
import type { Product, Category, Order, Customer } from "@shared/schema";

export default function AdminDashboard() {
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: customers, isLoading: customersLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
  const recentOrders = orders?.slice(0, 5) || [];

  const isLoading = productsLoading || categoriesLoading || ordersLoading || customersLoading;

  return (
    <AdminLayout title="لوحة التحكم" description="نظرة عامة على متجرك">
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <StatsCard
                title="إجمالي المنتجات"
                value={products?.length || 0}
                icon={Package}
                testId="stats-products"
              />
              <StatsCard
                title="الفئات"
                value={categories?.length || 0}
                icon={FolderTree}
                testId="stats-categories"
              />
              <StatsCard
                title="الطلبات"
                value={orders?.length || 0}
                icon={ShoppingBag}
                testId="stats-orders"
              />
              <StatsCard
                title="العملاء"
                value={customers?.length || 0}
                icon={Users}
                testId="stats-customers"
              />
            </>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">إجمالي الإيرادات</p>
              <p className="text-4xl font-bold text-primary" data-testid="text-total-revenue">
                {totalRevenue.toFixed(2)} ر.س
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
            <CardTitle>آخر الطلبات</CardTitle>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                عرض الكل
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد طلبات بعد
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right">الإجمالي</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium" data-testid={`text-order-number-${order.id}`}>
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{parseFloat(order.total).toFixed(2)} ر.س</TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status || "pending"} />
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="icon" data-testid={`button-view-order-${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
