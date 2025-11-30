import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CheckoutAuthModal } from "@/components/storefront/CheckoutAuthModal";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Check, CreditCard, Banknote, Loader2 } from "lucide-react";

interface CheckoutForm {
  customerId?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: "cod" | "card";
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();

  const [showAuthModal, setShowAuthModal] = useState(true);
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    paymentMethod: "cod",
  });

  const [step, setStep] = useState(1);

  const shippingCost = subtotal > 200 ? 0 : 25;
  const total = subtotal + shippingCost;

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const orderData = {
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        shippingAddress: form.address,
        shippingCity: form.city,
        notes: form.notes,
        paymentMethod: form.paymentMethod,
        subtotal: subtotal.toString(),
        shippingCost: shippingCost.toString(),
        total: total.toString(),
        items: items.map((item) => ({
          productId: item.productId,
          productNameAr: item.product.nameAr,
          quantity: item.quantity,
          price: item.product.price,
          total: (parseFloat(item.product.price) * item.quantity).toString(),
        })),
      };
      const response = await apiRequest("POST", "/api/orders", orderData);
      return await response.json() as { orderNumber: string };
    },
    onSuccess: (data) => {
      clearCart();
      setLocation(`/order-confirmation/${data.orderNumber}`);
    },
    onError: () => {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إتمام طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city) {
      toast({
        title: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    createOrderMutation.mutate();
  };

  const handleAuthSuccess = (customerId: number, customerName: string, customerEmail: string) => {
    setForm((prev) => ({
      ...prev,
      customerId,
      name: customerName,
      email: customerEmail,
    }));
    setShowAuthModal(false);
  };

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CheckoutAuthModal open={showAuthModal} onSuccess={handleAuthSuccess} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8" data-testid="text-checkout-title">إتمام الطلب</h1>

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {step > 1 ? <Check className="h-5 w-5" /> : "1"}
              </div>
              <span className={step >= 1 ? "font-medium" : "text-muted-foreground"}>
                معلومات الشحن
              </span>
            </div>
            <div className="w-16 h-0.5 bg-muted mx-2" />
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {step > 2 ? <Check className="h-5 w-5" /> : "2"}
              </div>
              <span className={step >= 2 ? "font-medium" : "text-muted-foreground"}>
                الدفع والتأكيد
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الشحن</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم الكامل *</Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                          data-testid="input-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="example@email.com"
                          dir="ltr"
                          data-testid="input-email"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="+966 5x xxx xxxx"
                          dir="ltr"
                          data-testid="input-phone"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">المدينة *</Label>
                        <Input
                          id="city"
                          value={form.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          placeholder="الرياض"
                          data-testid="input-city"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">العنوان الكامل *</Label>
                      <Textarea
                        id="address"
                        value={form.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="الحي، الشارع، رقم المبنى"
                        data-testid="input-address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">ملاحظات إضافية</Label>
                      <Textarea
                        id="notes"
                        value={form.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        placeholder="ملاحظات للتوصيل (اختياري)"
                        data-testid="input-notes"
                      />
                    </div>
                    <Button onClick={handleNextStep} className="w-full" data-testid="button-next-step">
                      التالي: الدفع
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>طريقة الدفع</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={form.paymentMethod}
                      onValueChange={(value) => handleChange("paymentMethod", value)}
                      className="space-y-3"
                    >
                      <div
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover-elevate ${
                          form.paymentMethod === "cod" ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => handleChange("paymentMethod", "cod")}
                      >
                        <RadioGroupItem value="cod" id="cod" data-testid="radio-cod" />
                        <Banknote className="h-6 w-6 text-primary" />
                        <div>
                          <Label htmlFor="cod" className="font-medium cursor-pointer">
                            الدفع عند الاستلام
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            ادفع نقداً عند استلام طلبك
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover-elevate ${
                          form.paymentMethod === "card" ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => handleChange("paymentMethod", "card")}
                      >
                        <RadioGroupItem value="card" id="card" data-testid="radio-card" />
                        <CreditCard className="h-6 w-6 text-primary" />
                        <div>
                          <Label htmlFor="card" className="font-medium cursor-pointer">
                            بطاقة ائتمان
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Visa, Mastercard, مدى
                          </p>
                        </div>
                      </div>
                    </RadioGroup>

                    {form.paymentMethod === "card" && (
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-muted-foreground">
                          سيتم توجيهك لبوابة الدفع الآمنة بعد تأكيد الطلب
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        السابق
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={createOrderMutation.isPending}
                        className="flex-1"
                        data-testid="button-confirm-order"
                      >
                        {createOrderMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin ml-2" />
                            جاري التأكيد...
                          </>
                        ) : (
                          "تأكيد الطلب"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.productId} className="flex gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={item.product.images?.[0] || "https://placehold.co/64x64/e2e8f0/64748b?text=صورة"}
                            alt={item.product.nameAr}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.product.nameAr}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {parseFloat(item.product.price).toFixed(2)} ر.س
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span>{subtotal.toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الشحن</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">مجاني</span>
                      ) : (
                        `${shippingCost.toFixed(2)} ر.س`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>الإجمالي</span>
                    <span className="text-primary">{total.toFixed(2)} ر.س</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
