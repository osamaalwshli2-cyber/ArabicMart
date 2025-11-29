import { Link } from "wouter";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartItemCard } from "@/components/storefront/CartItemCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";

export default function Cart() {
  const { items, subtotal, clearCart, itemCount } = useCart();

  const shippingCost = subtotal > 200 ? 0 : 25;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2" data-testid="text-empty-cart">سلة التسوق فارغة</h1>
            <p className="text-muted-foreground mb-6">
              لم تقم بإضافة أي منتجات للسلة بعد
            </p>
            <Link href="/">
              <Button className="gap-2" data-testid="button-start-shopping">
                تسوق الآن
                <ArrowLeft className="h-4 w-4" />
              </Button>
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

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-cart-title">سلة التسوق</h1>
            <p className="text-muted-foreground">{itemCount} منتج</p>
          </div>
          <Button
            variant="outline"
            className="gap-2 text-destructive hover:text-destructive"
            onClick={clearCart}
            data-testid="button-clear-cart"
          >
            <Trash2 className="h-4 w-4" />
            إفراغ السلة
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard key={item.productId} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span data-testid="text-subtotal">{subtotal.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span data-testid="text-shipping">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">مجاني</span>
                    ) : (
                      `${shippingCost.toFixed(2)} ر.س`
                    )}
                  </span>
                </div>
                {subtotal < 200 && (
                  <p className="text-xs text-muted-foreground">
                    أضف منتجات بقيمة {(200 - subtotal).toFixed(2)} ر.س للحصول على شحن مجاني
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span className="text-primary" data-testid="text-total">{total.toFixed(2)} ر.س</span>
                </div>
                <Link href="/checkout" className="block">
                  <Button size="lg" className="w-full gap-2" data-testid="button-checkout">
                    إتمام الطلب
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    متابعة التسوق
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
