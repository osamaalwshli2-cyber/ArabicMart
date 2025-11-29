import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield, Store, BarChart3, Package, Users } from "lucide-react";

export default function AdminLanding() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-2xl space-y-8">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="h-10 w-10 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">لوحة تحكم المتجر</CardTitle>
              <p className="text-muted-foreground text-base">
                منطقة محمية - يتطلب تسجيل دخول آمن للوصول
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <BarChart3 className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">لوحة المعلومات</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">إدارة الطلبات</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">العملاء والمنتجات</p>
              </div>
            </div>

            <div className="space-y-3">
              <a href="/api/login" className="block">
                <Button 
                  size="lg" 
                  className="w-full gap-2 text-base" 
                  data-testid="button-admin-login"
                >
                  <Shield className="h-5 w-5" />
                  تسجيل الدخول باستخدام Replit
                </Button>
              </a>
              <Link href="/" className="block">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full gap-2 text-base"
                  data-testid="button-storefront-link"
                >
                  <Store className="h-5 w-5" />
                  العودة إلى المتجر
                </Button>
              </Link>
            </div>

            <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-2">معلومة أمان:</p>
              <p>تسجيل الدخول متاح حصرًا للمسؤولين المعتمدين. يتم استخدام مصادقة Replit الآمنة.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
